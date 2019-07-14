import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import ListExcerpt from '../components/ListExcerpt';
import PropTypes from 'prop-types';
import { LOAD_POSTS_CALL } from '../reducers/post';
import { ContentWrapper } from '../styledComponents/Wrapper';
import DefaultLayout from '../components/DefaultLayout';

const Home = () => {
    const dispatch = useDispatch();
    const {
        posts,
        nextPageToken,
        postsLimit,
        loadingPosts,
        hasMorePost,
    } = useSelector(s => s.post);

    const onClickLoadMorePosts = useCallback(
        e => {
            dispatch({
                type: LOAD_POSTS_CALL,
                data: {
                    pageToken: nextPageToken,
                    limit: postsLimit,
                    keyword: '',
                },
            });
        },
        [dispatch, nextPageToken, postsLimit],
    );

    return (
        <DefaultLayout>
            <ContentWrapper>
                <ListExcerpt
                    posts={posts}
                    loading={loadingPosts}
                    hasMore={hasMorePost}
                    loadMoreHandler={onClickLoadMorePosts}
                />
            </ContentWrapper>
        </DefaultLayout>
    );
};

Home.defaultProps = {};

Home.propTypes = {};

Home.getInitialProps = async context => {
    const state = context.store.getState();

    const { postsLimit, posts } = state.post;

    // console.log('context.isServer', context.isServer);
    // console.log('get post', context.isServer || !posts || posts.length === 0);
    if (context.isServer || !posts || posts.length === 0) {
        // console.log('get data');

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
