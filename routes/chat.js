var express = require('express');
var router = express.Router();

/* GET home page. */
router.put('/postMessage/:id', async (req, res, next) => {
  res.status(200).json('ok');
});

module.exports = router;