import React, { useCallback, useMemo, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Icon } from 'antd';
import { REMOVE_LIKE_POST_CALL, ADD_LIKE_POST_CALL } from '../reducers/post';

const LIKE_COLOR = '#eb2f96';

const IconLike = ({ post }) => {
    const dispatch = useDispatch();
    const { me } = useSelector(s => s.user);
    const { likePostLoading } = useSelector(s => s.post);
    const [loading, setLoading] = useState(false);

    useMemo(() => {
        if (!likePostLoading) {
            setLoading(false);
        }
    }, [likePostLoading]);

    const likersCount = useMemo(() => {
        return (post.Likers && post.Likers.length) || 0;
    }, [post.Likers]);

    const liked = useMemo(() => {
        return (
            me && post.Likers && post.Likers.findIndex(x => x.id === me.id) >= 0
        );
    }, [me, post.Likers]);

    const onClickLike = useCallback(() => {
        if (!!me) {
            let action = ADD_LIKE_POST_CALL;
            if (liked) {
                action = REMOVE_LIKE_POST_CALL;
            }

            setLoading(true);

            dispatch({
                type: action,
                data: {
                    user: post.User.username,
                    post: post.slug,
                },
            });
        }
    }, [dispatch, liked, me, post.User.username, post.slug]);

    return (
        <span onClick={onClickLike} style={{ cursor: !!me ? 'pointer' : '' }}>
            <Icon
                type={loading ? 'loading' : 'heart'}
                theme={!liked || loading ? 'outlined' : 'twoTone'}
                twoToneColor={LIKE_COLOR}
                spin={loading}
            />{' '}
            {`${likersCount}`}
        </span>
    );
};

export default IconLike;
