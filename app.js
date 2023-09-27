import express from 'express';
import multer from 'multer';
import path from 'path';
import  uploadImage  from './services/uploadImage.js';

const app = express();

const limits = {
    fileSize: 1024 * 1024, // 1 MB max
};

// const multerImageConfig = multer({
//     storage: multer.diskStorage({
//         destination : function (req, file, cb) {
//           cb(null, 'uploads/');
//         },
//         filename: function (req, file, cb) {
//           // Generate a unique filename for the uploaded file
//           const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//           cb(null, file.fieldname + '-' + uniqueSuffix);
//         }}),
//     fileFilter: (req, file, cb) => {
//         if (!['.jpg','.jpeg','.png'].includes(path.extname(file.originalname))) {
//             return cb(new multer.MulterError('No format accepted', file.originalname), false);
//         }
//         return cb(file.buffer, true);
//     },
//     limits,
// });
const multerImageConfig = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (!['.jpg','.jpeg','.png'].includes(path.extname(file.originalname))) {
            return cb(new multer.MulterError('No format accepted', file.originalname), false);
        }
        return cb(file.buffer, true);
    },
    limits,
});
const imageUploadFile = multerImageConfig.single('image');

app.post('/uploadImage', 
    (req, res) => {
        imageUploadFile(req, res, err => {
            if (err instanceof multer.MulterError) {
                return res.status(400).send({ success: false, error: err });
            }
            const {success, message} = uploadImage(req, res);
            if (!success){
                res.status(500)
                return res.send({ success, message })
            }
            res.status(200)
            return  res.send({ success, message });
        });
    });

export default app;

