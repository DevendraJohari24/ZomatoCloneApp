import express from 'express';
import multer from 'multer';

import { ImageModel } from '../../database/allModel'; 

// upload to s3
import { s3Upload } from '../../utils/AWS/s3';

const Router = express.Router();

//multer confriguration
const storage = multer.memoryStorage();
const upload = multer({storage});



/*
Route --- /image
Des   --- upload given image to s3 bucket and saves files link to mongoDB
Params --- none
Access --- public
Method --- Post
*/

Router.post('/', upload.single("file"), async(req, res)=>{
    try{
        const file = req.file;
        //s3 bucket options
        const bucketOptions = {
            Bucket: "shapeai-dev-zomato",
            Key: file.originalname,
            Body: file.buffer,
            ContentType: file.mimetype,  // multipurpose internet mail extention
            ACL: "public-read" //Access Control List
        };
       
        const uploadImage = await s3Upload(bucketOptions);
        
        return res.status(200).json({uploadImage});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});


export default Router;