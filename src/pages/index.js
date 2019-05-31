import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SinglePost from '../components/SinglePost';
import ListExcerpt from '../components/ListExcerpt';
import { List, Button } from 'antd';
import { LOAD_POSTS_CALL } from '../reducers/post';

const Home = () => {
    const displatch = useDispatch();
    const { posts } = useSelector(state => state.post);

    console.log('Home');
    return (
        <div>
            <ListExcerpt />
        </div>
    );
};

Home.getInitialProps = async context => {
    const state = context.store.getState();
    const { postsLimit } = state.post;
    context.store.dispatch({
        type: LOAD_POSTS_CALL,
        data: {
            pageToken: '',
            limit: postsLimit,
            keyword: '',
        },
    });
};

export default Home;
