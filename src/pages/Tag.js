import React from 'react';
import PropTypes from 'prop-types';
import { Card, Divider } from 'antd';
import ListExcerpt from '../components/ListExcerpt';
import { LOAD_TAG_POSTS_CALL } from '../reducers/post';

const Tag = ({ slug }) => {
    return (
        <div>
            <Card title={slug} />
            <Divider />
            <ListExcerpt />
        </div>
    );
};

Tag.propTypes = {
    slug: PropTypes.string.isRequired,
};

Tag.getInitialProps = async context => {
    const state = context.store.getState();
    const { slug } = context.query;
    const { postsLimit, posts } = state.post;
    const lastPost = posts && posts.length > 0 && posts[posts.length - 1];
    context.store.dispatch({
        type: LOAD_TAG_POSTS_CALL,
        data: {
            pageToken: null,
            limit: postsLimit,
            keyword: '',
            tag: slug,
        },
    });

    return { slug };
};

export default Tag;