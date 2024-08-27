/** Apporach - 1 */
const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn  (req, res, next)
    }
    catch (error){
        res.status(error.code || 500).json({
            success: false,
            message: error.message})
    }
}

/** Apporach - 2 */
// const asyncHandler = (reqHandler) => {
//     (req, res, next) => {
//         Promise.resolve(reqHandler(req, res, next))
//         .catch(err => next(err))
//     }
// }

export  {asyncHandler}