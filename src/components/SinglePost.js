import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Card, Divider } from 'antd';
import TagLink from './TagLink';

const SinglePost = ({ post }) => {
    return (
        <>
            <article>
                <Card>
                    <Card.Meta
                        title={
                            <Link
                                href={{
                                    pathname: '/content',
                                    query: { slug: post.slug },
                                }}
                                as={`/${post.slug}`}>
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
                    {post.tags &&
                        post.tags.map(v => {
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
