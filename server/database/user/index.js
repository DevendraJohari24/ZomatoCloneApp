import mongoose from "mongoose";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
const UserSchema = new mongoose.Schema({
    fullName: {type: String, required: true},
    email: { type: String, required: true },
    password: {type: String},
    address: [{details: {type: String}, for: {type: String}}],
    phoneNumber: [{ type: Number }],
},
{
    timestamps: true,
});

// Statics and Methods -->

UserSchema.methods.generateJwtToken = function () {
    return jwt.sign({user: this._id.toString()}, "ZomatoAPP");
}


UserSchema.statics.findByEmailAndPassword = async ({password, email}) => {
    const user = await UserModel.findOne({email});
    if(!user) throw new Error("User does not exist!!");

    // Compare Password
    const doesPasswordMatch = await bcrypt.compare(password, user.password);

    if(!doesPasswordMatch) throw new Error("Invalid Password");

    return user;
}


// Check whether email and phoneNumber Exists
UserSchema.statics.findByEmailAndPhone = async({ email, phoneNumber}) => {
    const checkUserByEmail = await UserModel.findOne({email: email});
    const checkUserByPhone = await UserModel.findOne({phoneNumber: phoneNumber});

    if(checkUserByEmail || checkUserByPhone){
        throw new Error("User Already Exists...!");
    }
    return false; // if we dont have error
}

UserSchema.pre("save", function (next){
    const user = this;
    // password is modified
    if(!user.isModified("password")) return next();
    // password decrypt salt
    bcrypt.genSalt(8, (error, salt)=>{
        if(error){
            return next(error);
        }
        // hash password
        bcrypt.hash(user.password, salt, (error, hash)=>{
            if(error){
                return next(error);
            }
            // assign hash password
            user.password = hash;
            return next();
        });
    });
});

export const UserModel = mongoose.model('Users', UserSchema);