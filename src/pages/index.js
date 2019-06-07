import React from 'react';
import ListExcerpt from '../components/ListExcerpt';
import PropTypes from 'prop-types';
import { LOAD_POSTS_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';

const Home = ({ home }) => {
    return (
        <ContentWrapper>
            <ListExcerpt />
        </ContentWrapper>
    );
};

Home.defaultProps = {
    home: false,
};

Home.propTypes = {
    home: PropTypes.bool,
};

Home.getInitialProps = async context => {
    const state = context.store.getState();
    const { home } = context.query;
    const { postsLimit, posts } = state.post;
    const lastPost = posts && posts.length > 0 && posts[posts.length - 1];
    if (context.isServer || home) {
        context.store.dispatch({
            type: LOAD_POSTS_CALL,
            data: {
                pageToken: null,
                limit: postsLimit,
                keyword: '',
            },
        });
    }
    return { home: !!home };
};

export default Home;
