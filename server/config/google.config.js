import passport from 'passport';
import googleOAuth from 'passport-google-oauth20';

import {UserModel} from '../database/allModel';

const GoogleStrategy = googleOAuth.Strategy;

export default (passport) => {
    passport.use(
        new GoogleStrategy({
                clientID: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                callbackURL: "http://localhost:4000/auth/google/callback"
            },
            // after authenticating with google you will get those values
            async (accessToken, refreshToken, profile, done) => {
                // creating a new User object
                const newUser = {
                    fullName: profile.displayName,
                    email: profile.emails[0].value,
                    profilePic: profile.photos[0].value,
                };

                try{
                    // check if user exists
                    const user = await UserModel.findOne({ email: newUser.email });
                    if(user){
                        // generate Token 
                        const token = user.generateJwtToken();

                        // return 
                        done(null, {user, token});
                    }else{
                        // create a new user 
                        const user = await UserModel.create(newUser);

                        // generate token
                        const token = user.generateJwtToken();

                        // return user
                        done(null, {user, token});
                    }
                }
                catch(error){
                    done(error, null);
                }
            }
        )
    );
    passport.serializeUser((userData, done) => done(null, {...userData}));
    passport.deserializeUser((id, done)=> done(null, id));
};


