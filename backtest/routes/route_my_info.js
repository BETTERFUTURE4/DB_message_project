var express = require('express');
var router = express.Router();
router.use(express.json());

const {query} = require('../modules/db');

/* Put Status message */
router.post('/userStMsg', async(req, res, next) => {
  try {
    const { My_id, statusMsg} = req.body;
    const mstRegex = /^[ㄱ-ㅎ가-힣]{1,20}$/
    
    if (!mstRegex.test(statusMsg)) {
      res.json({
        success: false,
        errorMessage: '1자 이상 20자 이상의 한글로만 입력해주세요.'
      });
    }
    else {
      await query(`UPDATE user SET status_message = '${statusMsg}' WHERE id = '${My_id}';`);
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
    let queryCheck = [];
    queryCheck = await query (`SELECT LATITUDE, LONGTITUDE, BD_NAME, FLOOR_NUM, SSID, IP FROM location
                                    WHERE USER_ID = '${my_id_loc}'AND LOCATION_STATE = 1;`);

    if (results == [lat, long, bd_name, f_num, ssid, ip]) {
      res.json({
        errorMessage: '이전과 같은 위치입니다.'
      });
    }

    else {
      await query (`UPDATE location SET LOCATION_STATE = 0 WHERE USER_ID = '${my_id_loc}' AND LOCATION_STATE = 1;`);


      await query
      (`INSERT INTO location(USER_ID, LOCATION_STATE, LATITUDE, LONGTITUDE, BD_NAME, FLOOR_NUM, SSID, IP)
      VALUES('${my_id_loc}', 1, '${lat}', '${long}', '${bd_name}', ${f_num}, '${ssid}', '${ip}');`);
  
    }

   
  } catch (error) {
    next(error)
  }
})

/*LogOut + Location_State : 2 //YOU SHOULD SET LOCATION_STATE = 1 WHEN LOGIN */
router.get('/signOut', verifyMiddleware, (req, res, next) => {
  const {id, name} = req.decoded;

  if (id) {
    res.clearCookie('token').json({
      success: true
    })

    query(`UPDATE location SET LOCATION_STATE = 2 WHERE user_id = '${id}}' AND LOCATION_STATE = 1;`);
    
  } else {
    res.json({
      success: false,
      errorMessage: '토큰이 존재하지 않습니다.'
    })
  }
});

/*Delete Account*/
router.post('/', async(req, res, next) => {
  try {
    const {delId, delPW} = req.body;

    await query(`SELECT * from user WHERE id = '${delId}' AND pw = '${delPW}';`);
      if (!err) {
        if (rows[0] != undefined) {
          await query(`DELETE from user WHERE id = '${id}';`);
            if (!err) {
              res.send('탈퇴 완료');
            }
            else {
              res.send('error: ' + err);
            }
        }
        else {
          res.send('No data');
        }
      }
      else {
        res.send('error: ' + err);
      }

  } catch(error) {
    next(error)
  }
});

module.exports = router;
