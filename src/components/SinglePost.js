import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Card, Divider, Avatar } from 'antd';
import CategoryLink from './CategoryLink';
import TagLink from './TagLink';

const SinglePost = ({ post }) => {
    return (
        <>
            <article>
                <Card>
                    <Card.Meta
                        avatar={<Avatar>{post.User.displayName[0]}</Avatar>}
                        title={
                            <Link
                                href={{
                                    pathname: '/post',
                                    query: { slug: post.slug },
                                }}
                                as={`/post/${post.slug}`}>
                                <a>
                                    <h1>{post.title}</h1>
                                </a>
                            </Link>
                        }
                        description={
                            <div
                                dangerouslySetInnerHTML={{
                                    __html: post.content,
                                }}
                            />
                        }
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
