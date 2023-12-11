const mongoose = require('mongoose'); // Erase if already required
const { createHmac, randomBytes } = require("node:crypto");
const { createTokenForUser, validateToken } = require('../services/auth');

// Declare the Schema of the Mongo model
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        // index:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    salt:{
        type:String,
    },
    password:{
        type:String,
        required:true,
    },
    profilePicUrl:{
        type:String,
        default: "/images/user.png",
    },
    role:{
        type:String,
        enum: ["USER" , "ADMIN"],
        default: "USER",
    }
} , {timestamps:true} );

userSchema.pre('save' , function (next) {
    const user = this;
    if(!user.isModified("password")) return;

    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac("sha256" , salt ).update(user.password).digest("hex");

    this.salt = salt;
    this.password = hashedPassword;

    next();
});

userSchema.static('matchPasswordAndGenerateToken',async function(email , password){
    const user = await this.findOne({ email });
    if(!user) throw new Error('User not found');

    const salt = user.salt;
    const hashedPassword = user.password;

    const userProvidedPaswordhash = createHmac("sha256" , salt )
    .update(password)
    .digest("hex");

    if(hashedPassword !== userProvidedPaswordhash)
    throw new Error('Incorrect Password');
    //return { ...user, password: undefined , salt:undefined };

    const token = createTokenForUser(user);
    return token;
});
//Export the model
module.exports = mongoose.model('User', userSchema);