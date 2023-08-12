const { constants } = require("../constants");

const errorHandler = (err, req, res, next) => {
 const statusCode = res.statusCode || 500
 switch (statusCode) {
    case constants.VALIDATION_ERROR:
        res.json({title: 'Validation Error', message: err.message, success: false})
        break;
    case constants.NOT_FOUND:
        res.json({title: 'Not Found', message: err.message, success: false})
        break;
    case constants.UNAUTHORIZED:
        res.json({title: 'Unauthorized', message: err.message, success: false})
        break;
    case constants.FORBIDDEN:
        res.json({title: 'Forbidden', message: err.message, success: false})
        break;
    case constants.SERVER_ERROR:
        res.json({title: 'Server error', message: err.message, success: false})
        break;
 
    default:
        break;
 }
}

module.exports = errorHandler