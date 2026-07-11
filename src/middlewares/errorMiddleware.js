export const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;

    // res.status(statusCode).json({
    //     success: false,
    //     message: err.message || "Internal Server Error"
    // });

    const response = {
        success: false,
        message: err.message || "Internal Server Error",
    };

    if (!err.isOperational) {       // errors like DB crash, stack trace, internal code issue
        console.error("💥 PROGRAMMING ERROR:", err);
        
        response.message = "Something went wrong";
    }

    res.status(statusCode).json(response);
};

