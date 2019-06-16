/**
 * users/:user/posts
 */
import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { LOAD_POSTS_CALL, LOAD_USERS_POSTS_CALL } from '../../reducers/post';
import DefaultLayout from '../../components/DefaultLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import ListExcerpt from '../../components/ListExcerpt';

const UsersPosts = ({ user }) => {
    const dispatch = useDispatch();
    const {
        usersPosts,
        hasMoreUsersPosts,
        loadingUsersPosts,
        postsLimit,
    } = useSelector(s => s.post);
    const onClickLoadMore = useCallback(() => {
        dispatch({
            type: LOAD_USERS_POSTS_CALL,
            data: {
                user: user,
                pageToken:
                    usersPosts &&
                    usersPosts.length > 0 &&
                    usersPosts[usersPosts.length - 1].id,
                limit: postsLimit,
                keyword: '',
            },
        });
    }, [dispatch, postsLimit, user, usersPosts]);
    return (
        <DefaultLayout>
            <ContentWrapper>
                <ListExcerpt
                    posts={usersPosts}
                    hasMore={hasMoreUsersPosts}
                    loading={loadingUsersPosts}
                    loadMoreHandler={onClickLoadMore}
                />
            </ContentWrapper>
        </DefaultLayout>
    );
};

UsersPosts.propTypes = {
    user: PropTypes.string.isRequired,
};

UsersPosts.getInitialProps = async context => {
    const state = context.store.getState();
    const { user } = context.query;
    const { postsLimit, usersPosts, currentUser } = state.post;
    const lastPost =
        usersPosts &&
        usersPosts.length > 0 &&
        usersPosts[usersPosts.length - 1];

    if (
        context.isServer ||
        !usersPosts ||
        usersPosts.length === 0 ||
        user !== currentUser
    ) {
        // 서버 요청 || 사용자 글 목록이 없음 || 현재 사용자와 요청 사용자가 다름
        context.store.dispatch({
            type: LOAD_USERS_POSTS_CALL,
            data: {
                user: user,
                pageToken: null,
                limit: postsLimit,
                keyword: '',
            },
        });
    }
    return {
        user: user,
    };
};

export default UsersPosts;
