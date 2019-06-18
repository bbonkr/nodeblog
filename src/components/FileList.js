import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Upload,
    Icon,
    List,
    Button,
    Card,
    Typography,
    Modal,
    Divider,
} from 'antd';
import moment from 'moment';
import {
    UPLOAD_MY_MEDIA_FILES_CALL,
    LOAD_MY_MEDIA_FILES_CALL,
    DELETE_MY_MEDIA_FILES_CALL,
} from '../reducers/me';
import ImageViewer from './ImageViewer';
import CroppedImage from './CroppedImage';

const Paragraph = Typography.Paragraph;
const Dragger = Upload.Dragger;

const FileList = () => {
    const dispatch = useDispatch();

    const {
        mediaFiles,
        loadingMediaFiles,
        hasMoreMediaFiles,
        mediaFilesNextPageToken,
        mediaFilesLimit,
        uploading,
    } = useSelector(s => s.me);

    const [imageViewerVisible, setImageViewerVisible] = useState(false);
    const [imageViewerFiles, setImageViewerFiles] = useState([]);
    const closeImageviewer = useCallback(() => {
        setImageViewerVisible(false);
    }, []);

    useEffect(() => {
        dispatch({
            type: LOAD_MY_MEDIA_FILES_CALL,
            data: {
                pageToken: null,
                limit: mediaFilesLimit,
                keyword: '',
            },
        });
    }, [dispatch, mediaFilesLimit]);

    const uploadBuffer = [];

    const onBeforeUploadFiles = useCallback(
        (file, fileList) => {
            if (!uploading) {
                uploadBuffer.push(file);

                if (uploadBuffer.length === fileList.length) {
                    const formData = new FormData();
                    uploadBuffer.forEach(f => {
                        formData.append('files', f);
                    });

                    dispatch({
                        type: UPLOAD_MY_MEDIA_FILES_CALL,
                        data: formData,
                    });

                    uploadBuffer.splice(0, uploadBuffer.length);
                }
            }
            return false;
        },
        [dispatch, uploadBuffer, uploading]
    );

    const onClickLoadMore = useCallback(
        e => {
            if (hasMoreMediaFiles) {
                dispatch({
                    type: LOAD_MY_MEDIA_FILES_CALL,
                    data: {
                        pageToken: mediaFilesNextPageToken,
                        limit: mediaFilesLimit,
                        keyword: '',
                    },
                });
            }
        },
        [dispatch, hasMoreMediaFiles, mediaFilesLimit, mediaFilesNextPageToken]
    );

    const onClickImage = useCallback(
        image => () => {
            setImageViewerVisible(true);
            setImageViewerFiles([image]);
        },
        []
    );

    const onClickDeleteFile = useCallback(
        media => () => {
            Modal.confirm({
                title: 'Do you want to delete this file?',
                content: `${media.fileName}${media.fileExtension}`,
                onOk() {
                    dispatch({
                        type: DELETE_MY_MEDIA_FILES_CALL,
                        data: media.id,
                    });
                },
                onCancel() {},
            });
        },
        [dispatch]
    );

    return (
        <>
            <Dragger
                disabled={uploading}
                supportServerRender={true}
                name="files"
                multiple={true}
                showUploadList={false}
                beforeUpload={onBeforeUploadFiles}>
                <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                </p>
                <p className="ant-upload-text">
                    Click or drag file to this area to upload
                </p>
                <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibit from
                    uploading company data or other band files
                </p>
            </Dragger>
            <Divider />
            <List
                grid={{
                    gutter: 16,
                    xs: 1,
                    sm: 2,
                    md: 3,
                    lg: 3,
                    xl: 4,
                    xxl: 4,
                    type: 'flex',
                    jusify: 'start',
                    align: 'top',
                }}
                dataSource={mediaFiles}
                loading={loadingMediaFiles || uploading}
                loadMore={
                    <Button
                        style={{ width: '100%' }}
                        onClick={onClickLoadMore}
                        loading={loadingMediaFiles}
                        disabled={!hasMoreMediaFiles}>
                        Load more
                    </Button>
                }
                renderItem={item => {
                    const filename = `${item.fileName}${item.fileExtension}`;
                    return (
                        <List.Item key={item.id}>
                            <Card
                                cover={
                                    item.contentType.indexOf('image') >= 0 && (
                                        <CroppedImage
                                            image={item}
                                            onClickHandler={onClickImage}
                                        />
                                        // <figure
                                        //     style={{
                                        //         width: '100%',
                                        //         height: '20rem',
                                        //         overflow: 'hidden',
                                        //         margin: '0',
                                        //     }}>
                                        //     <img
                                        //         style={{
                                        //             display: 'block',
                                        //             width: '177.777%',
                                        //             margin: '0 -38.885%',
                                        //         }}
                                        //         src={decodeURIComponent(
                                        //             item.src
                                        //         )}
                                        //         alt={filename}
                                        //         onClick={onClickImage(item)}
                                        //     />
                                        // </figure>
                                    )
                                }
                                actions={[
                                    <Paragraph
                                        copyable={{
                                            text: item.src,
                                        }}
                                    />,
                                    <Icon
                                        type="delete"
                                        onClick={onClickDeleteFile(item)}
                                    />,
                                ]}>
                                <Card.Meta
                                    title={filename}
                                    description={
                                        <span>
                                            <Icon type="clock-circle" />{' '}
                                            {moment(
                                                new Date(item.createdAt),
                                                'YYYY-MM-DD HH:mm:ss'
                                            ).fromNow()}
                                        </span>
                                    }
                                />
                                <div
                                    tyle={{
                                        textOverflow: 'ellipsis',
                                    }}>
                                    <Paragraph
                                        copyable={{
                                            text: item.src,
                                        }}
                                        ellipsis={true}>
                                        {`${item.fileName}${
                                            item.fileExtension
                                        }`}
                                    </Paragraph>
                                </div>
                            </Card>
                        </List.Item>
                    );
                }}
            />

            <ImageViewer
                files={imageViewerFiles}
                visible={imageViewerVisible}
                closeImageviewer={closeImageviewer}
            />
        </>
    );
};

export default FileList;
