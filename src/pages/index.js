import React from 'react';
import ListExcerpt from '../components/ListExcerpt';
import PropTypes from 'prop-types';
import { LOAD_POSTS_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';
import DefaultLayout from '../components/DefaultLayout';

const Home = ({}) => {
    return (
        <DefaultLayout>
            <ContentWrapper>
                <ListExcerpt />
            </ContentWrapper>
        </DefaultLayout>
    );
};

Home.defaultProps = {};

Home.propTypes = {};

Home.getInitialProps = async context => {
    const state = context.store.getState();
    const { home } = context.query;
    const { postsLimit, posts } = state.post;
    const lastPost = posts && posts.length > 0 && posts[posts.length - 1];
    if (context.isServer || !posts || posts.length === 0) {
        context.store.dispatch({
            type: LOAD_POSTS_CALL,
            data: {
                pageToken: null,
                limit: postsLimit,
                keyword: '',
            },
        });
    }
    return {};
};

export default Home;
