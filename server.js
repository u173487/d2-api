const express = require('express');
const multer = require('multer');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' }); // Temporary directory for uploads

// Endpoint to convert D2 file to SVG
app.post('/convert', upload.single('file'), (req, res) => {
    const inputFile = req.file;

    // Validate file type
    if (!inputFile.originalname.endsWith('.d2')) {
        fs.unlinkSync(inputFile.path); // Cleanup uploaded file
        return res.status(400).send({ error: 'Only .d2 files are supported.' });
    }

    // Define output file path
    const outputFile = path.join('uploads', `${path.basename(inputFile.path)}.svg`);

    // Log the command being executed
    console.log(`Running command: d2 ${inputFile.path} ${outputFile}`);
    console.log('PATH:', process.env.PATH);//test line

    // Run D2 command to generate the output
    exec(`d2 ${inputFile.path} ${outputFile}`, { env: { PATH: process.env.PATH } }, (err, stdout, stderr) => {
        // Cleanup input file
        fs.unlinkSync(inputFile.path);

        if (err) {
            console.error('Error executing D2:', stderr);
            return res.status(500).send({ error: 'D2 conversion failed.', details: stderr });

        }

        // Send the generated SVG file as a response
        res.download(outputFile, 'diagram.svg', (downloadErr) => {
            if (downloadErr) {
                console.error('Error sending file:', downloadErr);
            }
            // Cleanup output file after sending
            fs.unlinkSync(outputFile);
        });
    });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`D2 API running at http://localhost:${PORT}`);
});
