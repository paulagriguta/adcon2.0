const express = require("express");
const router = express.Router();

const Project = require('../models/project')
// Display the dashboard page
router.get("/", async (req, res) => {
  var newProjects = [];
  var acceptedProjects = [];
  var rejectedProjects = [];
  if (req.user.profile.login == 'griguta.paula@gmail.com') {
    res.redirect('/dashboardAdmin');
  }
  else {

    await Project.find({ login: req.user.profile.login, status: "pending" }, { username: true }).sort({ dateSubmitted: -1 }).exec((err, projects) => {

      projects.forEach((item) => newProjects.push(item))
      // console.log(newProjects);
    });

    await Project.find({ login: req.user.profile.login, status: "accepted" }, { username: true }).sort({ dateSubmitted: -1 }).exec((err, projects) => {
      projects.forEach((item) => acceptedProjects.push(item))
    });
    await Project.find({ login: req.user.profile.login, status: "rejected" }, { username: true }).sort({ dateSubmitted: -1 }).exec((err, projects) => {
      projects.forEach((item) => rejectedProjects.push(item))
      res.render("dashboard", { newProjects: newProjects, acceptedProjects: acceptedProjects, rejectedProjects: rejectedProjects })
    });

  }
});

router.get('/:id', (req, res, next) => {
  Project.findOne({ _id: req.params.id }).exec((err, project) => {
    console.log(project)
    res.render('project', { project });
  });
});

router.post('/:id', (req, res, next) => {
  Project.findByIdAndUpdate(req.params.id, { projectType: req.body.body }, (err, post) => {

    let Pusher = require('pusher');
    let pusher = new Pusher({
      appId: process.env.PUSHER_APP_ID,
      key: process.env.PUSHER_APP_KEY,
      secret: process.env.PUSHER_APP_SECRET,
      cluster: process.env.PUSHER_APP_CLUSTER
    });

    pusher.trigger('notifications', 'post_updated', post, req.headers['x-socket-id']);
    console.log(pusher)
    res.send('');
  });
});

module.exports = router;