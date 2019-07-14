import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Divider, Select, Form, Button, Tabs, Icon, Modal } from 'antd';
import Markdown from 'react-markdown';
import showdown from 'showdown';
import xssFilter from 'showdown-xss-filter';
import { WRITE_POST_CALL, EDIT_POST_CALL } from '../reducers/me';
import FullSizeModal from '../styledComponents/FullSizeModal';
import FileList from './FileList';

const PLACEHOLDER_MARKDOWN = 'Write your thought!';
const SELECT_FILE_TARGET_MARKDOWN = 'markdown';
const SELECT_FILE_TARGET_COVERIMAGE = 'coverimage';

const Validator = {
    checkTitle(formData) {
        const { title } = formData;

        if (!title || title.trim().length === 0) {
            return {
                valid: false,
                message: 'Please input a title',
            };
        }

        return {
            valid: true,
            message: '',
        };
    },

    checkMarkdown(formData) {
        const { markdown } = formData;

        if (!markdown || markdown.trim().length === 0) {
            return {
                valid: false,
                message: 'Please write a your content.',
            };
        }

        return {
            valid: true,
            message: '',
        };
    },

    checkCategory(formData) {
        const { categories } = formData;
        if (!categories || categories.length === 0) {
            return {
                valid: false,
                message: 'Please select a category at least one.',
            };
        }
        return {
            valid: true,
            message: '',
        };
    },

    validate(formData) {
        let valid = true;
        const results = [];
        const messages = [];

        results.push(this.checkTitle(formData));
        results.push(this.checkMarkdown(formData));
        results.push(this.checkCategory(formData));

        results.forEach(v => {
            valid &= v.valid;
            if (!v.valid) {
                messages.push(v.message);
            }
        });

        return { valid: valid, messages: messages };
    },
};

