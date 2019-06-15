import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LinkSinglePost = ({ post, children }) => {
    const user = `@${post.User.username}`;
    const slug = encodeURIComponent(post.slug);

    return (
        <Link
            href={{
                pathname: '/post',
                query: {
                    user: user,
                    slug: slug,
                },
            }}
            as={`/users/${user}/posts/${slug}`}>
            <a>{children}</a>
        </Link>
    );
};

LinkSinglePost.propTypes = {
    post: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
};

export default LinkSinglePost;
