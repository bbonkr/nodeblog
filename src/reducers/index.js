import { combineReducers } from 'redux';
import user from './user';
import post from './post';
import category from './category';
import settings from './settings';
import me from './me';

const rootReducer = combineReducers({
    user,
    post,
    category,
    settings,
    me,
});

export default rootReducer;
