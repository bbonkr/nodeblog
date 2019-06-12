(function(exports) {
    /**
     * URL과 쿼리 정보를 사용해서 URL을 작성합니다.
     * @param {string} URL
     * @param {object} 쿼리 정보
     *
     * @returns {string} 완성된 URL
     */
    exports.normalizeReturnUrl = (pathname = '', query = {}) => {
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

    exports.makeSlug = text => {
        if (!text) {
            return null;
        }

        return text.replace(/\s+/g, '-').toLowerCase();
    };
})(typeof exports === 'undefined' ? (this['stringHelper'] = {}) : exports);
/**
 * URL과 쿼리 정보를 사용해서 URL을 작성합니다.
 * @param {string} URL
 * @param {object} 쿼리 정보
 *
 * @returns {string} 완성된 URL
 */
// export const normalizeReturnUrl = (pathname = '', query = {}) => {
//     let url = pathname;
//     if (!!query) {
//         url = `${url}?`;
//         for (let k in query) {
//             url = `${url}${k}=${query[k]}&`;
//         }
//         url = url.slice(0, -1);
//     }

//     return url;
// };

// module.exports.normalizeReturnUrl = normalizeReturnUrl;

// export const makeSlug = text => {
//     if (!text) {
//         return null;
//     }

//     return text.replace(/\s+/g, '-').toLowerCase();
// };

// module.exports.makeSlug = makeSlug;
