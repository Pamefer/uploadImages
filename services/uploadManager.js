import * as Upload from 'upload-js-full';
import fetch from 'node-fetch';

const uploadManager = new Upload.UploadManager(
  new Upload.Configuration({
    fetchApi: fetch,
    apiKey: "secret_FW25bUGEGnB4Ftfzxa9oTid4YMRh" 
  })
);
export default uploadManager;
