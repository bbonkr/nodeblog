import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { List, Avatar, Button, Divider, Card } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import IconText from './IconText';
import { LOAD_POSTS_CALL } from '../reducers/post';
import CategoryLink from './CategoryLink';
import TagLink from './TagLink';

const FullWidthButton = styled(Button)`
    width: 100%;
`;

const ListExcerpt = () => {
    const dispatch = useDispatch();
    const {
        posts,
        loadingPosts,
        nextPageToken,
        postsLimit,
        searchKeyword,
        hasMorePost,
    } = useSelector(s => s.post);

    // console.log('hasMorePost:', hasMorePost);

    const onClickLoadMorePosts = useCallback(
        e => {
            dispatch({
                type: LOAD_POSTS_CALL,
                data: {
                    pageToken: nextPageToken,
                    limit: postsLimit,
                    keyword: searchKeyword,
                },
            });
        },
        [dispatch, nextPageToken, postsLimit, searchKeyword],
    );

    return (
        <article>
            <List
                itemLayout="vertical"
                size="large"
                loadMore={
                    hasMorePost && (
                        <FullWidthButton
                            loading={loadingPosts}
                            onClick={onClickLoadMorePosts}>
                            더 보기
                        </FullWidthButton>
                    )
                }
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 3,
                    lg: 4,
                    xl: 6,
                    xxl: 6,
                }}
                loading={loadingPosts}
                dataSource={posts}
                renderItem={post => {
                    const { slug, title, excerpt, createdAt } = post;
                    const { displayName } = post.User;
                    return (
                        <List.Item key={post.id}>
                            <Card
                                actions={[
                                    <IconText
                                        type="eye"
                                        text={`${
                                            post.PostAccessLogs &&
                                            post.PostAccessLogs.length > 0
                                                ? post.PostAccessLogs.length
                                                : 0
                                        }`}
                                    />,
                                ]}>
                                <Card.Meta
                                    avatar={
                                        <Avatar>
                                            {displayName[0].toUpperCase()}
                                        </Avatar>
                                    }
                                    extra={
                                        <IconText
                                            type="clock-circle"
                                            text={moment(createdAt).format(
                                                'YYYY-MM-DD HH:mm:ss',
                                            )}
                                        />
                                    }
                                    title={
                                        <Link
                                            href={{
                                                pathname: '/content',
                                                query: { slug: slug },
                                            }}
                                            as={`/${slug}`}>
                                            <a>
                                                <h3>{title}</h3>
                                            </a>
                                        </Link>
                                    }
                                />
                                <Divider dashed={true} />
                                <div>
                                    {post.Categories &&
                                        post.Categories.map(v => {
                                            return (
                                                <CategoryLink
                                                    key={v.slug}
                                                    name={v.name}
                                                    slug={v.slug}
                                                />
                                            );
                                        })}
                                </div>

                                {post.Categories &&
                                    post.Categories.length > 0 && (
                                        <Divider dashed={true} />
                                    )}

                                <div>{excerpt}</div>

                                {post.Tags && post.Tags.length > 0 && (
                                    <Divider dashed={true} />
                                )}
                                <div>
                                    {post.Tags &&
                                        post.Tags.map(v => {
                                            return (
                                                <TagLink
                                                    key={v.slug}
                                                    name={v.name}
                                                    slug={v.slug}
                                                />
                                            );
                                        })}
                                </div>
                            </Card>
                        </List.Item>
                    );
                }}
            />
        </article>
    );
};

ListExcerpt.propTypes = {
    // post: PropTypes.object.isRequired,
};

export default ListExcerpt;
