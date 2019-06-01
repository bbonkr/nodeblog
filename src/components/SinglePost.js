import React from 'react';
import { useSelector } from 'react-redux';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { Card } from 'antd';

const SinglePost = () => {
    const { singlePost: post } = useSelector(s => s.post);
    return (
        <>
            <article>
                <Card>
                    <Card.Meta
                        title={
                            <Link
                                href={{
                                    pathname: '/',
                                    query: { slug: post.slug },
                                }}
                                as={`/${post.slug}`}>
                                <a>{post.title}</a>
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
    // post: PropTypes.object.isRequired,
};

export default SinglePost;
