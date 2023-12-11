const { validateToken } = require("../services/auth");

function checkForAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        if (!tokenCookieValue) {
            return next(); // Return here to exit the middleware if there's no token
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
            return next(); // Return here to continue to the next middleware
        } catch (error) {
            // Handle the error if needed
            return next(); // Return here to continue to the next middleware
        }
    };
}

module.exports = {
    checkForAuthenticationCookie,
};
