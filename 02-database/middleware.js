const jwt = require('jsonwebtoken');

function authenticateWithJWT(req, res, next) {
    const authHeader = req.headers.authorization;
    if (authHeader) {
        const token = authHeader.split(" ")[1];

        jwt.verify(token, process.env.TOKEN_SECRET, (err, payload) => {
            if (err) {
                res.status(400);
                return res.json({
                    "error": err
                })
            } else {
                req.payload = payload;
                next();
            }
        })
    } else {
        res.status(400);
        res.json({
            "error": "login required to access the protected route"
        })
    }
}

module.exports = { authenticateWithJWT }