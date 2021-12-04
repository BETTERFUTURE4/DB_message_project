const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// friends 테이블 처리
var router_friends = require('./router/router_friends');
app.use('/api/friends/',router_friends);

app.get('/api/', (req,res) => {
    res.send("Hello world!");
});

// 서버 실행 : 포트넘버 5106
app.listen(5106, () => {
    console.log('Server is listening...');
});