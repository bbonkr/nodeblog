import { combineReducers } from 'redux';
// import user from './user';
import post from './post';
import category from './category';

const rootReducer = combineReducers({
    // user,
    post,
    category,
});

export default rootReducer;
