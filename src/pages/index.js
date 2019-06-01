import React from 'react';
import ListExcerpt from '../components/ListExcerpt';
import PropTypes from 'prop-types';
import { LOAD_POSTS_CALL } from '../reducers/post';

const Home = () => {
    return (
        <div>
            <ListExcerpt />
        </div>
    );
};

Home.propTypes = {};

Home.getInitialProps = async context => {
    const state = context.store.getState();

    const { postsLimit, posts } = state.post;
    const lastPost = posts && posts.length > 0 && posts[posts.length - 1];
    context.store.dispatch({
        type: LOAD_POSTS_CALL,
        data: {
            pageToken: null,
            limit: postsLimit,
            keyword: '',
        },
    });

    return {};
};

export default Home;
