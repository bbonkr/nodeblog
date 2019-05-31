import React from 'react';
import Error from 'next/error';
import PropTypes from 'prop-types';

const NodeBlogError = ({ statusCode }) => {
    console.log('statusCode', statusCode);

    return (
        <div>
            <h1>{`HTTP ${statusCode}`}</h1>
            {/* <Error statusCode={statusCode} /> */}
        </div>
    );
};

NodeBlogError.defaultProps = {
    statusCode: 400,
};

NodeBlogError.propTypes = {
    statusCode: PropTypes.number,
};

NodeBlogError.getInitialProps = async context => {
    const statusCode = context.res
        ? context.res.statusCode
        : context.err
        ? err.statusCode
        : null;
    return {
        statusCode,
    };
};

export default NodeBlogError;
