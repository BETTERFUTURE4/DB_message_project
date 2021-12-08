var express = require('express');
var router = express.Router();
//router.use(express.json());

const { query } = require('../modules/db');
const { verifyMiddleWare } = require ('../modules/jwt');

/* Put Status message */
router.post('/userStMsg', async(req, res, next) => {
  try {
    const { My_id, statusMsg} = req.body;
    const mstRegex = /^[ㄱ-ㅎ가-힣]{1,20}$/    
    if (!mstRegex.test(statusMsg)) {
      console.log("T")
      res.json({
        success: false,
        errorMessage: '1자 이상 20자 이상의 한글로만 입력해주세요.'
      });
    }
    else {
      await query(`UPDATE user SET status_message = '${statusMsg}' WHERE id = '${My_id}'`);
      res.json({
        success: true
      })
    }
  } catch (error) {
    next(error)
  }
});

/*UPDATE - Get lat, long, building name, floor number, SSID, IP*/
/*DB: 'location' table _ LATITUDE, LONGTITUDE, BD_NAME, FLOOR_NUM, SSID, IP: NOT NULL
Bc the row will be created only when the user pressed the 'UPDATE' button */
/*Search through the table and get the user's previous location in status 1 and turn it into 0.*/

router.post('/locInfo', async(req, res, next) => {
  try {
    const {my_id_loc, lat, long, bd_name, f_num, ssid, ip} = req.body;    
    //const queryCheck = await query (`SELECT EXISTS (SELECT * FROM location
    //                                WHERE USER_ID = '${my_id_loc}'AND LOCATION_STATE = 1 AND LATITUDE = '${lat}' AND LONGTITUDE = '${long}' AND BD_NAME = '${bd_name}'
    //                                AND FLOOR_NUM = ${f_num} AND SSID = '${ssid}' AND IP = '${ip}')`);
    const queryCheck = await query (`SELECT * FROM location
                                      WHERE USER_ID = '${my_id_loc}'AND LOCATION_STATE = 1 AND LATITUDE = '${lat}' AND LONGTITUDE = '${long}' AND BD_NAME = '${bd_name}'
                                      AND FLOOR_NUM = ${f_num} AND SSID = '${ssid}' AND IP = '${ip}';`);    
    if (queryCheck.length > 0) {
      console.log("SAME")
      res.json({
        success: false,
        errorMessage: '이전과 같은 위치입니다.'
      });
    }
    else {
      console.log("DIFF")
      await query (`UPDATE location SET LOCATION_STATE = 0 WHERE USER_ID = '${my_id_loc}' AND LOCATION_STATE = 1`);
      await query (`INSERT INTO location(USER_ID, LOCATION_STATE, LATITUDE, LONGTITUDE, BD_NAME, FLOOR_NUM, SSID, IP)
                    VALUES('${my_id_loc}', 1, '${lat}', '${long}', '${bd_name}', ${f_num}, '${ssid}', '${ip}')`);
      res.json({
        success: true
      });
    }   
  } catch (error) {
    next(error)
  }
})

/*LogOut + Location_State : 2 //YOU SHOULD SET LOCATION_STATE = 1 WHEN LOGIN 
router.post('/signOut', verifyMiddleWare, async(req, res, next) => {
  const id = req.decoded;

  if (id) {
    await query(`UPDATE location SET LOCATION_STATE = 2 WHERE user_id = '${id}' AND LOCATION_STATE = 1`);
    res.clearCookie('token').json({
      success: true
    })
    
  } else {
    res.json({
      success: false,
      errorMessage: '토큰이 존재하지 않습니다.'
    })
  }
});
*/
/*Delete Account*/
router.post('/delAccount', async(req, res, next) => {
  try {
    const {delId} = req.body;
    const queryResult = await query(`SELECT * from user WHERE id = '${delId}';`);    
    if (queryResult.length > 0) {
      await query(`DELETE from user WHERE id = '${delId}'`);          
      res.send('탈퇴 완료');          
    }
    else {
      res.send('No data');
    }
  } catch(error) {
    next(error)
  }
});

module.exports = router;
