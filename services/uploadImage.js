import { Buffer } from 'node:buffer';
/* Uncomment to try sendToExternalServer*/
// import uploadManager  from'./uploadManager.js';
import fs from 'fs';
import path from 'path';

const generateName=(originalname)=>{
    const extension=path.extname(originalname);
    const fullNewFilename = originalname.replace(
        extension,
        `_${Date.now()}${extension}`,
    );
    return fullNewFilename;
}

const sendToExternalServer=(binaryPhoto,newName)=>{
    uploadManager
    .upload({
        accountId: "FW25bUG", 
        data: binaryPhoto,
        mime: "image/jpeg",
        originalFileName: newName,
        // Supported when: 'data' is not a stream.
        maxConcurrentUploadParts: 4,
        metadata: {
        // Up to 2KB of arbitrary JSON.
        productId: 60891
        },
        path: {
        folderPath: "/uploads/{UTC_YEAR}/{UTC_MONTH}/{UTC_DAY}",
        fileName: newName
        },
        cancellationToken: {
        isCancelled: false
        }
    })
    .then(
        ({ fileUrl, filePath }) => {
            console.log(`File path to: ${filePath}`);
            console.log(`File uploaded to: ${fileUrl}`);
        },
        error => console.error(`Upload failed: ${error.message}`, error)
    );
}

const saveOnLocalServer=(binaryPhoto,newName)=>{
    // route of the local server
    fs.writeFile(`./static/imagesToQueue/${newName}`, binaryPhoto, 'binary', (err)=>{
        if (err) throw err
        console.log('File saved.')
    })
}

const uploadImage=(req, res) =>{
    try {
        const imageFile = req?.file;
        const binaryPhoto = Buffer.from(imageFile.buffer).toString('binary');

        let newName = generateName(imageFile.originalname);
        // Save on local server
        saveOnLocalServer(binaryPhoto,newName);
        //sendToExternalServer=> Save on external server **Uncomment to try**
        // sendToExternalServer(binaryPhoto,newName);
        return({ success: true, message: "yeah uploaded!" })
    } catch (error) {
        return ({ success: false, message: error.message });
    }
    

}

export default uploadImage;