export const normalizeReturnUrl = (pathname = '', query = {}) => {
    let url = pathname;
    if (!!query) {
        url = `${url}?`;
        for (let k in query) {
            url = `${url}${k}=${query[k]}&`;
        }
        url = url.slice(0, -1);
    }

    return url;
};
