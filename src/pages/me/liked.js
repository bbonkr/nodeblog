import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PageHeader, Divider, Timeline, Button, Card, Icon } from 'antd';
import moment from 'moment';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';
import { LOAD_LIKED_POSTS_CALL } from '../../reducers/me';
import Router from 'next/router';

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

    const onClickOpnePost = useCallback(
        post => () => {
            const username = `@${post.User.username}`;
            const slug = encodeURIComponent(post.slug);

            Router.push(`/users/${username}/posts/${slug}`);
        },
        [],
    );

    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Liked posts" />
                <Divider />
                <Timeline
                    pending={likedPostsLoading}
                    reverse={false}
                    mode="left">
                    {likedPosts.map(likePost => {
                        return (
                            <Timeline.Item key={likePost.PostId}>
                                <Card
                                    title={`Liked at ${moment(
                                        likePost.createdAt,
                                    ).format('YYYY-MM-DD HH:mm:ss')}`}
                                    extra={
                                        <Button
                                            type="primary"
                                            onClick={onClickOpnePost(
                                                likePost.Post,
                                            )}>
                                            Opne
                                        </Button>
                                    }>
                                    <Card.Meta
                                        title={likePost.Post.title}
                                        description={
                                            <span>
                                                <Icon type="clock-circle-o" />
                                                {` ${moment(
                                                    likePost.Post.createdAt,
                                                    'YYYY-MM-DD HH:mm:ss',
                                                ).fromNow()}`}{' '}
                                            </span>
                                        }
                                    />
                                    {likePost.Post.excerpt}
                                </Card>
                            </Timeline.Item>
                        );
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
