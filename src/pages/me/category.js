import React, { useState, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Table,
    Button,
    Icon,
    Modal,
    Form,
    Input,
    InputNumber,
    PageHeader,
} from 'antd';
import MeLayout from '../../components/MeLayout';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import { withAuth } from '../../utils/auth';
import {
    LOAD_MY_CATEGORIES_CALL,
    EDIT_MY_CATEGORY_CALL,
    DELETE_MY_CATEGORY_CALL,
} from '../../reducers/me';
import { formatNumber, makeSlug } from '../../helpers/stringHelper';

const validator = {
    name(formData) {
        const { name } = formData;

        if (!name || name.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input a Name of category.',
            };
        }

        return {
            valid: true,
            message: '',
        };
    },
    slug(formData) {
        const { slug } = formData;

        if (!slug || slug.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input a Slug of category.',
            };
        }

        return {
            valid: true,
            message: '',
        };
    },
    ordinal(formData) {
        const { ordinal } = formData;

        return {
            valid: true,
            message: '',
        };
    },
    submit(formData) {
        const results = [];
        results.push(this.name(formData));
        results.push(this.slug(formData));
        results.push(this.ordinal(formData));

        let valid = true;
        const messages = [];
        results.forEach(r => {
            valid &= r.valid;
            if (!r.valid) {
                messages.push(r.message);
            }
        });
        return {
            valid: valid,
            messages: messages,
        };
    },
};

