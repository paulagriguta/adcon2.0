const express = require('express');
const router = express.Router();
const Pdf = require('../models/pdfModel')

const session = require('express-session');
router.use(session({ secret: 'mySecret', resave: false, saveUninitialized: false }));
const pdfMake = require('../pdfmake/pdfmake');
const vfsFonts = require('../pdfmake/vfs_fonts');
var bodyParser = require("body-parser")

pdfMake.vfs = vfsFonts.pdfMake.vfs
///pdfMake.vfs = vfsFonts.pdfMake.vfs;
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: false }))



router.get('/', (req, res) => {

    const { username } = req.query.username;
    console.log(req.query.username);
    setTimeout(()=>{
        Pdf.findOne({ username: username }, {}).sort({ dateSubmitted: -1 }).exec((err, post) => {
            const js = post;
            console.log(js);
            if (js.projectType == 'renovare') {
                var documentDefinition = {
                    content: [
    
                        { text: 'Proiect Renovare', style: 'header' },
                        `Detalii proiect renovare pentru ${js.username}`,
                        `Renovare: ${js.building}`,
                        `Adresa: ${js.adresa}`,
                        { text: 'Detalii proiect', style: 'subheader' },
                        {
                            style: 'tableExample',
                            color: '#444',
                            table: {
                                //widths: [200, 'auto', 'auto'],
                                headerRows: 1,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [
                                        { text: 'Elemente', style: 'tableHeader', colSpan: 2, alignment: 'center' },
                                        { text: 'Număr Unități', style: 'tableHeader', colSpan: 1, alignment: 'center' },
                                        { text: 'Preț Unitate', style: 'tableHeader', colSpan: 1, alignment: 'center' },
                                        { text: 'Preț Total', style: 'tableHeader', colSpan: 1, alignment: 'center' }
                                    ],
    
    
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 4'],
                                ]
                            }
                        }]
                }
            }
            else {
                var documentDefinition = {
                    content: [
    
                        { text: 'Proiect Construcție Casă', style: 'header' },
                        `Detalii proiect construcție pentru ${js.username}`,
                        `Adresa: ${js.adresa}`,
                        { text: 'Detalii proiect', style: 'subheader' },
                        {
                            style: 'tableExample',
                            color: '#444',
                            table: {
                                // widths: [200, 'auto', 'auto'],
                                headerRows: 1,
                                // keepWithHeaderRows: 1,
                                body: [
                                    [{ text: 'Elemente', style: 'tableHeader', colSpan: 1, alignment: 'center' },
                                    { text: 'Număr Unități', style: 'tableHeader', colSpan: 1, alignment: 'center' }, { text: 'Preț Unitate', style: 'tableHeader', colSpan: 1, alignment: 'center' }, { text: 'Preț Total', style: 'tableHeader', colSpan: 1, alignment: 'center' }],
    
    
                                    ['Sample value 1', 'Sample value 2', 'Sample value 3', 'Sample value 4'],
                                ]
                            }
                        }]
    
    
    
                }
            }
            const pdfDoc = pdfMake.createPdf(documentDefinition);
            pdfDoc.getBase64((data) => {
                res.writeHead(200,
                    {
                        'Content-Type': 'application/pdf',
                        'Content-Disposition': 'attachment;filename="Proiect ' + req.query.username + '.pdf"'
                    });
    
                const download = Buffer.from(data.toString('utf-16'), 'base64');
                res.end(download);
            });
    
        });
    }, 2000)
    


});


module.exports = router;