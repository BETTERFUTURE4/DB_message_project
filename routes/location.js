var express = require('express');
const { response } = require('../app');
var router = express.Router();
//router.use(express.json());

const {query} = require('../modules/db');

/* Get place list */
router.get('/place', async(req, res, next) => {
  try {
    const {place_userID} = req.body;
    const queryResult = await query(`SELECT BD_NAME, FLOOR_NUM, SSID FROM location WHERE USER_ID = '${place_userID}' AND LOCATION_STATE = 1;`);
    if(queryResult.length > 0){
      res.json({
        success: true,
        rows: queryResult
      });
    }
    else{
      res.json({
        success: false
      });
    } 
  }
  catch(error){
    next(error);
  }
});

/* Get online users list */
router.get('/SSID', async(req, res, next) => {
  try {
    const { userID, this_ssid } = req.body;
    const queryResult = await query (`SELECT NAME, TYPE, LOGIN_STATE, STATUS_MESSAGE
                                  FROM user WHERE ID IN (SELECT user_id FROM location
                                  WHERE SSID = '${this_ssid}' AND LOCATION_STATE = 1 OR LOCATION_STATE = 2
                                  AND USER_ID != '${userID}');`);
    if(queryResult.length > 0){
      res.json({
        success: true,
        rows: queryResult
      });
    }
    else{
      res.json({
        success: false
      });
    }
  }
  catch(error) {
    next(error);
  }
});


/* Nearby user _ get users list */
//CHECK WHETHER queryString works well
router.get('/nearby', async(req, res, next) => {
  try {
    const {near_userID} = req.body;

    const [rows, field] = await query(`SELECT LATITUDE, LONGTITUDE FROM location
                                                WHERE USER_ID = '${near_userID}' AND LOCATION_STATE = 1`);
    console.log(rows.LATITUDE, rows.LONGTITUDE);
    const queryString = `SELECT user.NAME, user.TYPE, user.LOGIN_STATE, user.STATUS_MESSAGE,
                        (6371*acos(cos(radians('${rows.LATITUDE}'))*cos(radians(location.LATITUDE))*cos(radians(location.LONGTITUDE)-radians('${rows.LONGTITUDE}'))+sin(radians('${rows.LATITUDE}'))*sin(radians(location.LATITUDE))))
                        AS distance FROM user
                        LEFT JOIN location ON user.ID = location.USER_ID
                        WHERE location.USER_ID != '${near_userID}' AND (location.LOCATION_STATE = 1 OR location.LOCATION_STATE = 2)
                        HAVING distance <= 0.5 ORDER BY distance`;
    const queryResult = await query (queryString);
    console.log(queryResult)
    if(queryResult.length > 0){
      res.json({
        success: true,
        result: queryResult
      });
    }
    else{
      res.json({
        success: false
      })
    }
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
    
    const checkExist = await query (`SELECT * FROM location WHERE USER_ID = '${new_userID}' AND LATITUDE = '${new_lat}' AND LONGTITUDE = '${new_long}'
                                      AND BD_NAME = '${new_bd_name}' AND FLOOR_NUM = ${new_f_num} AND SSID = '${new_ssid}' AND IP = '${new_ip}'`);
    if (checkExist.length == 0) {
      res.json({
        success: true
      });
      await query (`INSERT INTO location(USER_ID, LOCATION_STATE, LATITUDE, LONGTITUDE, BD_NAME, FLOOR_NUM, SSID, IP)
                    VALUES('${new_userID}', 4, '${new_lat}', '${new_long}', '${new_bd_name}', ${new_f_num}, '${new_ssid}', '${new_ip}')`);
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
