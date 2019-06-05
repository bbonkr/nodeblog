import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import IconText from './IconText';

const LinkWrapper = styled.span`
    margin-right: 1em;
`;

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
