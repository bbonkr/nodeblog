import React from 'react';
import PropTypes from 'prop-types';

const CroppedImage = ({ image, altText, onClickHandler }) => {
    const filename = `${image.fileName}${image.fileExtension}`;

    return (
        <>
            <figure
                style={{
                    width: '100%',
                    height: '20rem',
                    overflow: 'hidden',
                    margin: '0',
                }}>
                <img
                    style={{
                        display: 'block',
                        width: '177.777%',
                        margin: '0 -38.885%',
                    }}
                    src={decodeURIComponent(image.src)}
                    alt={altText || filename}
                    onClick={onClickHandler && onClickHandler(image)}
                />
            </figure>
        </>
    );
};

CroppedImage.propTypes = {
    image: PropTypes.object.isRequired,
    altText: PropTypes.string,
    onClickHandler: PropTypes.func,
};

export default CroppedImage;
