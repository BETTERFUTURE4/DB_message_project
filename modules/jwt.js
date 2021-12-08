const jwt = require('jsonwebtoken');
const cryptoKey = 'hello!';

// Data -> JWT
exports.sign = data => jwt.sign(data, cryptoKey);

// JWT -> Data
exports.verify = token => jwt.verify(token, cryptoKey);

// express.js middleWare for verifying
// Check JWT exists or not
exports.verifyMiddleWare = (req, res, next) => {

    //const token = req.headers['x-access-token'];
    //if(!token) throw new Error('Not Logged In');
    const {token} = req.cookies;
    req.decoded = token ? jwt.verify(token, cryptoKey) : {};
    next();
}