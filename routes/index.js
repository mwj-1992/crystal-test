var express = require('express');
var router = express.Router();

/* GET home page. */
// router.use('/public', require('/public'));

router.get('/', function(req, res, next) {
  // res.('index', { title: 'Express' });
  res.render('../public/index.html');
});

module.exports = router;
