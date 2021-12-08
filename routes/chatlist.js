var express = require('express');
var router = express.Router();

const {query} = require('../modules/db');
// 채팅 목록
// 채팅을 주고받았던 사용자중 현재 접속중인 사용자와 미접속 중인 사용자를 UI를 통해 구분 -- 1

// 사용자를 기준으로 대화 기록이 있는 목록을 만듦
// (사용자, 상대방)에 해당하는 채팅의 가장 마지막 row를 가져옴
// row를 내림차순으로 정렬
// 상대방의 접속상태를 가져옴

// show chatlist
router.get('/', async(req, res, next) => {
  const {id} = req.body;
  console.log('chatlist');
  const queryResult1 = await query(`SELECT * from chat where SENDER = '${id}' OR RECEIVER = '${id}';`);
  var recents = []; // varaible for saving recent chatlists
  for(var i=0; i<queryResult1.length; ++i){ // extract recent chatlist
    var flag = true;
    var target = queryResult1[i];
    for(var j=0; j<recents.length; ++j){
      if(target.SENDER == recents[j].SENDER && target.RECEIVER == recents[j].RECEIVER){
        if(target.CREATED_AT > recents[j].CREATED_AT){
          recents[j] = target;
        }
        flag = false;
        break;
      }
      else if(target.RECEIVER == recents[j].SENDER && target.SENDER == recents[j].RECEIVER){
        if(target.CREATED_AT > recents[j].CREATED_AT){
          recents[j] = target;
        }
        flag = false;
        break;
      }
    }
    if(flag) recents.push(target);
  }
  recents.sort(function(a,b){
    return b.CREATED_AT - a.CREATED_AT;
  });
  var Status = []; // variable for saving connection status -- 1
  for(var i=0; i<recents.length; ++i){
    var queryResult2;
    if(recents[i].SENDER == id){
      queryResult2 = await query(`SELECT LOGIN_STATE from user where ID = '${recents[i].RECEIVER}';`);
    }
    else{
      queryResult2 = await query(`SELECT LOGIN_STATE from user where ID = '${recents[i].SENDER}';`);
    }
    Status.push(queryResult2[0].LOGIN_STATE);
  }
  if(recents.length > 0){
    res.json({ // send true and chat table row with each row's status
      success: true,
      info: recents,
      status: Status
    });
  }
  else{ // no chat list
    res.json({ // send false
      success: false
    });
  }
});

module.exports = router;