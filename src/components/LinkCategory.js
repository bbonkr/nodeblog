import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Icon } from 'antd';
import styled from 'styled-components';

const LinkWrapper = styled.span`
    margin-right: 1em;
`;

/**
 * 분류 링크 컴포넌트입니다.
 *
 * @param {string} 분류 이름
 * @param {string} 분류 슬러그
 */
const LinkCategory = ({ user, name, slug }) => {
    const username = `@${user}`;
    return (
        <LinkWrapper>
            <Link
                href={{
                    pathname: '/users/categoryposts',
                    query: { user: username, category: slug },
                }}
                as={`/users/${username}/categories/${slug}/posts`}>
                <a>
                    <Icon type="container" />
                    <span>{name}</span>
                </a>
            </Link>
        </LinkWrapper>
    );
};

LinkCategory.propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
};

export default LinkCategory;
