## app.js
- 메인 백엔드 실행파일
---

## modules/
- 모듈 넣을 폴더
#### modules/db.js : DB 연결 모듈

---

## router/ 
- 기능별로 url 쪼개서 넣어놓기
#### router.friends.js : friends DB 관련 동작
- 각자 작업영역 라우터로 나눠 넣으면 좋을 듯

---

## test.http
- http url 별 실행결과 확인
- 프론트엔드로 전달되는 값을 확인할 수 있음
- vscode 확장 REST Client 설치
- 이후 Send Request 버튼 눌러 실행 가능

---

## 터미널 실행
- npm run dev -> 코드 수정 후 재시작 필요x (nodemon 모듈 이용)
  - 상세설명 : https://velog.io/@betterfuture4/expressTLL
- npm start -> 재시작 필요