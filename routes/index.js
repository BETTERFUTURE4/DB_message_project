var express = require('express');
var router = express.Router();

/* GET home page. */
// indexRouter process first argument 'http://127.0.0.1/'
// When HTTP GET request, function is called 
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/*
// When HTTP GET request on http://127.0.0.1/hello
router.get('/hello', function(req, res, next) {
  res.json({
    message: 'hello'
  });
});
*/
module.exports = router;
