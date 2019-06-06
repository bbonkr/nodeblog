import { combineReducers } from 'redux';
import user from './user';
import post from './post';
import category from './category';
import settings from './settings';

const rootReducer = combineReducers({
    user,
    post,
    category,
    settings,
});

export default rootReducer;
