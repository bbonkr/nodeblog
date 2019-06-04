import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import styled from 'styled-components';
import IconText from './IconText';

const LinkWrapper = styled.span`
    margin-right: 1em;
`;

const TagLink = ({ name, slug }) => {
    return (
        <LinkWrapper>
            <Link
                href={{ pathname: '/tag', query: { slug: slug } }}
                as={`/tag/${slug}`}>
                <a>
                    <IconText type="tag" text={name} />
                </a>
            </Link>
        </LinkWrapper>
    );
};

TagLink.propTypes = {
    name: PropTypes.string.isRequired,
    slug: PropTypes.string.isRequired,
};

export default TagLink;
