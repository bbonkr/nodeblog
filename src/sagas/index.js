import { all, call } from 'redux-saga/effects';
import user from './user';
import post from './post';
import category from './category';
import axios from 'axios';

axios.defaults.baseURL = 'http://localhost:3000/api';

export default function* rootSaga() {
    yield all([call(user), call(post), call(category)]);
}
