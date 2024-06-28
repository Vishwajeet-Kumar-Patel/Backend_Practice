const asyncHandler = (requestHandler) => {
    return (req, res, next) => {
        // Wrap the requestHandler function call in a promise and handle any errors by passing them to next
        Promise.resolve(requestHandler(req, res, next))
            .catch((err) => next(err));
    };
};

export { asyncHandler };


/* const asyncHandler = () => {}
const asyncHandler = (func) => () => {}
const asyncHandler = (func) => async() => {} */


/* const asyncHandler = (fn) => async(req, res, next) => {
    try {
        await fn(req, res, next)

    } catch (error) {
        res.status(err.code || 500).json ({
            succes: false,
            message: err.message,
        })
    }
} */

/* Higher order function are functions which can accept functions as arguments or parameter and can return them too */