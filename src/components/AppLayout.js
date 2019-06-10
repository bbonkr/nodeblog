import React from 'react';
import { BackTop } from 'antd';
import PropTypes from 'prop-types';

/**
 * 기초 레이아웃을 컴포넌트입니다.
 *
 * @param {element} 내부에 렌더링될 자식 요소
 */
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
