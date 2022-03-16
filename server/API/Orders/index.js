// Libraries
import express from 'express';

// Database Schema
import { OrderModel } from '../../database/allModel';

const Router = express.Router();

/*
Route       /order/:_id
Des         Get all orders based on id
Access      Public
Method      GET
*/

Router.get("/:_id", async(req, res)=>{
    try{
        const {_id} = req.params;
        const getOrders = await OrderModel.findOne({user: _id});
        
        if(!getOrders){
            return res.status(404).json({error: "User not found"});
        }

        return res.status(200).json({orders: getOrders});

    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route ----> /order/new/:_id
Des -------> Add new order
Params      _id
Method      POST
*/

Router.post("/new/:_id", async (req, res) =>{
    try{
        const { _id } = req.params;
        const {orderDetails} = req.body;

        const addNewOrder = await OrderModel.findOneAndUpdate({
            user: _id,
        },{
            $push: { orderDetails: orderDetails },
        },{
            new: true  // return object after updation
        });

        return res.json({order: addNewOrder});
    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

export default Router;