const WritePostForm = ({ id }) => {
    const dispatch = useDispatch();

    // https://github.com/showdownjs/showdown/wiki/Showdown-options
    const markdownConverter = new showdown.Converter(
        {
            omitExtraWLInCodeBlocks: false,
            noHeaderId: false,
            ghCompatibleHeaderId: true,
            prefixHeaderId: true,
            headerLevelStart: 1,
            parseImgDimensions: true,
            simplifiedAutoLink: true,
            excludeTrailingPunctuationFromURLs: true,
            literalMidWordUnderscores: true,
            strikethrough: true,
            tables: true,
            tasklists: true,
            ghMentions: false,
            ghMentionsLink: false,
            ghCodeBlocks: true,
            smartIndentationFix: true,
            smoothLivePreview: true,
            disableForced4SpacesIndentedSublists: true,
            simpleLineBreaks: true,
            requireSpaceBeforeHeadingText: true,
            encodeEmails: true,
        },
        {
            extensions: [xssFilter],
        },
    );
    // const { myPost } = useSelector(s => s.me);

    const {
        categories,
        tags,
        loadingCategories,
        loadingTags,
        loadingMyPost,
        myPost,
    } = useSelector(s => s.me);

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const [coverImage, setCoverImage] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
    const [selectedTagValues, setSelectedTagValues] = useState([]);
    const [fileListVisible, setFileListVisible] = useState(false);
    // const [initCategories, setInitCategories] = useState([]);
    // const [initTags, setInitTags] = useState([]);

    const [selectFileTarget, setSelectFileTarget] = useState('');

    const [titleErrorMessage, setTitleErrorMessage] = useState('');
    const [markdownErrorMessage, setMarkdownErrorMessage] = useState('');
    const [categoriesErrorMessage, setCategoriesErrorMessage] = useState('');

    const markdownRef = React.createRef(null);

    useEffect(() => {
        if (id && myPost) {
            setTitle(myPost.title);
            setSlug(myPost.slug);
            setMarkdown(myPost.markdown);
            setCoverImage(myPost.coverImage);
            setSelectedCategoryValues(
                !!myPost.Categories ? myPost.Categories.map(v => v.slug) : [],
            );
            setSelectedTagValues(
                !!myPost.Tags ? myPost.Tags.map(v => v.slug) : [],
            );
            setSelectedCategories(
                myPost.Categories
                    ? myPost.Categories.map(v => {
                          return { name: v.name, slug: v.slug };
                      })
                    : [],
            );
            setSelectedTags(
                myPost.Tags
                    ? myPost.Tags.map(v => {
                          return {
                              name: v.name,
                              slug: v.slug,
                          };
                      })
                    : [],
            );
        } else {
            /** reset */
            setTitle('');
            setSlug('');
            setMarkdown('');
            setCoverImage('');
            setSelectedCategoryValues([]);
            setSelectedTagValues([]);
            setSelectedCategories([]);
            setSelectedTags([]);
        }
    }, [dispatch, id, myPost]);

    const onChangeTitle = useCallback(
        e => {
            const newValue = e.target.value;
            setTitle(newValue);
            const { message } = Validator.checkTitle({ title: newValue });
            setTitleErrorMessage(message);

            if (
                !!newValue &&
                newValue.trim().length > 0 &&
                (!slug || slug.trim().length === 0)
            ) {
                setSlug(newValue.replace(/\s+/g, '-').toLowerCase());
            }
        },
        [slug],
    );

    const onChangeSlug = useCallback(e => {
        const text = e.target.value;
        setSlug(text);
    }, []);

    const onChangeMarkdown = useCallback(
        e => {
            const newValue = e.target.value;
            setMarkdown(newValue);
            setHtml(markdownConverter.makeHtml(newValue));
            const { message } = Validator.checkMarkdown({ markdown: newValue });
            setMarkdownErrorMessage(message);
        },
        [markdownConverter],
    );

    const onChangeCoverImage = useCallback(e => {
        const newValue = e.target.value;
        setCoverImage(newValue);

        if (!!newValue) {
            // 이미지 확인
        }
    }, []);

    const closeFileList = useCallback(() => {
        setFileListVisible(false);
    }, []);

    const onTabKeyPressed = useCallback(e => {
        e.preventDefault();
        const indent = `    `;
        const startIndex = e.target.selectionStart;
        const endIndex = e.target.selectionEnd;
        const text = e.target.value;
        setMarkdown(
            `${text.substring(0, startIndex)}${indent}${text.substring(
                endIndex,
            )} `,
        );
    }, []);

    const onChangeCategories = useCallback((values, options) => {
        // console.log('selected values', values);
        // console.log('selected options', options);
        setSelectedCategories(
            options.map(v => {
                return { name: v.props.value, slug: v.key };
            }),
        );
        setSelectedCategoryValues(values);

        const { message } = Validator.checkCategory({ categories: values });
        setCategoriesErrorMessage(message);
    }, []);

    const onChangeTags = useCallback((values, options) => {
        // console.log('selected values', values);
        // console.log('selected options', options);

        setSelectedTags(
            options.map(v => {
                return {
                    name: v.props.value,
                    slug: v.key,
                };
            }),
        );
        setSelectedTagValues(values);
    }, []);

    const onClickShowFileListModal = useCallback(() => {
        setSelectFileTarget(SELECT_FILE_TARGET_COVERIMAGE);
        setFileListVisible(true);
    }, []);

    const onClickInsetImage = useCallback(e => {
        setSelectFileTarget(SELECT_FILE_TARGET_MARKDOWN);
        setFileListVisible(true);
    }, []);

    const onSelectMarkdownInsertImage = useCallback(
        item => {
            const { textAreaRef } = markdownRef.current;

            const startIndex = textAreaRef.selectionStart;
            const imageItem = `![${item.fileName}${item.fileExtension}](${
                item.src
            })\n`;
            const currentValue = textAreaRef.value;
            const newValue = `${currentValue.slice(
                0,
                startIndex,
            )}${imageItem}${currentValue.slice(startIndex)}`;

            setMarkdown(newValue);
            // setActiveKey('markdown');
            setFileListVisible(false);
            Modal.destroyAll();
        },
        [markdownRef],
    );

    const onSelectCoverImage = useCallback(item => {
        setCoverImage(item.src);
        setFileListVisible(false);
        Modal.destroyAll();
    }, []);

    const onSelectItemOnFileList = useCallback(
        item => {
            switch (selectFileTarget) {
                case SELECT_FILE_TARGET_MARKDOWN:
                    onSelectMarkdownInsertImage(item);
                    break;

                case SELECT_FILE_TARGET_COVERIMAGE:
                    onSelectCoverImage(item);
                    break;

                default:
                    break;
            }
        },
        [onSelectCoverImage, onSelectMarkdownInsertImage, selectFileTarget],
    );

    const onSubmit = useCallback(
        e => {
            e.preventDefault();

            const formData = {
                title: title.trim(),
                slug: slug.trim(),
                markdown: markdown.trim(),
                categories: selectedCategories,
                tags: selectedTags,
                coverImage: (coverImage || '').trim(),
            };

            const { valid } = Validator.validate(formData);
            if (valid) {
                if (!slug || slug.trim().length === 0) {
                    setSlug(title.replace(/\s+/g, '-').toLowerCase());
                }

                if (id) {
                    dispatch({
                        type: EDIT_POST_CALL,
                        id: id,
                        data: formData,
                    });
                } else {
                    dispatch({
                        type: WRITE_POST_CALL,
                        data: formData,
                    });
                }
            }
        },
        [
            coverImage,
            dispatch,
            id,
            markdown,
            selectedCategories,
            selectedTags,
            slug,
            title,
        ],
    );

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Item
                    label="Title"
                    hasFeedback={true}
                    help={titleErrorMessage}
                    validateStatus={!!titleErrorMessage ? 'error' : ''}>
                    <Input value={title} onChange={onChangeTitle} />
                </Form.Item>
                <Form.Item label="Slug">
                    <Input value={slug} onChange={onChangeSlug} />
                </Form.Item>
                <Form.Item
                    label="Content"
                    hasFeedback={true}
                    help={markdownErrorMessage}
                    validateStatus={!!markdownErrorMessage ? 'error' : ''}>
                    <Tabs>
                        <Tabs.TabPane
                            tab={
                                <span>
                                    <Icon type="file-markdown" /> Markdown
                                </span>
                            }
                            key="markdown">
                            <div>
                                <Button onClick={onClickInsetImage}>
                                    <Icon type="file-image" /> Insert image
                                </Button>
                            </div>
                            <Input.TextArea
                                ref={markdownRef}
                                value={markdown}
                                onChange={onChangeMarkdown}
                                placeholder={PLACEHOLDER_MARKDOWN}
                                autosize={{ minRows: 10, maxRows: 20 }}
                            />
                        </Tabs.TabPane>
                        <Tabs.TabPane
                            tab={
                                <span>
                                    <Icon type="eye" /> Preview
                                </span>
                            }
                            key="preview">
                            <Markdown source={markdown} escapeHtml={false} />
                        </Tabs.TabPane>
                        {/* <Tabs.TabPane
                            tab={
                                <span>
                                    <Icon type="file-image" /> Media
                                </span>
                            }
                            key="media">
                            <div>
                                <FileList onSelect={onSelectImageFile} />
                            </div>
                        </Tabs.TabPane> */}
                    </Tabs>
                </Form.Item>
                <Form.Item label="Cover">
                    <Input
                        value={coverImage}
                        onChange={onChangeCoverImage}
                        placeholder="Set post cover image"
                        addonBefore={
                            <span
                                style={{ cursor: 'pointer' }}
                                onClick={onClickShowFileListModal}>
                                <Icon type="picture" /> Select image
                            </span>
                        }
                    />
                </Form.Item>
                <Form.Item
                    label="Categories"
                    hasFeedback={true}
                    help={categoriesErrorMessage}
                    validateStatus={!!categoriesErrorMessage ? 'error' : ''}>
                    <Select
                        mode="multiple"
                        onChange={onChangeCategories}
                        style={{ width: '100%' }}
                        loading={loadingCategories}
                        value={selectedCategoryValues}>
                        {categories.map(c => {
                            return (
                                <Select.Option
                                    key={c.slug}
                                    value={c.slug}
                                    label={c.name}>
                                    {c.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item label="Tags">
                    <Select
                        mode="tags"
                        onChange={onChangeTags}
                        style={{ width: '100%' }}
                        loading={loadingTags}
                        value={selectedTagValues}>
                        {tags.map(t => {
                            return (
                                <Select.Option
                                    key={t.slug}
                                    value={t.slug}
                                    label={t.name}>
                                    {t.name}
                                </Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Save
                    </Button>
                </Form.Item>
            </Form>

            <FullSizeModal
                title="Select a file"
                footer={false}
                visible={fileListVisible}
                maskClosable={true}
                onCancel={closeFileList}
                destroyOnClose={true}
                width="100%">
                <FileList onSelect={onSelectItemOnFileList} />
            </FullSizeModal>
        </>
    );
};

export default WritePostForm;
