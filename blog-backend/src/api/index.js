import Router from 'koa-router';
import posts from './posts';
import auth from './auth';

const api = new Router();

//바로 등록할땐 get이지만 다음 모듈이 위임하여 use 즉 주소가 api/posts로 들어와야 한다
api.use('/posts', posts.routes());
api.use('/auth', auth.routes());

//라우터를 내보내기
export default api;