import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LinkUsersPosts = ({ user, children }) => {
    const { username } = user;
    const displayUsername = `@${username}`;
    return (
        <Link
            href={{
                pathname: '/users/posts',
                query: {
                    user: displayUsername,
                },
            }}
            as={`/users/${displayUsername}/posts`}>
            <a>{children}</a>
        </Link>
    );
};

LinkUsersPosts.propTypes = {
    user: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired,
};

export default LinkUsersPosts;
