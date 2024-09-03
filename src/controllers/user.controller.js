import { asyncHandler } from '../utils/asyncHandler.js';
import { apiError } from '../utils/apiError.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { apiResponse } from '../utils/apiResponse.js'

const registerUser = asyncHandler( async ( req, res ) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    const { fullName, email, username, password } = req.body

    if (
        [ fullName, email, username, password ].some( ( field ) => field?.trim() === "" )
    ) {
        throw new apiError( 400, "All fields are required" )
    }

    const existedUser = await User.findOne( {
        $or: [ { username }, { email } ]
    } )
    if ( existedUser ) {
        throw new apiError( 400, "Username or email already exists" )
    }

    const avatarLocalPath = req.files?.avatar[ 0 ]?.path;
    const coverImageLocalPath = req.files?.coverImage[ 0 ]?.path;

    if ( !avatarLocalPath ) {
        throw new apiError( 400, "Please upload an avatar" )
    }

    const uploadAvatar = await uploadOnCloudinary( avatarLocalPath )
    const uploadCoverImage = await uploadOnCloudinary( coverImageLocalPath )

    if ( !uploadAvatar ) {
        throw new apiError( 500, "Failed to upload avatar" )
    }

    const createUser = await User.create( {
        fullName,
        email,
        username: username.toLowerCase(),
        password,
        avatar: uploadAvatar.secure_url,
        coverImage: uploadCoverImage?.secure_url || ""
    } )

    const isUserCreated = User.findById( createUser._id ).select( '-password -refreshToken' )

    if ( !isUserCreated ) {
        throw new apiError( 500, "Failed to create user" )
    }

    return res.status( 201 ).json(
        new apiResponse( 201, isUserCreated, "User created successfully" )
    )

} )

export { registerUser }