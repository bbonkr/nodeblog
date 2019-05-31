import React from 'react';
import PropTypes from 'prop-types';

const SiglePost = ({ post }) => {
    return (
        <article>
            <h1>{post.title}</h1>
            <div>
                <div>author</div>
                <div>date</div>
            </div>
            <div>{post.content}</div>
        </article>
    );
};

SiglePost.propTypes = {
    post: PropTypes.object.isRequired,
};

export default SiglePost;
