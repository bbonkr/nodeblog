import React from 'react';
import { List, Badge } from 'antd';
import Link from 'next/link';
import PropTypes from 'prop-types';

const CategoryList = ({ categories }) => {
    return (
        <List
            dataSource={categories}
            renderItem={item => {
                return (
                    <List.Item
                        extra={
                            <Badge
                                count={item.Posts ? item.Posts.length : 0}
                                overflowCount={999}
                            />
                        }>
                        <Link
                            href={{
                                pathname: '/category',
                                query: { category: item.slug },
                            }}
                            as={`/category/${item.slug}`}>
                            <a>{item.name}</a>
                        </Link>
                    </List.Item>
                );
            }}
        />
    );
};

CategoryList.propTypes = {
    categories: PropTypes.array.isRequired,
};

export default CategoryList;
