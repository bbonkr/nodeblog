import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader, Divider, Timeline, Button } from 'antd';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';
import { LOAD_LIKED_POSTS_CALL } from '../../reducers/me';

const Liked = () => {
    const dispatch = useDispatch();
    const {
        likedPosts,
        likedPostsLoading,
        likedPostsHasMore,
        likedPostsLimit,
        likedPostsPageToken,
    } = useSelector(s => s.me);

    const onClickLoadMore = useCallback(() => {
        if (likedPostsHasMore) {
            dispatch({
                type: LOAD_LIKED_POSTS_CALL,
                data: {
                    pageToken: likedPostsPageToken,
                    limit: likedPostsLimit,
                    keyword: '',
                },
            });
        }
    }, [dispatch, likedPostsHasMore, likedPostsLimit, likedPostsPageToken]);

    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Liked posts" />
                <Divider />
                <Timeline pending={likedPostsLoading}>
                    {likedPosts.map(post => {
                        return <Timeline.Item>{post.title}</Timeline.Item>;
                    })}
                </Timeline>
                <Button
                    type="primary"
                    loading={likedPostsLoading}
                    onClick={onClickLoadMore}
                    disabled={!likedPostsHasMore}>
                    Load more
                </Button>
            </ContentWrapper>
        </MeLayout>
    );
};

Liked.getInitialProps = async context => {
    const state = context.store.getState();
    const { likedPostsLimit } = state.me;

    context.store.dispatch({
        type: LOAD_LIKED_POSTS_CALL,
        data: {
            pageToken: null,
            limit: likedPostsLimit,
            keyword: '',
        },
    });

    return {};
};

export default withAuth(Liked);
