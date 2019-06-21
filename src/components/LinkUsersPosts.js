import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LinkUsersPosts = ({ user, children }) => {
    const username = `@${user}`;
    return (
        <Link
            href={{
                pathname: '/users/posts',
                query: {
                    user: username,
                },
            }}
            as={`/users/${username}/posts`}>
            <a>{children}</a>
        </Link>
    );
};

LinkUsersPosts.propTypes = {
    user: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default LinkUsersPosts;
