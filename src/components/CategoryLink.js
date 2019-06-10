import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import IconText from './IconText';

const LinkWrapper = styled.span`
    margin-right: 1em;
`;

/**
 * 분류 링크 컴포넌트입니다.
 *
 * @param {string} 분류 이름
 * @param {string} 분류 슬러그
 */
const CategoryLink = ({ name, slug }) => {
    return (
        <LinkWrapper>
            <Link
                href={{ pathname: '/category', query: { slug: slug } }}
                as={`/category/${slug}`}>
                <a>
                    <IconText type="container" text={name} />
                </a>
            </Link>
        </LinkWrapper>
    );
};

CategoryLink.propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
};

export default CategoryLink;
