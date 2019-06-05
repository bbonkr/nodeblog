import React from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

const IconText = ({ type, text, spanProps, iconProps }) => (
    <span {...spanProps}>
        <Icon type={type} style={{ marginRight: 8 }} {...iconProps} />
        {text}
    </span>
);

IconText.propTypes = {
    type: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
};

export default IconText;
