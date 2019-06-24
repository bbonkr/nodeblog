import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Divider, Select, Form, Button, Tabs, Icon } from 'antd';
import Markdown from 'react-markdown';
import showdown from 'showdown';
import xssFilter from 'showdown-xss-filter';
import {
    LOAD_MY_CATEGORIES_CALL,
    LOAD_MY_TAGS_CALL,
    LOAD_MY_POST_CALL,
    WRITE_POST_CALL,
    EDIT_POST_CALL,
    WRITE_NEW_POST_CALL,
} from '../reducers/me';
import FullSizeModal from '../styledComponents/FullSizeModal';
import FileList from './FileList';

const PLACEHOLDER_MARKDOWN = 'Write your thought!';

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
        }
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
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);
    const [selectedCategoryValues, setSelectedCategoryValues] = useState([]);
    const [selectedTagValues, setSelectedTagValues] = useState([]);
    // const [initCategories, setInitCategories] = useState([]);
    // const [initTags, setInitTags] = useState([]);

    const onChangeTitle = useCallback(e => {
        const text = e.target.value;
        setTitle(text);
    }, []);

    const onChangeSlug = useCallback(e => {
        const text = e.target.value;
        setSlug(text);
    }, []);

    const onChangeMarkdown = useCallback(
        e => {
            const text = e.target.value;
            setMarkdown(text);
            setHtml(markdownConverter.makeHtml(text));
        },
        [markdownConverter]
    );

    const [fileListVisible, setFileListVisible] = useState(false);

    const closeFileList = useCallback(() => {
        setFileListVisible(false);
    }, []);

    useEffect(() => {
        // console.log('/me/write => useEffect id: ', id);

        // if (!id) {
        //     dispatch({ type: WRITE_NEW_POST_CALL });
        // }

        if (id && myPost) {
            setTitle(myPost.title);
            setSlug(myPost.slug);
            setMarkdown(myPost.markdown);
            setSelectedCategoryValues(
                !!myPost.Categories ? myPost.Categories.map(v => v.slug) : []
            );
            setSelectedTagValues(
                !!myPost.Tags ? myPost.Tags.map(v => v.slug) : []
            );
            setSelectedCategories(
                myPost.Categories
                    ? myPost.Categories.map(v => {
                          return { name: v.name, slug: v.slug };
                      })
                    : []
            );
            setSelectedTags(
                myPost.Tags
                    ? myPost.Tags.map(v => {
                          return {
                              name: v.name,
                              slug: v.slug,
                          };
                      })
                    : []
            );
        } else {
            /** reset */
            setTitle('');
            setSlug('');
            setMarkdown('');
            setSelectedCategoryValues([]);
            setSelectedTagValues([]);
            setSelectedCategories([]);
            setSelectedTags([]);
        }
    }, [dispatch, id, myPost]);

    const onTabKeyPressed = useCallback(e => {
        e.preventDefault();
        const indent = `    `;
        const startIndex = e.target.selectionStart;
        const endIndex = e.target.selectionEnd;
        const text = e.target.value;
        setMarkdown(
            `${text.substring(0, startIndex)}${indent}${text.substring(
                endIndex
            )} `
        );
    }, []);

    const onChangeCategories = useCallback((values, options) => {
        // console.log('selected values', values);
        // console.log('selected options', options);
        setSelectedCategories(
            options.map(v => {
                return { name: v.props.value, slug: v.key };
            })
        );
        setSelectedCategoryValues(values);
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
            })
        );
        setSelectedTagValues(values);
    }, []);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();

            if (!title) {
            }

            if (!slug) {
                setSlug(title.replace(/\s+/g, '-').toLowerCase());
            }

            if (id) {
                dispatch({
                    type: EDIT_POST_CALL,
                    id: id,
                    data: {
                        title: title,
                        slug: slug,
                        markdown: markdown,
                        categories: selectedCategories,
                        tags: selectedTags,
                    },
                });
            } else {
                dispatch({
                    type: WRITE_POST_CALL,
                    data: {
                        title: title,
                        slug: slug,
                        markdown: markdown,
                        categories: selectedCategories,
                        tags: selectedTags,
                    },
                });
            }
        },
        [dispatch, id, markdown, selectedCategories, selectedTags, slug, title]
    );

    return (
        <>
            <Form onSubmit={onSubmit}>
                <Form.Item label="Title">
                    <Input value={title} onChange={onChangeTitle} />
                </Form.Item>
                <Form.Item label="Slug">
                    <Input value={slug} onChange={onChangeSlug} />
                </Form.Item>
                <Form.Item label="Content">
                    <Tabs>
                        <Tabs.TabPane
                            tab={
                                <span>
                                    <Icon type="file-markdown" /> Markdown
                                </span>
                            }
                            key="markdown">
                            <Input.TextArea
                                value={markdown}
                                onChange={onChangeMarkdown}
                                placeholder={PLACEHOLDER_MARKDOWN}
                                autosize={{ minRows: 10 }}
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
                        <Tabs.TabPane
                            tab={
                                <span>
                                    <Icon type="file-image" /> Media
                                </span>
                            }
                            key="media">
                            <div>
                                <FileList />
                            </div>
                        </Tabs.TabPane>
                    </Tabs>
                </Form.Item>
                <Form.Item label="Categories">
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
                footer={false}
                visible={fileListVisible}
                maskClosable={true}
                onCancel={closeFileList}
                width="100%">
                <FileList />
            </FullSizeModal>
        </>
    );
};

export default WritePostForm;
