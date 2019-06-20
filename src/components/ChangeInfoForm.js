import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Modal, Icon, AutoComplete } from 'antd';
import { signUpFormValidator } from '../helpers/formValidators';
import { CHANGE_INFO_CALL } from '../reducers/user';
import FileList from './FileList';

const validator = {
    checkUsername(formData) {
        return signUpFormValidator.checkUsername(formData);
    },
    checkDisplayName(formData) {
        return signUpFormValidator.checkDisplayName(formData);
    },
    validate(formData) {
        let valid = true;
        const results = [];
        const messages = [];

        results.push(this.checkUsername(formData));
        results.push(this.checkDisplayName(formData));

        results.forEach(v => {
            valid &= v.valid;
            if (!v.valid) {
                messages.push(v.message);
            }
        });

        return {
            valid: valid,
            messages: messages,
        };
    },
};

const ChangeInfoForm = () => {
    const dispatch = useDispatch();
    const { loadingChangeInfo, changeInfoSuccess } = useSelector(s => s.user);
    const { me } = useSelector(s => s.user);
    const [username, setUsername] = useState('');
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');
    const [fileListModalVisible, setFileListModalVisible] = useState(false);
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        if (me && me.id) {
            setUsername(me.username);
            setDisplayName(me.displayName);
            setPhoto(me.photo);
        }
    }, [me]);

    const onClickShowFileListModal = useCallback(() => {
        setFileListModalVisible(true);
    }, []);

    const onClickHideFileListModal = useCallback(() => {
        setFileListModalVisible(false);
    }, []);

    const onChangeUsername = useCallback(e => {
        const newValue = e.target.value;
        setUsername(newValue);
        const result = validator.checkUsername({ username: newValue.trim() });
        setUsernameErrorMessage(result.message);
    }, []);

    const onChangeDisplayName = useCallback(e => {
        const newValue = e.target.value;
        setDisplayName(newValue);
        const result = validator.checkDisplayName({
            displayName: newValue.trim(),
        });
        setDisplayNameErrorMessage(result.message);
    }, []);

    const onChangePhoto = useCallback(e => {
        const newValue = e.target.value;
        setPhoto(newValue);
    }, []);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const formData = {
                username: username.trim(),
                displayName: displayName.trim(),
                photo: photo,
            };
            const result = validator.validate(formData);

            if (result.valid) {
                dispatch({
                    type: CHANGE_INFO_CALL,
                    data: formData,
                });
            }
        },
        [dispatch, displayName, photo, username],
    );

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Item
                    label="User name"
                    hasFeedback={true}
                    help={usernameErrorMessage}
                    validateStatus={
                        !usernameErrorMessage ? 'success' : 'error'
                    }>
                    <Input value={username} onChange={onChangeUsername} />
                </Form.Item>
                <Form.Item
                    label="Display name"
                    hasFeedback={true}
                    help={displayNameErrorMessage}
                    validateStatus={
                        !displayNameErrorMessage ? 'success' : 'error'
                    }>
                    <Input value={displayName} onChange={onChangeDisplayName} />
                </Form.Item>
                <Form.Item>
                    <Input
                        value={photo}
                        onChange={onChangePhoto}
                        suffix={
                            <Button onClick={onClickShowFileListModal}>
                                <Icon type="picture" /> Select image
                            </Button>
                        }
                    />
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        loading={loadingChangeInfo}>
                        Change Information
                    </Button>
                </Form.Item>
            </Form>
            <Modal
                width="100%"
                style={{
                    position: 'fixed',
                    top: 0,
                    bottom: 0,
                    left: 0,
                    right: 0,
                    overflow: 'auto',
                }}
                title="Files"
                content={<div>Copy image file url.</div>}
                footer={false}
                visible={fileListModalVisible}
                onCancel={onClickHideFileListModal}>
                <FileList />
            </Modal>
        </>
    );
};

export default ChangeInfoForm;
