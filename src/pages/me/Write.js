import React, { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Input, Divider, Select, Form, Button, Tabs, Icon } from 'antd';
import Markdown from 'react-markdown';
import { ContentWrapper } from '../../styledComponents/Wrapper';
import MeLayout from '../../components/MeLayout';
import { withAuth } from '../../utils/auth';
// import { markdownConverter } from '../../helpers/converter';
import showdown from 'showdown';
import xssFilter from 'showdown-xss-filter';
import {
    LOAD_MY_CATEGORIES_CALL,
    LOAD_MY_TAGS_CALL,
    WRITE_POST_CALL,
} from '../../reducers/me';

const PLACEHOLDER_MARKDOWN = 'Write your thought!';

const Write = () => {
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

    const { categories, tags, loadingCategories, loadingTags } = useSelector(
        s => s.me,
    );

    const [title, setTitle] = useState('');
    const [slug, setSlug] = useState('');
    const [markdown, setMarkdown] = useState('');
    const [html, setHtml] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [selectedTags, setSelectedTags] = useState([]);

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
        [markdownConverter],
    );

    // const onKeyUpMarkDown = useCallback(e => {
    //     console.log('keyCode', e.keyCode);

    //     const tabKeyPressed = e.keyCode === 9;
    //     if (tabKeyPressed) {
    //         e.preventDefault();
    //         const indent = `    `;
    //         const startIndex = e.target.selectionStart;
    //         const endIndex = e.target.selectionEnd;
    //         const text = e.target.value;
    //         setMarkdown(
    //             `${text.substring(0, startIndex)}${indent}${text.substring(
    //                 endIndex,
    //             )} `,
    //         );
    //     }
    // }, []);

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
        console.log('selected values', values);
        console.log('selected options', options);
        setSelectedCategories(
            options.map(v => {
                return { name: v.props.value, slug: v.key };
            }),
        );
    }, []);

    const onChangeTags = useCallback((values, options) => {
        console.log('selected values', values);
        console.log('selected options', options);
        setSelectedTags(
            options.map(v => {
                return {
                    name: v.props.value,
                    slug: v.key,
                };
            }),
        );
    }, []);

    const onSubmit = useCallback(
        e => {
            e.preventDefault();

            if (!title) {
            }

            if (!slug) {
                setSlug(title.replace(/\s+/g, '-').toLowerCase());
            }

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
        },
        [dispatch, markdown, selectedCategories, selectedTags, slug, title],
    );

    return (
        <MeLayout>
            <ContentWrapper>
                <h1> new post</h1>
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
                                <Markdown
                                    source={markdown}
                                    escapeHtml={false}
                                />
                            </Tabs.TabPane>
                        </Tabs>
                    </Form.Item>
                    <Form.Item label="Categories">
                        <Select
                            mode="multiple"
                            onChange={onChangeCategories}
                            style={{ width: '100%' }}
                            loading={loadingCategories}>
                            {categories.map(c => {
                                const selected = false;
                                return (
                                    <Select.Option
                                        key={c.slug}
                                        selected={selected}
                                        value={c.name}>
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
                            loading={loadingTags}>
                            {tags.map(t => {
                                const selected = false;
                                return (
                                    <Select.Option
                                        key={t.slug}
                                        selected={selected}
                                        value={t.name}>
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
            </ContentWrapper>
        </MeLayout>
    );
};

Write.getInitialProps = async context => {
    context.store.dispatch({
        type: LOAD_MY_CATEGORIES_CALL,
    });

    context.store.dispatch({
        type: LOAD_MY_TAGS_CALL,
    });

    return {};
};

export default withAuth(Write);
