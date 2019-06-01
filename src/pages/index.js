import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SinglePost from '../components/SinglePost';
import ListExcerpt from '../components/ListExcerpt';
import { List, Button } from 'antd';
import PropTypes from 'prop-types';
import { LOAD_POSTS_CALL, LOAD_SINGLE_POST_CALL } from '../reducers/post';

const Home = ({ slug }) => {
    const displatch = useDispatch();
    const { isSinglePost } = useSelector(state => state.post);
    const { posts } = useSelector(state => state.post);
    const { singlePost } = useSelector(state => state.post);

    return <div>{isSinglePost ? <SinglePost /> : <ListExcerpt />}</div>;
};

Home.propTypes = {
    slug: PropTypes.string,
};

Home.getInitialProps = async context => {
    console.log('Home.initialProps');
    console.log('context.isServer: ', context.isServer);
    console.log('context.query.slug: ', context.query.slug);
    console.log('context.query', context.query);
    // console.log('context', context);

    const slug = context.query.slug;

    if (slug) {
        context.store.dispatch({
            type: LOAD_SINGLE_POST_CALL,
            data: slug,
        });
    } else {
        const state = context.store.getState();

        const { postsLimit, posts } = state.post;
        const lastPost = posts && posts.length > 0 && posts[posts.length - 1];
        context.store.dispatch({
            type: LOAD_POSTS_CALL,
            data: {
                // pageToken: lastPost && lastPost.id,
                limit: postsLimit,
                keyword: '',
            },
        });
    }

    return { slug };
};

export default Home;
