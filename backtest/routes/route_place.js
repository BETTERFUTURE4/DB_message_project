var express = require('express');
var router = express.Router();
router.use(express.json());

const {query} = require('../modules/db');


/* Get place list */
router.get('/place', async(req, res, next) => {
  try {
    const place_userID = req.body;
    [rows, fields] = await query (`SELECT BD_NAME, FLOOR_NUM, SSID FROM location WHERE USER_ID = '${place_userID}';`);
    
    res.send(rows);
    
  }
  catch(error){
    next(error);
  }
});

/* Get online users list */
router.get('/:SSID', async(req, res, next) => {
  try {
    const { userID, this_ssid } = req.body;
    [rows, fields] = await query (`SELECT NAME, TYPE, LOGIN_STATE, STATUS_MESSAGE
                                  FROM user WHERE ID = user_id IN (SELECT user_id FROM location
                                  WHERE SSID = '${this_ssid}' AND LOCATION_STATE = 1 OR LOCATION_STATE = 2
                                  AND USER_ID != '${userID}';);`);

    res.send(rows);
  }
  catch(error) {
    next(error);
  }
});


/* Nearby user _ get users list */
//CHECK WHETHER queryString works well
router.get('/nearby', async(req, res, next) => {
  try {
    const near_userID = req.body;

    const { user_lat, user_long } = await query(`SELECT LATITUDE, LONGTITUDE FROM location
                                                WHERE USER_ID = '${near_userID}' AND LOCATION_STATE = 1;`);

    const queryString = `SELECT A.NAME, A.TYPE, A.LOGIN_STATE, A.STATUS_MESSAGE,
                        (6371*acos(cos(radians('${user_lat}'))*cos(radians(B.LATITUDE))*cos(radians(B.LONGTITUDE)-radians('${user_long}'))+sin(radians('${user_lat}'))*sin(radians(B.LATITUDE))))
                        AS distance FROM user A, location B HAVING distance <= 0.5 ORDER BY distance WHERE B.USER_ID != '${near_userID}';`;
    [rows, fields] = await query (queryString);

    res.send(rows);
  }
  catch(error) {
    next(error);
  }
});



/* Upload new place _ CSV */
/* After updating new place to DB, update the place tree again (by pressing 'place' again, etc)*/
router.post('/newplace', async(req, res, next) => {
  try {
    const {new_userID, new_lat, new_long, new_bd_name, new_f_num, new_ssid, new_ip} = req.body;
    
    const checkExist = await query (`SELECT EXISTS(SELECT * FROM location WHERE USER_ID = '${new_userID}' AND LATITUDE = '${new_lat}' AND LONGTITUDE = '${new_long}'
                                      AND BD_NAME = '${new_bd_name}' AND FLOOR_NUM = ${new_f_num} AND SSID = '${new_ssid}' AND IP = '${new_ip}';);`);

    if (checkExist == 0) {
      await query (`INSERT INTO location(USER_ID, LOCATION_STATE, LATITUDE, LONGTITUDE, BD_NAME, FLOOR_NUM, SSID, IP)
      VALUES('${new_bd_name}', 4, '${lat}', '${long}', '${bd_name}', ${f_num}, '${ssid}', '${ip}');`);
    }

    else {
      res.json({
        success: false,
        errorMessage: '이미 등록된 장소입니다.'
      });
    }
  }
  catch(error) {
    next (error);
  }
});


module.exports = router;
