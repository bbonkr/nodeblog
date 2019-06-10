import { all, call } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import post from './post';
import category from './category';
import me from './me';

axios.defaults.baseURL = 'http://localhost:3000/api';

export default function* rootSaga() {
    yield all([call(user), call(post), call(category), call(me)]);
}
