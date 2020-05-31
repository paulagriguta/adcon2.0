const express = require("express");
const router = express.Router();

const Project = require('../models/project')
// Display the dashboard page
router.get("/", async (req, res) => {

    var newProjects = [];
    var acceptedProjects = [];
    var rejectedProjects = [];
    await Project.find({ status: "pending" }, { username: true }).sort({ dateSubmitted: -1 }).exec((err, projects) => {

        projects.forEach((item) => newProjects.push(item))
        // console.log(newProjects);
    });

    await Project.find({ status: "accepted" }, { username: true }).sort({ dateSubmitted: -1 }).exec((err, projects) => {
        projects.forEach((item) => acceptedProjects.push(item))
    });
    await Project.find({ status: "rejected" }, { username: true }).sort({ dateSubmitted: -1 }).exec((err, projects) => {
        projects.forEach((item) => rejectedProjects.push(item))
        res.render("dashboardAdmin", { newProjects: newProjects, acceptedProjects: acceptedProjects, rejectedProjects: rejectedProjects })
    });



});

router.get('/:id', (req, res, next) => {
    Project.findOne({ _id: req.params.id }).exec((err, project) => {
        console.log(project)
        res.render('projectAdmin', { project });
    });
});

router.post('/:id', (req, res, next) => {
    Project.findByIdAndUpdate(req.params.id, { status: req.body.body }, (err, post) => {

        let Pusher = require('pusher');
        let pusher = new Pusher({
            appId: process.env.PUSHER_APP_ID,
            key: process.env.PUSHER_APP_KEY,
            secret: process.env.PUSHER_APP_SECRET,
            cluster: process.env.PUSHER_APP_CLUSTER
        });

     //   pusher.trigger('notifications', 'post_updated', post, req.headers['x-socket-id']);
        pusher.trigger('updates', 'my_post_updated', post, req.headers['x-socket-id']);
        console.log(pusher)
        res.send('');
    });
});

module.exports = router;