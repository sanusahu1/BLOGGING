const JWT = require('jsonwebtoken');

const secret = "!@#$%^&SANU^%$#@sanu";

function createTokenForUser(user){
    const payload = {
        _id: user._id,
        email: user.email,
        profilePicUrl: user.profilePicUrl,
        role: user.role,
    };
    const token = JWT.sign(payload, secret , {
        expiresIn:'24h'
    });
    
    return token;
}

function validateToken(token){
    const payload = JWT.verify(token , secret);
    return payload;
}

module.exports = {
    createTokenForUser ,
    validateToken,
}