import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { List, Avatar, Button, Divider, Card, Typography } from 'antd';
import moment from 'moment';
import styled from 'styled-components';
import IconText from './IconText';
import LinkCategory from './LinkCategory';
import LinkTag from './LinkTag';
import LinkSinglePost from './LinkSinglePost';
import LinkUsersPosts from './LinkUsersPosts';
import UserAvatar from './UserAvatar';
// import '../styles/styles.scss';

const FullWidthButton = styled(Button)`
    width: 100%;
`;

const ListExcerpt = ({ posts, loading, hasMore, loadMoreHandler }) => {
    console.log('======> posts count: ', (posts && posts.length) || 0);

    return (
        <article>
            <List
                itemLayout="vertical"
                size="large"
                loadMore={
                    hasMore && (
                        <FullWidthButton
                            loading={loading}
                            onClick={loadMoreHandler}>
                            더 보기
                        </FullWidthButton>
                    )
                }
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 1,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 6,
                }}
                loading={loading}
                dataSource={posts}
                renderItem={post => {
                    const { slug, title, excerpt, createdAt } = post;
                    const { username, displayName } = post.User;
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
                                        <LinkUsersPosts user={post.User}>
                                            <UserAvatar user={post.User} />
                                        </LinkUsersPosts>
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
                                        <LinkSinglePost post={post}>
                                            <Typography.Title
                                                level={3}
                                                ellipsis={true}>
                                                {title}
                                            </Typography.Title>
                                        </LinkSinglePost>
                                    }
                                />
                                <div
                                    style={{
                                        minHeight: '16rem',
                                        maxHeigh: '16rem',
                                        height: '16rem',
                                    }}>
                                    <Divider dashed={true} />
                                    <div>
                                        {post.Categories &&
                                            post.Categories.map(category => {
                                                return (
                                                    <LinkCategory
                                                        key={category.slug}
                                                        user={post.User}
                                                        category={category}
                                                    />
                                                );
                                            })}
                                    </div>

                                    {post.Categories &&
                                        post.Categories.length > 0 && (
                                            <Divider dashed={true} />
                                        )}

                                    <div
                                        style={{
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            height: '5.0rem',
                                            minHeight: '5.0rem',
                                            maxHeight: '5.0rem',
                                        }}>
                                        {excerpt}
                                    </div>

                                    {post.Tags && post.Tags.length > 0 && (
                                        <Divider dashed={true} />
                                    )}
                                    <div>
                                        {post.Tags &&
                                            post.Tags.map(v => {
                                                return (
                                                    <LinkTag
                                                        tag={v}
                                                        key={v.slug}
                                                    />
                                                );
                                            })}
                                    </div>
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
    posts: PropTypes.array.isRequired,
    loading: PropTypes.bool.isRequired,
    hasMore: PropTypes.bool.isRequired,
    loadMoreHandler: PropTypes.func.isRequired,
};

export default ListExcerpt;