const MyCategory = () => {
    const dispatch = useDispatch();
    const {
        categories,
        loadingCategories,
        categoriesCount,
        categoryLimit,
        categoryNextPageToken,
    } = useSelector(s => s.me);
    const [currentPage, setCurrentPage] = useState(0);

    const [editFormVisible, setEditFormVisible] = useState(false);

    const [id, setId] = useState('');

    const [name, setName] = useState('');
    const [nameErrorMessage, setNameErrorMessage] = useState('');
    const [slug, setSlug] = useState('');
    const [slugErrorMessage, setSlugErrorMessage] = useState('');
    const [ordinal, setOrdinal] = useState(1);
    const [ordinalErrorMessage, setOrdinalErrorMessage] = useState('');

    const columns = [
        {
            key: 'name',
            title: 'Name',
            dataIndex: 'name',
            whidh: '50%',
        },
        {
            key: 'slug',
            title: 'Slug',
            dataIndex: 'slug',
            whidh: '30%',
        },
        {
            key: 'orinal',
            title: 'Orinal',
            dataIndex: 'ordinal',
            whidh: '20%',
        },
    ];

    const onChangePagination = useCallback(
        (current, size) => {
            setCurrentPage(current);
            dispatch({
                type: LOAD_MY_CATEGORIES_CALL,
                data: {
                    pageToken: categoryNextPageToken,
                    limit: size || categoryLimit || 10,
                    keyword: '',
                },
            });
        },
        [categoryLimit, categoryNextPageToken, dispatch],
    );

    const onShowSizeChangePagination = useCallback(
        (current, size) => {
            setCurrentPage(current);
            dispatch({
                type: LOAD_MY_CATEGORIES_CALL,
                data: {
                    pageToken: categoryNextPageToken,
                    limit: size,
                    keyword: '',
                },
            });
        },
        [categoryNextPageToken, dispatch],
    );

    const onClickNewCategory = useCallback(() => {
        setId(0);
        setName('');
        setSlug('');
        setOrdinal(1);

        setEditFormVisible(true);
    }, []);

    const onClickEditCategory = useCallback(
        record => () => {
            setId(record.id);
            setName(record.name);
            setSlug(record.slug);
            setOrdinal(record.ordinal);

            setEditFormVisible(true);
        },
        [],
    );

    const onClickDeleteCategory = useCallback(
        record => () => {
            Modal.confirm({
                title: 'Do you want to delete this category?',
                content: record.name,
                onOk() {
                    dispatch({
                        type: DELETE_MY_CATEGORY_CALL,
                        data: record,
                    });
                },
                onCancel() {},
            });
        },
        [dispatch],
    );

    const onChangeName = useCallback(e => {
        const newValue = e.target.value;
        setName(newValue);
        const { valid, message } = validator.name({ name: newValue });
        if (valid) {
            setSlug(makeSlug(newValue));
        }
        setNameErrorMessage(message);
    }, []);

    const onChangeSlug = useCallback(e => {
        const newValue = e.target.value;
        setSlug(newValue);
        const { valid, message } = validator.slug({ slug: newValue });
        setSlugErrorMessage(message);
    }, []);

    const onChangeOrdinal = useCallback(value => {
        // const newValue = e.target.value;
        setOrdinal(value);
        const { valid, message } = validator.ordinal({ ordinal: value });
        setOrdinalErrorMessage(message);
    }, []);

    const onSubmitEditForm = useCallback(
        e => {
            e.preventDefault();

            const formData = { id, name, slug, ordinal };

            const { valid, messages } = validator.submit(formData);

            if (valid) {
                dispatch({
                    type: EDIT_MY_CATEGORY_CALL,
                    data: formData,
                });
                setEditFormVisible(false);
            }
        },
        [dispatch, id, name, ordinal, slug],
    );

    const onClickCancelEditForm = useCallback(e => {
        setEditFormVisible(false);
    }, []);

    return (
        <MeLayout>
            <ContentWrapper>
                <PageHeader title="Categories" />

                <Table
                    title={currentPageData => {
                        return (
                            <div>
                                <div>
                                    <Button
                                        type="primary"
                                        onClick={onClickNewCategory}>
                                        New category
                                    </Button>
                                </div>
                                <div>
                                    {`Total: ${formatNumber(categoriesCount)}`}
                                </div>
                            </div>
                        );
                    }}
                    rowKey={record => record.id}
                    dataSource={categories}
                    columns={columns}
                    loading={loadingCategories}
                    pagination={{
                        total: categoriesCount,
                        current: currentPage,
                        defaultCurrent: 1,
                        defaultPageSize: 10,
                        showSizeChanger: true,
                        pageSizeOptions: ['10', '20', '30', '50', '100'],
                        onChange: onChangePagination,
                        onShowSizeChange: onShowSizeChangePagination,
                        position: 'both',
                    }}
                    expandedRowRender={record => {
                        return (
                            <div>
                                <Button.Group>
                                    <Button
                                        onClick={onClickEditCategory(record)}>
                                        <span>
                                            <Icon type="edit" /> Edit
                                        </span>
                                    </Button>
                                    <Button
                                        type="danger"
                                        onClick={onClickDeleteCategory(record)}>
                                        <span>
                                            <Icon type="delete" /> Delete
                                        </span>
                                    </Button>
                                </Button.Group>
                            </div>
                        );
                    }}
                />
                <Modal
                    visible={editFormVisible}
                    footer={false}
                    maskClosable={true}
                    onCancel={onClickCancelEditForm}>
                    <Form onSubmit={onSubmitEditForm}>
                        <Form.Item
                            label="Name"
                            help={nameErrorMessage}
                            hasFeedback={true}
                            validateStatus={
                                !nameErrorMessage ? 'success' : 'error'
                            }>
                            <Input value={name} onChange={onChangeName} />
                        </Form.Item>
                        <Form.Item
                            label="Slug"
                            help={slugErrorMessage}
                            hasFeedback={true}
                            validateStatus={
                                !slugErrorMessage ? 'success' : 'error'
                            }>
                            <Input
                                value={slug}
                                onChange={onChangeSlug}
                                disabled={true}
                            />
                        </Form.Item>
                        <Form.Item
                            label="Ordinal"
                            help={ordinalErrorMessage}
                            hasFeedback={true}
                            validateStatus={
                                !ordinalErrorMessage ? 'success' : 'error'
                            }>
                            <InputNumber
                                value={ordinal}
                                onChange={onChangeOrdinal}
                                min={1}
                            />
                        </Form.Item>
                        <Form.Item>
                            <Button.Group>
                                <Button type="primary" htmlType="submit">
                                    Save
                                </Button>
                                <Button onClick={onClickCancelEditForm}>
                                    Cancel
                                </Button>
                            </Button.Group>
                        </Form.Item>
                    </Form>
                </Modal>
            </ContentWrapper>
        </MeLayout>
    );
};

MyCategory.getInitialProps = async context => {
    const state = context.store.getState();
    const { categoryLimit } = state.me;
    context.store.dispatch({
        type: LOAD_MY_CATEGORIES_CALL,
        data: {
            pageToken: null,
            limit: categoryLimit,
            keyword: '',
        },
    });

    return {};
};

export default withAuth(MyCategory);
