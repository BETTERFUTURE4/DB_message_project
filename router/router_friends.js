var express = require('express');
var router = express.Router();
router.use(express.json());

// db.js에서 쿼리 불러오기
var { query } = require('../modules/db'); 
var require_info = "ID, NAME, LOGIN_STATE, STATUS_MESSAGE";

// 유저의 친구목록 조회
router.get('/list/', async (req,res) => {
    var  { My_id } = req.query;
    console.log(`${My_id}`)

    // 쿼리로 해당 유저의 친구정보 리스트 반환
    var my_friends_query = `SELECT Friend_id FROM friends WHERE My_id = '${My_id}' AND f_state = 1`;
    var my_friends = await query(`SELECT ${require_info} FROM user WHERE id IN (${my_friends_query})`);

    if (my_friends.length > 0) {
        res.send(my_friends);
    } else {
        res.send("No friends");
    }

});

// 유저의 친구 검색
router.get('/search/', async (req,res) => {
    var  { My_id, Friend_name } = req.query;
    console.log(`${My_id}, ${Friend_name}`);

    // 쿼리로 해당 유저의 특정 친구 반환
    var my_friends_query = `SELECT Friend_id FROM friends WHERE My_id = '${My_id}' AND f_state = 1`;
    var Friend_list = await query(`SELECT ${require_info} FROM user WHERE (id IN (${my_friends_query})) AND (name = '${Friend_name}')`);

    if (Friend_list.length > 0) {
        res.send(Friend_list);
    } else {
        res.send("No that friend");
    }
});

// 친구 추가->error?
// post로 friends에 새로운 값 추가
router.post('/add', async (req,res,next) => {
    var { My_id, Friend_id } = req.body;
    console.log(req.body);
    console.log("post 친구추가 시도: " + `${My_id} -> ${Friend_id}`);

    // 쿼리로 나와 친구의 존재여부 확인
    var isIn = await query(`SELECT * FROM user WHERE ID = '${My_id}' OR ID = '${Friend_id}'`);
    var isFriend = await query(`SELECT * FROM friends WHERE my_id = '${My_id}' AND friend_id = '${Friend_id}' AND f_state = 1`)

    if (isIn.length === 2 && isFriend.length === 0) {
        // 쿼리로 해당 유저의 특정 친구 반환
        var queryString = `INSERT INTO friends VALUES(null, '${My_id}', '${Friend_id}', 1);`;
        await query(queryString);
        res.send(`${My_id} - add friend : ${Friend_id}`);
    } else if (isFriend.length  > 0) {
        res.send("Already frined");
    }else {
        res.send("No that person");
    }
});

// 대안 : get으로 친구 추가
router.get('/add', async (req,res) => {
    var { My_id, Friend_id } = req.query;
    console.log("get 친구추가 시도: " + `${My_id} -> ${Friend_id}`);

    // 쿼리로 나와 친구의 존재여부 확인
    var isIn = await query(`SELECT * FROM user WHERE ID = '${My_id}' OR ID = '${Friend_id}'`);
    var isFriend = await query(`SELECT * FROM friends WHERE my_id = '${My_id}' AND friend_id = '${Friend_id}' AND f_state = 1`)

    if (isIn.length === 2 && isFriend.length === 0) {
        // 쿼리로 해당 유저의 특정 친구 반환
        var queryString = `INSERT INTO friends VALUES(null, '${My_id}', '${Friend_id}', 1);`;
        await query(queryString);
        res.send(`${My_id} - add friend : ${Friend_id}`);
    } else if (isFriend.length  > 0) {
        res.send("Already frined");
    }else {
        res.send("No that person");
    }
});

// 변경
// put으로 특정 관계의 f_state의 값 변경
router.put('/set/:My_id/:Friend_id/:f_state', async (req, res) => {
    var  { My_id, Friend_id, f_state } = req.params;
    console.log(`f_statue 변경: ${My_id}, ${Friend_id}, ${f_state}`);

    console.log(`SELECT * FROM friends WHERE my_id = '${My_id}' AND friend_id = '${Friend_id}'`);
    var isFriend = await query(`SELECT * FROM friends WHERE my_id = '${My_id}' AND friend_id = '${Friend_id}'`);
    console.log(isFriend);

    if (isFriend.length > 0) {
        // 해당 state 변경
        await query(`UPDATE friends SET f_state = '${f_state}' WHERE My_id = '${My_id}' AND Friend_id = '${Friend_id}'`);
        res.send({ message: `Changed : ${My_id} - ${Friend_id} state : ${f_state}` });
    } else {
        res.status(404).send({ message: `No Friend_id!! : ${Friend_id}` });
    }
});

// 특정 친구관계 제거
// delete로 특정 유저-친구 관계 삭제(쿼리)
router.delete('/delete/:My_id/:Friend_id', async (req, res) => {
    var  { My_id, Friend_id } = req.params;
    var isFriend = await query(`SELECT * FROM friends WHERE my_id = '${My_id}' AND friend_id = '${Friend_id}' AND f_state = 1`)

    if (isFriend.length > 0) {
        // 해당 id의 멤버 삭제
        await query(`DELETE FROM friends WHERE My_id = '${My_id}' AND Friend_id = '${Friend_id}';`);
        res.send({ message: `Deleted : ${My_id} - ${Friend_id}` });
    } else {
        res.status(404).send({ message: `NOT FOUND : Me(${My_id}) - Friend(${Friend_id})` });
    }
});

module.exports = router;