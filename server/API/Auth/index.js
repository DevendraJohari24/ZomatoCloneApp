// Library
import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// Models
import { UserModel } from '../../database/user';
import passport from 'passport';

const Router = express.Router();
/*
Route       /signup
Desc        Register new user
Params      none
Access      Public
Method      POST
*/

Router.post("/signup", async(req, res)=>{
    try{
        const {email, password, fullName, phoneNumber} = req.body.credentials;
        
        await UserModel.findByEmailAndPhone(req.body.credentials);
        // save to database
        const newUser = await UserModel.create(req.body.credentials);

        // Generating JWT auth Tokens -> JSON web Tokens
        const token = newUser.generateJwtToken();
        return res.status(200).json({ token, status: "success"});
    }catch(error){
        return res.status(500).json({error: error.message});
    }
});

// Routing
Router.post('/signin', async (req, res) => {
    try{
        const user = await UserModel.findByEmailAndPassword(
                req.body.credentials
            );
        const token = user.generateJwtToken();
        return res.status(200).json({ token, status: "success"});

    }
    catch(error){
        return res.status(500).json({error: error.message});
    }
});

/*
Route       /auth/google
Description SignIn via Google
Params      none
Access      public
Method      POST
*/

Router.get("/google", 
    passport.authenticate("google", {
        scope: [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ],
    })
);

/*
Route       /auth/google
Description SignIn via Google
Params      none
Access      public
Method      POST
*/

Router.get("/google/callback", passport.authenticate("google", {failureRedirect: "/"}),
    (req, res) => {
        return res.json({token: req.session.passport.user.token})
    }
);

export default Router;