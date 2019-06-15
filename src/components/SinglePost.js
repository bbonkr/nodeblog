import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Card, Divider, Avatar, Typography, Icon } from 'antd';
import CategoryLink from './CategoryLink';
import TagLink from './TagLink';
import LinkSinglePost from './LinkSinglePost';
import moment from 'moment';

const SinglePost = ({ post }) => {
    console.log('post: ', post);

    return (
        <>
            <article>
                <Card>
                    <Card.Meta
                        avatar={<Avatar>{post.User.username[0]}</Avatar>}
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
                                    'YYYY-MM-DD HH:mm:ss'
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
                        post.Categories.map(v => {
                            return (
                                <CategoryLink
                                    key={v.slug}
                                    name={v.name}
                                    slug={v.slug}
                                />
                            );
                        })}
                    <Divider dashed={true} />
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
                </Card>
            </article>
        </>
    );
};

SinglePost.propTypes = {
    post: PropTypes.object.isRequired,
};

export default SinglePost;
