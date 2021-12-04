var express = require('express');
var router = express.Router();
router.use(express.json());

const {query} = require('../modules/db');


/* Get place list */
router.post('/place', async(req, res, next) => {
  try {
    const {place_userID} = req.body;
    await query (`SELECT BD_NAME, FLOOR_NUM, SSID FROM location;`);
    
    res.json({
      result
    })

    
  }
  catch(error){
    next(error);
  }
});

/* Get online users list */


/* Nearby user _ get users list */



/* Upload new place _ CSV */

module.exports = router;
