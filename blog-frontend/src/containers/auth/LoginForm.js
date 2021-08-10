import React, {useEffect, useState} from "react";
import { useDispatch, useSelector } from "react-redux";
import { changeField, initializeForm, login } from "../../modules/auth";
import AuthForm from '../../components/auth/AuthForm';
import { withRouter } from "react-router-dom";
import {check} from '../../modules/user';

const LoginForm = ({history}) => {
    const [error, setError] = useState(null);

    const dispatch = useDispatch();
    const {form, auth, authError, user} = useSelector(({auth, user}) => ({
        form: auth.login,
        auth: auth.auth,
        authError: auth.authError,
        user: user.user
    }));

    //인풋 변경 이벤트 핸들러
    const onChange = e => {
        const {value, name} = e.target;
        dispatch(
            changeField({
                form: 'login',
                key: name,
                value
            })
        );
    };

    //폼 등록 이벤트 핸들러
    const onSubmit = e => {
        e.preventDefault();
        const {username, password} = form;
        dispatch(login({username, password}));
    };

    //컴포넌트가 처음 렌더링될 때 form을 초기화함
    //처음 렌더링 시에 dispatch를 다시 받아오므로 감시하고 있다가 실행됨
    useEffect(() => {
        dispatch(initializeForm('login'));
    }, [dispatch]);

    useEffect(() => {
        if(authError) {
            console.log('오류 발생');
            console.log(authError);
            setError('로그인 실패');
            return;
        }
        if(auth){
            console.log('로그인 성공');
            dispatch(check());
        }
    }, [auth, authError, dispatch, error]);

    //체크를 완료하면 user 정보가 담기게 된다
    useEffect(() => {
        if(user){
            history.push('/');
            try{
                localStorage.setItem('user', JSON.stringify(user));
            }catch(e){
                console.log("localStorage is not working");
            }
        }
    }, [history, user]);

    //폼이 바뀔 떄마다 리렌더링
    return (
        <AuthForm
            type="login"
            form={form}
            onChange={onChange}
            onSubmit={onSubmit}
            error={error}
        />
    );
};

export default withRouter(LoginForm);