import express from 'express';

// Database Model

import { RestaurantModel } from '../../database/restaurent';

const Router = express.Router();

/*
Route       /
Des         Get all the restaurant details based on the city name
Params      none
access      public
method      get
*/

Router.get("/", async(req, res) => {
    try{
        const {city} = req.query;
        const restaurants = await RestaurantModel.find({city});
        return res.json({restaurants});
    }
    catch(error){
        return res.status(500).json({error: error.message})
    }
});

/*
Route       /restaurant
Des         Get individual restaurant details based on the id
Params      none
access      public
method      get
*/

Router.get("/:_id", async(req, res)=>{
    try{
        const {_id} = req.params;
        const restaurant = await RestaurantModel.findById({_id});

        if(!restaurant){
            return res.status(404).json({error: "Restaurant Not Found"});
        }
        return res.json({restaurant});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route       /restaurant/search
Des         Get all the restaurant details based on search string
Params      none
access      public
method      get
*/


Router.get("/search", async(req, res)=>{
    try{
        const {searchString} = req.body;
        const restaurants = await RestaurantModel.find({
            name: {$regex: searchString, $options: "i"},
        });

        if(!restaurants){
            return res.status(404).json({error: `No restaurant matched with ${searchString}`});
        }
        return res.json({restaurants});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
})

export default Router;