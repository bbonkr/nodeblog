import React, { useState, useCallback, useEffect } from 'react';
import { PageHeader, Modal, Carousel, Icon, Typography, Button } from 'antd';
import styled from 'styled-components';
import FullSizeModal from '../styledComponents/FullSizeModal';
// const FullSizeModal = styled(Modal)`
//     position: fixed;
//     z-index: 5000;
//     top: 0;
//     left: 0;
//     right: 0;
//     bottom: 0;
//     height: 100vh;
//     overflow-y: auto;
// `;

const ImageViewer = ({ files, visible, closeImageviewer }) => {
    const [title, setTitle] = useState('Image viewer');
    const [url, setUrl] = useState('');
    const [fullUrl, setFullUrl] = useState('');

    useEffect(() => {
        if (files && files.length > 0) {
            const file = files[0];
            setTitle(`${file.fileName}${file.fileExtension}`);
            setUrl(file.src);
            setFullUrl(`${window.location.origin}${file.src}`);
        }
    }, [files]);

    const onAafterChange = useCallback(
        current => {
            const file = files[current];
            setTitle(`${file.fileName}${file.fileExtension}`);
            setUrl(file.url);
            setFullUrl(`${window.location.origin}${file.src}`);
        },
        [files]
    );

    return (
        <FullSizeModal
            footer={false}
            visible={visible}
            maskClosable={true}
            onCancel={closeImageviewer}
            width="100%">
            <PageHeader
                title={
                    <Typography.Title level={3} copyable={{ text: fullUrl }}>
                        <Icon type="file-image" /> {title}
                    </Typography.Title>
                }
                extra={
                    [
                        // <Typography.Title
                        //     key="copy"
                        //     level={3}
                        //     copyable={fullUrl}
                        // />,
                    ]
                }
            />

            <Carousel style={{ width: '100%' }} onAafterChange={onAafterChange}>
                {files.map(f => {
                    return (
                        <div key={f.id} style={{ textAlign: 'center' }}>
                            <img
                                src={f.src}
                                alt={`${f.fileName}${f.fileExtention}`}
                                style={{ maxWidth: '100%', margin: '0 auto' }}
                            />
                        </div>
                    );
                })}
            </Carousel>
        </FullSizeModal>
    );
};

export default ImageViewer;
