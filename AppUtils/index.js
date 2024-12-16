const chalk = require("chalk")



const handleLogs = ({ statusCode, color, bgcolor, data, patern, message }) => {
    if ((!statusCode && color) || bgcolor) {
        return console.log(
            chalk[
                color && !bgcolor
                    ? color
                    : "bg" + bgcolor.charAt(0).toUpperCase() + bgcolor.slice(1)
            ](
                (patern ? patern : "::::::::::-->>>>") +
                    data +
                    (patern ? patern : "<<<<--::::::::::")
            )
        )
    }
    return console.log(
        chalk[
            statusCode === 200 || statusCode === 201
                ? "green"
                : statusCode === 500
                ? "bgRed"
                : "red"
        ](
            (patern ? patern : "::::::::::-->>>>") +
                data +
                (patern ? patern : "<<<<--::::::::::")
        )
    )
}

module.exports = {
    pageMaker: ({ startToken, endToken }) => {
        const perPage = parseInt(endToken) || 10
        let page = Math.max((parseInt(startToken) || 1) - 1, 0)
        if (page !== 0) {
            page = perPage * page
        }
        return { perPage, page }
    },
    makeRespObj: ({
        status_code,
        message,
        data,
        error,
        others,
        isHideLogs,
        catchErr,
    }) => {
        if (!isHideLogs)
            handleLogs({
                statusCode: status_code,
                data: catchErr
                    ? "::: CATCH ERROR ::::>>>" + catchErr
                    : message + "::: DATA ::::>>>" + JSON.stringify(data),
            })
        return {
            status: status_code === 200 || status_code === 201 ? true : false,
            status_code: status_code ? status_code : 400,
            message: message ? message : "Something went wrong !",
            data: data ? data : null,
            ...(status_code !== 500 && {
                error: error ? error : null,
            }),
            ...(status_code === 500 && {
                server_error: "An unexpected error occurred",
            }),
            ...(others && {
                others,
            }),
        }
    },
    logMarker: handleLogs,
}



// const generateToken = () => {
//     return crypto.randomBytes(20).toString('hex');
//   };
  
//   module.exports = {
//    generateToken,
//   };