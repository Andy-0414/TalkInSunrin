NodeJS Express MongoDB Template (NEM_Template)
======
NodeJS + Express + MongoDB 를 활용하여 만든 앱/웹 서버입니다.


사용방법
======

기본 세팅
------
.env 파일을 생성 후 아래와 같이 작성
### ./.env
<pre>
DB_URL=mongodb://localhost/NEM_TEMPLATE
DB_SECRET=SUPER_SECRET_STRING
PORT=80
</pre>
작성 후 <code>npm start</code> 로 서버 작동 (기본 포트 80)

### ./pm2.json
<pre>
{
    ...
    "instances": "CORE_NUMBER",
    "exec_mode": "cluster",
    ...
}
</pre>
클러스터링 사용 시 추가

라우터
------
### {BASE_URL}/auth/register (POST)
#### 요청
<pre>
{
    "email" : "VALUE",
    "username" : "VALUE",
    "password" : "VALUE"
}
</pre>
#### 성공 (201)
<pre>
{
    "result": true,
    "msg": "계정 생성",
    "data": null
}
</pre>


### {BASE_URL}/auth/login (POST)
#### 요청
<pre>
{
    "email" : "VALUE",
    "password" : "VALUE"
}
</pre>
#### 성공 (200)
<pre>
{
    "result": true,
    "msg": "로그인 성공",
    "data": "Bearer_TOKEN"
}
</pre>


### {BASE_URL}/auth/profile (POST)
#### 요청
<pre>
HEADER
Authorization : "Bearer_TOKEN"
</pre>
#### 성공 (200)
<pre>
{
    "result": true,
    "msg": "200 OK",
    "data": {
        "_id": "VALUE",
        "email": "VALUE",
        "username": "VALUE",
        "password": "VALUE",
        "registerTime": "VALUE",
        "lastLogin": "VALUE",
        "__v": 0
    }
}
</pre>


### {BASE_URL}/auth/changeProfile (POST)
#### 요청
<pre>
HEADER
Authorization : "Bearer_TOKEN"
{
    "username" : "VALUE"
}
</pre>
#### 성공 (200)
<pre>
{
    "result": true,
    "msg": "프로필 변경 성공",
    "data": "Bearer_TOKEN"
}
</pre>


### {BASE_URL}/auth/changePassword (POST)
#### 요청
<pre>
HEADER
Authorization : "Bearer_TOKEN"
{
    "password" : "VALUE",
    "newPassword" : "VALUE"
}
</pre>
#### 성공 (200)
<pre>
{
    "result": true,
    "msg": "비밀번호 변경 성공",
    "data": "Bearer_TOKEN"
}
</pre>


### {BASE_URL}/auth/removeAccount (POST)
#### 요청
<pre>
HEADER
Authorization : "Bearer_TOKEN"
{
    "password" : "VALUE"
}
</pre>
#### 성공 (200)
<pre>
{
    "result": true,
    "msg": "계정 삭제 성공",
    "data": null
}
</pre>

실행
======
## npm start
서버 시작

## npm run dev
개발 중 서버 시작 (자동갱신)

## npm run restart
서버 재시작

## npm run close
서버 종료

## npm run show
서버 상태 보기

## npm run monit
CUI로 서버 상태 보기