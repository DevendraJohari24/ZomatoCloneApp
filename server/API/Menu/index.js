import express from "express";

import { MenuModel, Image } from "../../database/allModel";

const Router = express.Router();

/* */

Router.get("/list/:_id", async(req, res)=>{
    try{
        const {_id} = req.params;
        const menus = await MenuModel.findById(_id);
        return res.json({menus});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});


/* */

Router.get("/image/:_id", async (req, res)=>{
    try{
        const {_id} = req.params;

        const menus = await ImageModel.findOne(_id);
        return res.json({menus});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});


export default Router;