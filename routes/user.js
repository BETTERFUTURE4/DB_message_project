var express = require('express');
var router = express.Router();
const {query} = require('../modules/db');
const {sign, verifyMiddleWare} = require('../modules/jwt');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
// -----------------------------로그인--------------------------------------
// ID, Password를 통한 로그인, 정보가 없을 경우 경고 문구 -- 1

// 부가사항
// JWT 토큰을 이용한 로그인 구현 -- 2
// HTTP Only Cookie에 JWT 토큰을 저장 -- 3

// Verify JWT 
router.get('/test', verifyMiddleWare, (req, res, next) => {
  const {id} = req.decoded;
  if(id){
    res.json({
      success: true
    });
  }
});

// Login
router.post('/login', async(req, res, next) => { // -- 1
  // extract id, password from HTTP POST request BODY
  const {id, password} = req.body;
  console.log('login');
  // check empty id or password
  if(!id || !password){
    return res.status(400).json({
        success: false,
        errorMessage: '아이디 또는 비밀번호를 입력해주세요.'
    });
  }
  console.log(id, password)
  // Send Query to DB and get Result
  const queryResult = await query(`SELECT * from user where ID = '${id}';`);
  console.log(queryResult);
  // query result array length > 0 or not
  if(queryResult.length > 0 && bcrypt.compareSync(password, queryResult[0].PW)){ // account exists
    const jwt = sign({ // create JWT -- 2
      id,
      name: queryResult[0].NAME 
    });
    res.cookie('token', jwt, { // save JWT on httpOnly cookie -- 3
      httpOnly: true,
      expires: new Date( Date.now() + 60*60*1000*24*7) // 7day
    }).json({ // response
      success: true,
      id,
      name: queryResult[0].NAME
    });
    await query(`UPDATE user SET LOGIN_STATE = 1 WHERE user.ID = '${id}';`);
  }
  else{ // account not exists
    res.json({ // response
      success: false,
      errorMessage: '아이디 또는 비밀번호가 잘못 입력 되었습니다.'
    })
  }
});

// Logout
router.post('/logout', verifyMiddleWare, async(req, res, next) => {
  const {id, name} = req.decoded; // decoded jwt from cookie and save it to variable
  if(id){
    res.clearCookie('token').json({ // clear jwt
      success: true
    })
    await query(`UPDATE user SET LOGIN_STATE = 0 WHERE user.ID = '${id}';`);
  }
  else{
    res.json({ // error
      success: false,
      errorMessage: '토큰이 존재하지 않습니다.'
    })
  }
});

// Get Login Status
router.get('/whoAmI', verifyMiddleWare, (req, res, next) => {
  const {id, name} = req.decoded;
  res.json({ // response id and name
    success: id ? true : false,
    id,
    name
  })
});

// --------------------------------------------------------------------

// --------------------------회원 가입 ---------------------------------
// ID, Password, 이름, 회원구분을 입력 -- 1
// ID, Password, 이름이 NULL일 경우 회원가입 불가 -- 2
// ID의 길이가 영문,숫자 포함 20자를 넘거나 특수문자 사용시 회원가입 불가 -- 3
// ID 중복확인 기능 구현 -- 4
// 입력된 정보를 DB에 저장 -- 5

// 부가사항
// 사용자의 비밀번호, 채팅 메시지가 암호화(인코딩)되어 저장 -- 6

// Sign Up
router.post('/signup', async (req, res, next) => {
  // extract id, password, name, type from HTTP POST request BODY -- 1
  const{id, password, name, type} = req.body;
  console.log('signup');
  // check empty id or password or name -- 2
  if(!id || !password || !name){
    console.log('Empty Information');
    return res.status(400).json({
        success: false,
        errorMessage: '아이디 또는 비밀번호 또는 이름을 입력해주세요.'
    });
  }
  console.log(id, password, name, type);
  // regular expression with at least one character and number with length 4~20 -- 3
  const id_regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{4,20}$/;
  // regular expression with alphabet or korean letters with length 3~20
  const name_regex = /^[가-힣a-zA-Z]{3,20}$/;

  if(!id_regex.test(id)){ // Not aprropriate ID
    console.log('Not Appropriate ID');
    res.json({
      success: false,
      errorMessage: '유효하지 않은 아이디입니다.'
    });
  }
  else if(!name_regex.test(name)){ // Not appropriate name
    console.log('Not Appropirae Name');
    res.json({
      success: false,
      errorMessage: '유효하지 않은 이름입니다.'
    });
  }
  else{ // appropriate ID
    // check duplicate ID
    const queryResult = await query(`SELECT * from user where ID = '${id}';`);
    console.log(queryResult);
    if(queryResult.length > 0){ // -- 4
      console.log('Duplicate ID');
      res.json({ // duplicate ID exists
        success: false,
        errorMessage: '이미 존재하는 아이디입니다.'
      });
    }
    else{ // No duplicate ID --> create account
      // Encrypt Password -- 6
      console.log('VALID Information');
      const ecpassword = bcrypt.hashSync(password, salt);
      console.log(ecpassword);
      // Insert User Information to DB -- 5
      await query(`INSERT INTO user(ID, PW, NAME, TYPE, LOGIN_STATE) VALUES('${id}', '${ecpassword}', '${name}', '${type}', 0);`);
      res.json({
        success: true
      });
    }
  }
});
// ----------------------------------------------------------------------
module.exports = router;
