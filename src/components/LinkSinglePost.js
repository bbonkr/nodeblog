import React, {memo} from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LinkSinglePost = memo( ({ post, children }) => {
    const user = `@${post.User.username}`;
    const slug = encodeURIComponent(post.slug);

    return (
        <Link
            href={`/users/post?user=${user}&slug=${slug}`}
            as={`/users/${user}/posts/${slug}`} passHref={true}>
            <a>{children}</a>
        </Link>
    );
});

LinkSinglePost.propTypes = {
    post: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
};

export default LinkSinglePost;
