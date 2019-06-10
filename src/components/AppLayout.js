import React from 'react';
import { BackTop } from 'antd';
import PropTypes from 'prop-types';

const AppLayout = ({ children }) => {
    return (
        <div style={{ minHeight: '100vh' }}>
            <BackTop />
            <div>{children}</div>
        </div>
    );
};

AppLayout.propTypes = {
    children: PropTypes.element.isRequired,
};

export default AppLayout;
