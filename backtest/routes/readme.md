두 대상의 대화내용을 반환하는 query가 필요하면 추가해주세요 => 필요하면 front에 db를 return해주는 함수로 새로 만들기?<br>
대충 이런느낌<br>
```
const {query} = require('../modules/db');
router.get('/', async(req, res, next) => {
  const {id1, id2} = req.body;
  const queryResult = await query(`SELECT * from chat where (SENDER=${id1} and RECEIVER=${id2}) OR (SENDER=${id2} and RECEIVER=${id1});`);
  if(queryResult.length > 0){
    res.json({
      success: true,
      info: queryResult
    })
  }
  else{
    res.json({
      success: false
    })
  }
}
```
