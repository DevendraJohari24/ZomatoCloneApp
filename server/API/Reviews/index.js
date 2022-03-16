import express from 'express';

// Database Schema
import { ReviewModel } from '../../database/allModel';

const Router = express.Router();

/*
Route       /review/:resid
Des         
Paras
Access
Method

*/

Router.get("/:resid", async(req, res)=>{
    try{
        const {resid} = req.params;
        const reviews = await ReviewModel.find({restaurant: resid});
        return res.json({reviews});
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
});

/*
Adding a Review
*/

Router.post("/new", async(req, res)=>{
    try{
        const {reviewData} = req.body;

        await ReviewModel.create({...reviewData});
        return res.json({review: "Successfully Created Review"});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Delete review
*/

Router.delete("/delete/:_id", async(req, res)=>{
    try{
        const {_id} = req.params;
        await ReviewModel.findByIdAndDelete(_id);
        return res.json({review: "Successfully Deleted the Review"});
    }
    catch(error){
        return res.json(500).json({error: error.message});
    }
});

export default Router;