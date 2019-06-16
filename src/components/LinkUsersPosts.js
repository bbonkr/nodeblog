import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';

const LinkUsersPosts = ({ user, children }) => {
    console.log('==========> LinkUsersPosts:  user: ', user);
    return (
        <Link
            href={{
                pathname: '/users/posts',
                query: {
                    user: user,
                },
            }}
            as={`/users/${user}/posts`}>
            <a>{children}</a>
        </Link>
    );
};

LinkUsersPosts.propTypes = {
    user: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired,
};

export default LinkUsersPosts;
