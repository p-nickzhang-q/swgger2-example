'use strict';
const q = require('q');


function asHttpResponse(func, req, res) {
    // const start = createHttpEntry(req);
    try {
        return __initialized.promise.then(() => {
            return q(func.call())
        }).then(function (response) {
            // return q(func.call()).then(function (response) {
            if (response === undefined) {
                return res.status(500).json({
                    code: 500,
                    message: 'No Response'
                });
            }
            // createHttpExit(req, response, start);

            if (response.clearCookies) {
                response.clearCookies.forEach(function (clearCookie) {
                    res.clearCookie(clearCookie.name, clearCookie.options);
                });
            }

            if (response.cookies) {
                var cookies = response.cookies;
                cookies.forEach(cookie => {
                    res.cookie(cookie.name, cookie.value, cookie.options);
                });
            }
            if (response.type === 'file') {
                if (response.fileSize) {
                    res.setHeader('Content-Length', response.fileSize);
                }
                if (response.filename) {
                    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(response.filename));
                }
                if (response.contentType) {
                    res.setHeader('Content-Type', response.contentType);
                } else {
                    res.setHeader('Content-Type', 'application/octet-stream');
                }
                res.end(response.buffer);
            } else if (response.type === 'stream') {
                if (response.filename) {
                    res.setHeader('Content-Disposition', 'attachment; filename=' + encodeURIComponent(response.filename));
                }
                if (response.contentType) {
                    res.setHeader('Content-Type', response.contentType);
                } else {
                    res.setHeader('Content-Type', 'application/octet-stream');
                }
                res.flush();
                res.end();
            } else {
                if (response.clearCookies || response.cookies) {
                    return res.status(200).json(response.data);
                } else {
                    return res.status(200).json(response);
                }
            }
        }).catch(function (err) {
            err.cookies ? res.header('Set-Cookie', err.cookies) : res;
            if (err.clearCookie) {
                res.clearCookie(err.clearCookie.name, err.clearCookie.options);
            }
            // createHttpError(err, req, start);
            return res.status(err.status || 500).json({
                message: err.message,
                uuid: req.uuid,
                nested: err.nested,
                stack: err.stack
            });
        });

    } catch (err) {
        return res.status(err.status || 500).json({
            message: err.message,
            uuid: req.uuid,
            nested: err.nested,
            stack: err.stack
        });
    }
}

module.exports.asHttpResponse = asHttpResponse;