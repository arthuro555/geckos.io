export const sendStatus = (res, status) => {
    const statuses = {
        200: 'OK',
        400: 'Bad Request',
        401: 'Unauthorized',
        402: 'Payment Required',
        403: 'Forbidden',
        404: 'Not Found',
        500: 'Internal Server Error'
    };
    res.statusCode = status;
    res.setHeader('Content-Type', 'text/plain');
    if (statuses[status])
        res.end(`${status}: ${statuses[status]}`);
    else
        res.end(status.toString());
};
export const sendJSON = (res, json) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(json));
};
export const getJSONBody = (req) => {
    return new Promise((resolve, reject) => {
        const body = [];
        req
            .on('error', () => {
            console.log('error');
            return reject();
        })
            .on('data', chunk => {
            body.push(chunk);
        })
            .on('end', () => {
            try {
                const bodyStr = Buffer.concat(body).toString();
                const json = JSON.parse(bodyStr);
                return resolve(json);
            }
            catch (err) {
                return reject();
            }
        });
    });
};
//# sourceMappingURL=helpers.js.map