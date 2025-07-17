const {constants} = require('../constant')
const errorHandler = (err, req, res, next) =>{
    const statusCode = res.statusCode ? res.statusCode : 500;

    console.log("ErrorCode : ", res.statusCode);
    console.log("IsErrorCodeAccessed : ", constants.VALIDATION_ERROR);
    
    

    switch(statusCode){
        case constants.VALIDATION_ERROR: res.json(
                        {
                            title:'Validation Error',
                            message:err.message,
                            stackTrace: err.stack
                        }
                    )
                    break;
        case constants.NOT_FOUND: res.json(
                        {
                                        title:'Not found',
                                        message:err.message,
                                        stackTrace: err.stack
                                    }
                    )
                    break;
        case constants.UNAUTHORIZED: res.json(
                        {
                                        title:'UnAuthorized',
                                        message:err.message,
                                        stackTrace: err.stack
                                    }
                    )
                    break;
        case constants.FORBIDDEN: res.json(
                        {
                                        title:'Forbidden',
                                        message:err.message,
                                        stackTrace: err.stack
                                    }
                    )
                    break;
        case constants.SERVER_ERROR: res.json(
                        {
                            title:'Internal Server Error',
                            message:err.message,
                            stackTrace: err.stack
                        }
                    )
                    break;
        default: 
                    console.log("No Error All Good");
                    break;
                    
    }
    
}

module.exports = errorHandler;