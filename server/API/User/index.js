import express from 'express';

// Database Schema
import { UserModel } from '../../database/allModel';

const Router = express.Router();

/*
Route for getting User data
*/

Router.get("/:_id", async (req, res) =>{
    try{
        const {_id} = req.params;
        const getUser = await UserModel.findById(_id);
        if(!getUser){
            return res.status(400).json({user: "User not Found"});
        }
        return res.json({user: getUser});
    }   
    catch(error){
        return res.status(500).json({error: error.message});
    }
});


/*
 Update user Data
PUT route
*/

Router.put("/update/:userId", async(req, res)=>{
    try{
        const {userId} = req.params;
        const { userData } = req.body;
        const updateUserData = await UserModel.findByIdAndUpdate(
        userId,
            {
            $set: userData,
        },
        {
            new: true,
        });

        return res.json({user: updateUserData});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});


export default Router;