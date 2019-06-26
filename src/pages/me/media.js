import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Upload,
    Icon,
    message,
    List,
    Button,
    Card,
    Typography,
    Modal,
    Divider,
    PageHeader,
} from 'antd';
import {
    UPLOAD_MY_MEDIA_FILES_CALL,
    LOAD_MY_MEDIA_FILES_CALL,
    DELETE_MY_MEDIA_FILES_CALL,
} from '../../reducers/me';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import MeLayout from '../../components/MeLayout';
import moment from 'moment';
import styled from 'styled-components';
import ImageViewer from '../../components/ImageViewer';
import FileList from '../../components/FileList';
import { withAuth } from '../../utils/auth';

const Paragraph = Typography.Paragraph;
const Dragger = Upload.Dragger;

const DropZoneDiv = styled.div`
    border: '2px dashed gray';
    height: '15rem';
    width: '100%';
    padding: '2rem';
    text-align: 'center';
    vertical-align: 'middle';
`;

const Media = () => {
    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Media" />
                <FileList />
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

export default withAuth(Media);
