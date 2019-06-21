import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Card, Divider, Avatar, Typography, Icon } from 'antd';
import LinkCategory from './LinkCategory';
import LinkTag from './LinkTag';
import LinkSinglePost from './LinkSinglePost';
import UserAvatar from './UserAvatar';
import moment from 'moment';
import LinkUsersPosts from './LinkUsersPosts';

const SinglePost = ({ post }) => {
    return (
        <>
            <article>
                <Card>
                    <Card.Meta
                        avatar={
                            <LinkUsersPosts user={post.User}>
                                <UserAvatar user={post.User} />
                            </LinkUsersPosts>
                        }
                        title={
                            <LinkSinglePost post={post}>
                                <Typography.Title level={3} ellipsis={true}>
                                    {post.title}
                                </Typography.Title>
                            </LinkSinglePost>
                        }
                        description={
                            <span>
                                <Icon type="clock-circle" />{' '}
                                {moment(
                                    new Date(post.createdAt),
                                    'YYYY-MM-DD HH:mm:ss',
                                ).fromNow()}
                            </span>
                        }
                    />
                    <Divider dashed={true} />
                    <div
                        dangerouslySetInnerHTML={{
                            __html: post.html,
                        }}
                    />

                    <Divider />
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
                    <Divider dashed={true} />
                    {post.Tags &&
                        post.Tags.map(v => {
                            return <LinkTag key={v.slug} tag={v} />;
                        })}
                </Card>
            </article>
        </>
    );
};

SinglePost.propTypes = {
    post: PropTypes.object.isRequired,
};

export default SinglePost;
