const express = require('express');
const multer = require('multer');
const { produceMessage } = require('./messageQueue'); // Assuming you have a separate module for message queue functionality

// Create an instance of the express application
const app = express();

// Create a class for handling image upload and processing
class ImageProcessor {
  constructor() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, 'uploads/');
      },
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix);
      },
    });

    this.upload = multer({ storage: storage }).single('image');
  }

  processImage(req, res, next) {
    this.upload(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: 'Error uploading file' });
      }

      // Access the uploaded file using req.file
      const uploadedFile = req.file;

      // Perform further processing or save the file as needed
      // For example, you can access the file properties like uploadedFile.filename, uploadedFile.path, etc.

      // Send the processed image to the message queue
      produceMessage(uploadedFile.path); // Assuming produceMessage is a function that sends the message to the message queue

      // Send a response
      res.send('File uploaded and processed successfully');
    });
  }
}

// Create an instance of the ImageProcessor class
const imageProcessor = new ImageProcessor();

// Define the route handler for file uploads
app.post('/upload', (req, res, next) => {
  imageProcessor.processImage(req, res, next);
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
