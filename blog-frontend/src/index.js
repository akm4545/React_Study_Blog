import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import rootReducer, {rootSaga} from './modules';
import { composeWithDevTools } from '../node_modules/redux-devtools-extension/index';
import {Provider} from 'react-redux';
import createSagaMiddleware from 'redux-saga';
import { tempSetUser, check } from './modules/user';
import { HelmetProvider } from 'react-helmet-async';

const sagaMiddleware = createSagaMiddleware();

//스토어에 등록
const store = createStore(
  rootReducer, 
  composeWithDevTools(applyMiddleware(sagaMiddleware)),
);

function loadUser(){
  try{
    const user = localStorage.getItem('user');
    if(!user) return; //로그인 상태가 아니라면 아무것도 안함
    
    store.dispatch(tempSetUser(JSON.parse(user)));
    store.dispatch(check());
  }catch(e){
    console.log('localStorage is not working');
  }
}

sagaMiddleware.run(rootSaga);
loadUser();

// 이 앱은 라우터를 적용한다
//프로바이더로 store등록
ReactDOM.render(
  <Provider store={store}>
    <BrowserRouter>
      <HelmetProvider>
        <App />
      </HelmetProvider>
    </BrowserRouter>
  </Provider>,
  document.getElementById('root')
);