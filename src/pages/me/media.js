import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Upload, Icon, message, List, Button, Card, Typography } from 'antd';
import {
    UPLOAD_MY_MEDIA_FILES_CALL,
    LOAD_MY_MEDIA_FILES_CALL,
} from '../../reducers/me';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import MeLayout from '../../components/MeLayout';
import moment from 'moment';

const Paragraph = Typography.Paragraph;
const Dragger = Upload.Dragger;

const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};
const Media = () => {
    const dispatch = useDispatch();

    const {
        mediaFiles,
        loadingMediaFiles,
        hasMoreMediaFiles,
        mediaFilesNextPageToken,
        mediaFilesLimit,
    } = useSelector(s => s.me);
    const [fileList, setFileList] = useState([]);

    const onBeforeUploadFiles = useCallback(
        file => {
            // setFileList(files.fileList);
            const formData = new FormData();
            formData.append('files', file);
            dispatch({
                type: UPLOAD_MY_MEDIA_FILES_CALL,
                data: formData,
            });

            return false;
        },
        [dispatch],
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
        [dispatch, hasMoreMediaFiles, mediaFilesLimit, mediaFilesNextPageToken],
    );

    return (
        <MeLayout>
            <ContentWrapper>
                <div>
                    <h1>Media</h1>
                    <Dragger
                        name="files"
                        multiple={true}
                        beforeUpload={onBeforeUploadFiles}>
                        <p className="ant-upload-drag-icon">
                            <Icon type="inbox" />
                        </p>
                        <p className="ant-upload-text">
                            Click or drag file to this area to upload
                        </p>
                        <p className="ant-upload-hint">
                            Support for a single or bulk upload. Strictly
                            prohibit from uploading company data or other band
                            files
                        </p>
                    </Dragger>
                </div>
                <div>
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
                        }}
                        dataSource={mediaFiles}
                        loading={loadingMediaFiles}
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
                            const filename = `${item.fileName}${
                                item.fileExtension
                            }`;
                            return (
                                <List.Item key={item.id}>
                                    <Card
                                        cover={
                                            item.contentType.indexOf('image') >=
                                                0 && (
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
                                                            margin:
                                                                '0 -38.885%',
                                                        }}
                                                        src={item.src}
                                                        alt={filename}
                                                    />
                                                </figure>
                                            )
                                        }
                                        actions={[
                                            <Paragraph
                                                copyable={{
                                                    text: item.src,
                                                }}
                                            />,
                                            <Icon type="delete" />,
                                        ]}>
                                        <Card.Meta
                                            title={filename}
                                            description={
                                                <span>
                                                    <Icon type="clock-circle" />{' '}
                                                    {moment(
                                                        new Date(
                                                            item.createdAt,
                                                        ),
                                                        'YYYY-MM-DD HH:mm:ss',
                                                    ).fromNow()}
                                                </span>
                                            }
                                        />
                                        <div
                                            tyle={{ textOverflow: 'ellipsis' }}>
                                            <Paragraph
                                                copyable={{
                                                    text: item.src,
                                                }}
                                                ellipsis={true}>
                                                {item.src}
                                            </Paragraph>
                                        </div>
                                    </Card>
                                </List.Item>
                            );
                        }}
                    />
                </div>
            </ContentWrapper>
        </MeLayout>
    );
};

Media.getInitialProps = async context => {
    const state = context.store.getState();
    const { mediaFilesLimit } = state.me;
    context.store.dispatch({
        type: LOAD_MY_MEDIA_FILES_CALL,
        data: {
            pageToken: null,
            limit: mediaFilesLimit,
            keyword: '',
        },
    });

    return {};
};

export default Media;
