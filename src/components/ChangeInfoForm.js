import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Modal, Icon, AutoComplete } from 'antd';
import { signUpFormValidator } from '../helpers/formValidators';
import { CHANGE_INFO_CALL, MAKE_VERIFY_EMAIL_CALL } from '../reducers/user';
import FileList from './FileList';
import FullSizeModal from '../styledComponents/FullSizeModal';

const validator = {
    checkEmail(formData) {
        return signUpFormValidator.checkEmail(formData);
    },
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

        results.push(this.checkEmail(formData));
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
    const [email, setEmail] = useState('');
    const [emailErrorMessage, setemailErrorMessage] = useState('');
    const [username, setUsername] = useState('');
    const [usernameErrorMessage, setUsernameErrorMessage] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [displayNameErrorMessage, setDisplayNameErrorMessage] = useState('');
    const [fileListModalVisible, setFileListModalVisible] = useState(false);
    const [photo, setPhoto] = useState('');

    useEffect(() => {
        if (me && me.id) {
            setEmail(me.email);
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
        Modal.destroyAll();
    }, []);

    const onChangeEmail = useCallback(e => {
        const newValue = e.target.value;
        setEmail(newValue);
        const result = validator.checkEmail({ email: newValue.trim() });
        setemailErrorMessage(result.message);
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

    const onClickVerifyEmail = useCallback(() => {
        if (!me.isEmailConfirmed) {
            dispatch({
                type: MAKE_VERIFY_EMAIL_CALL,
            });
        }
    }, [dispatch, me.isEmailConfirmed]);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();
            const formData = {
                email: email.trim(),
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
        [dispatch, displayName, email, photo, username],
    );

    const onSelect = item => {
        if (!!item) {
            setPhoto(item.src);
            setFileListModalVisible(false);
            Modal.destroyAll();
        }
    };

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Item
                    label="Email address"
                    hasFeedback={true}
                    validateStatus={!emailErrorMessage ? 'success' : 'error'}
                    help={emailErrorMessage}>
                    <Input
                        value={email}
                        onChange={onChangeEmail}
                        placeholder="Please input your email"
                        addonBefore={
                            !me.isEmailConfirmed && (
                                <span
                                    style={{ cursor: 'pointer' }}
                                    onClick={onClickVerifyEmail}
                                    title="Verify email address">
                                    Verify
                                </span>
                            )
                        }
                    />
                </Form.Item>
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

            <FullSizeModal
                footer={false}
                visible={fileListModalVisible}
                maskClosable={true}
                onCancel={onClickHideFileListModal}
                width="100%"
                title="Select a file"
                destroyOnClose={true}>
                <div>
                    <FileList onSelect={onSelect} />
                </div>
            </FullSizeModal>
        </>
    );
};

export default ChangeInfoForm;
