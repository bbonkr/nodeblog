import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Card } from 'antd';

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
                </Card>
            </article>
        </>
    );
};

SinglePost.propTypes = {
    post: PropTypes.object.isRequired,
};

export default SinglePost;
