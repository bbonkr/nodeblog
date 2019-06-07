import React from 'react';
import ListExcerpt from '../components/ListExcerpt';
import PropTypes from 'prop-types';
import { Card, Divider } from 'antd';
import { LOAD_CATEGORY_POSTS_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';

const Category = ({ slug }) => {
    return (
        <ContentWrapper>
            <Card title={slug} />
            <Divider />
            <ListExcerpt />
        </ContentWrapper>
    );
};

Category.getInitialProps = async context => {
    const state = context.store.getState();
    const { slug } = context.query;
    const { postsLimit, posts } = state.post;
    const lastPost = posts && posts.length > 0 && posts[posts.length - 1];
    context.store.dispatch({
        type: LOAD_CATEGORY_POSTS_CALL,
        data: {
            pageToken: null,
            limit: postsLimit,
            keyword: '',
            category: slug,
        },
    });

    return { slug };
};

Category.prototype = {
    slug: PropTypes.string.isRequired,
};

export default Category;
