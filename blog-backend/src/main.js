require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';
import serve from 'koa-static';
import path from 'path';
import send from 'koa-send';

import api from './api';
import jwtMiddleware from './lib/jwtMiddleware';

//비구조화 할당을 통해 process.env 내부 값에 대한 레퍼런스 만들기
const {PORT, MONGO_URI} = process.env;

mongoose
.connect(MONGO_URI, {useNewUrlParser: true, useFindAndModify: false})
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch(e => {
        console.error(e);
    });
    

const app = new Koa();
const router = new Router();

// 라우터 설정 (메인 라우터 경로)
router.use('/api', api.routes()); // api 라우트 적용

//라우터 미들웨어 등록전에 등록 next로 순차적으로 다음 미들웨어로 넘기기 떄문
//Request Body에 JSON형식으로 데이터를 넣어주면 이를 파싱하여 서버에서 사용
// router적용 코드 윗부분에서 해야한다
app.use(bodyParser()); 
app.use(jwtMiddleware);

//app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

const buildDirectory = path.resolve(__dirname, '../../blog-frontend/build');
app.use(serve(buildDirectory));
app.use(async ctx => {
    //Not Found이고, 주소가 /api로 시작하지 않는 경우
    if(ctx.status === 404 && ctx.path.indexOf('/api') !== 0){
        //index.html 내용을 반환
        await send(ctx, 'index.html', {root:buildDirectory});
    }
});

//PORT가 지정되어 있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
    console.log('Listening to port %d', port);
});
