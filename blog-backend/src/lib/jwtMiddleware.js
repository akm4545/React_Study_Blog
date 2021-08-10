import jwt from 'jsonwebtoken';
import User from '../models/users';

//토근 검증 미들웨어
const jwtMiddleware = async (ctx, next) => {
    const token = ctx.cookies.get('access_token');

    if(!token) return next(); //토큰이 없으면 다음 미들웨어로 넘긴다 (미들웨어가 없다면 끝내고 리스폰스로 보냄)

    try{
        //토큰 유효성 확인
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        //스테이터스에 유저 해석된 토큰으로 유저정보 저장
        ctx.state.user = {
            _id: decoded._id,
            username: decoded.username,
        };
        //토큰의 남은 유효 기간이 3.5일 미만이면 재발급
        const now = Math.floor(Date.now() / 1000);

        if(decoded.exp - now < 60 * 60 * 24 * 3.5){
            //유저 정보를 찾아서 model 에 장착
            const user = await User.findById(decoded._id);
            //토큰 발급
            const token = user.generateToken();
            ctx.cookies.set('access_token', token, {
                maxAge: 1000 * 60 * 60 * 24 * 7, //7일
                httpOnly: true,
            });
        }

        return next();
    }catch(e){
        //토큰 검증 실패
        return next();
    }
};

export default jwtMiddleware;