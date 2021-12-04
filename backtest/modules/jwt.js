const jwt = require('jsonwebtoken');
const cryptoKey = 'hello!';

exports.sign = data => jwt.sign(data, cryptoKey);

exports.verify = token => jwt.verify(data, cryptoKey);


exports. verifyMiddleWare = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) {
        throw new Error('Not Logged In');
    }

    req.decoded = jwt.verify(token, cryptoKey);
    next();
};