const UserModel = require("../../models/userModel/user")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const ejs = require("ejs");
const path = require("path");
const { pageMaker, makeRespObj } = require("../../AppUtils/")
const { sendEmail } = require("../../AppUtils/emailSend");
const { createJwtToken } = require("../../helpers/utils/utils");

const createUser = async ({ email, phone, password, name, ...userData }) => {
    try {
        let errorArray = {}
        const getEmailData = await UserModel.fetchUserFilterData({
            email: email,
        })
        if (getEmailData !== null) {
            errorArray = {
                email: "This email Already Exists",
                ...errorArray,
            }
            return makeRespObj({
                status_code: 400,
                message:
                    "User creation failed. Please check the provided data.",
                error: errorArray,
            })
        }
        if(password){
            const salt = await bcrypt.genSalt(10)
            password  = await bcrypt.hash(password, salt)
        }
        if(phone){
            if(RegExp(/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/).test(phone)){
                const getPhoneData = await UserModel.fetchUserFilterData({
                    phone: phone,
                })
                if (getPhoneData !== null) {
                    errorArray = {
                        phone: "This phone Already Exists",
                        ...errorArray,
                    }
        
                    return makeRespObj({
                        status_code: 400,
                        message:
                            "User creation failed. Please check the provided data.",
                        error: errorArray,
                    })
                }
            }else{
                errorArray = {
                    phone: "Please enter valid phone",
                    ...errorArray,
                }
    
                return makeRespObj({
                    status_code: 400,
                    message:
                        "User creation failed. Please check the provided data.",
                    error: errorArray,
                })
            }
        }
        const createUser = await UserModel.createUser({
            email,
            phone,
            name,
            password,
            ...userData,
        })
        const token = createJwtToken(
          {
            userID: createUser._id,
            email: createUser.email,
            name: createUser.name,
            key: userData.key,
          },
          "365d",
          process.env.JWT_SECRET
        );
        
        return makeRespObj({
            status_code: 201,
            message: "User has been created successfully.",
            data: {createUser, token},
        })
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}
const createUserByAdmin = async ({ email, phone, password, ...userData }) => {
    try {

        let errorArray = {}

        const getEmailData = await UserModel.fetchUserFilterData({
            email: email,
        })
        if (getEmailData !== null) {
            errorArray = {
                email: "This email Already Exists",
                ...errorArray,
            }

            return makeRespObj({
                status_code: 400,
                message:
                    "User creation failed. Please check the provided data.",
                error: errorArray,
            })
        }
        const getPhoneData = await UserModel.fetchUserFilterData({
            phone: phone,
        })
        if (getPhoneData !== null) {
            errorArray = {
                phone: "This phone Already Exists",
                ...errorArray,
            }

            return makeRespObj({
                status_code: 400,
                message:
                    "User creation failed. Please check the provided data.",
                error: errorArray,
            })
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const createUser = await UserModel.createUser({
            email,
            phone,
            ...userData,
            password: hashedPassword,
        })

        return makeRespObj({
            status_code: 201,
            message: "User has been created successfully.",
            data: createUser,
        })
    } catch (error) {
        console.log(`Error in creating the user: ${error}`)

        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const loginUser = async ({ email, password, key }) => {
    try {
        let errorArray = {}

        const user = await UserModel.fetchOneUser(email)

        if (!user) {
            errorArray = {
                email: "Invalid email",
                ...errorArray,
            }

            return makeRespObj({
                status_code: 400,
                message:
                    "User login failed. Please check the provided data.",
                error: errorArray,
            })
        }

        const isPasswordValid = await bcrypt.compare(password, user.password)

        if (!isPasswordValid) {
            errorArray = {
                password: "Invalid password",
                ...errorArray,
            }
            return makeRespObj({
                status_code: 400,
                message:
                    "User login failed. Please check the provided data.",
                error: errorArray,
            })
        }

        const token = createJwtToken(
          {
            userID: user._id,
            email: user.email,
            name: user.name,
            key,
          },
          "365d",
          process.env.JWT_SECRET
        );
        return makeRespObj({
            status_code: 201,
            message: "Login successful",
            data: { userData: user, token: token },
        })
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getUserData = async ({ search, startToken, endToken }) => {
    try {

        const { page, perPage } = pageMaker({ startToken, endToken })

        const fetchedUserData = await UserModel.fetchUserData(
            search,
            page,
            perPage
        )

        if (fetchedUserData !== null) {
            return makeRespObj({
                status_code: 200,
                message: "Data found successfully",
                data: fetchedUserData,
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const updateUser = async ({ userId, email, phone, adminID, ...updateData }) => {
    try {

        let errorObj = {}

        const getEmailData = await UserModel.fetchUserFilterData({
            email: email,
        })

        if (getEmailData !== null && getEmailData._id.toString() !== userId) {
            errorObj = {
                email: "This email Already Exists",
                ...errorObj,
            }

            return makeRespObj({
                status_code: 400,
                message: "User update failed. Please check the provided data.",
                error: errorObj,
            })
        }

        const getPhoneData = await UserModel.fetchUserFilterData({
            phone: phone,
        })

        if (getPhoneData !== null && getPhoneData._id.toString() !== userId) {
            errorObj = {
                phone: "This phone Already Exists",
                ...errorObj,
            }

            return makeRespObj({
                status_code: 400,
                message: "User update failed. Please check the provided data.",
                error: errorObj,
            })
        }

        const updateUser = await UserModel.updateUser(userId, {
            ...updateData,
            email,
            phone
        })

        if (updateUser) {
            return makeRespObj({
                status_code: 200,
                data: true,
                message: "User data updated successfully",
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to update user data",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const getUserById = async ({ userId }) => {
    try {

        const getUserData = await UserModel.fetchUserById(userId)

        if (getUserData !== null) {
            // Remove password from response
            delete getUserData.password;
            return makeRespObj({
                status_code: 200,
                message: "Data get successfully",
                data: getUserData,
            })
        } else {
            return makeRespObj({
                status_code: 404,
                message: "Data not found",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const changeUserPassword = async ({ userId, oldPassword, newPassword, confirmPassword }) => {

    try {
        const user = await UserModel.fetchUserById(userId)
    
        if (!user) {
            return makeRespObj({
                status_code: 404,
                message: "User not found",
            })
        }
    
        const isPasswordValid = await bcrypt.compare(oldPassword, user.password)
    
        if (!isPasswordValid) {
            return makeRespObj({
                status_code: 401,
                message: "Invalid old password",
            })
        }
    
        if (newPassword !== confirmPassword) {
            return makeRespObj({
                status_code: 400,
                message: "New password and confirm password do not match",
            })
        }
    
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)
    
        const updateUser = await UserModel.updateUser(userId, {
            password: hashedPassword,
        })
    
        if (updateUser) {
            return makeRespObj({
                status_code: 200,
                message: "Password changed successfully",
            })
        } else {
            return makeRespObj({
                status_code: 500,
                message: "Failed to change password",
            })
        }
        
    } catch (error) {
        console.log(error)
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }

}

const deleteUser = async ({ userId }) => {
    try {

        const deleteUser = await UserModel.updateUser(userId, {
            isDeleted: true,
        })
        if (deleteUser) {
            return makeRespObj({
                status_code: 200,
                message: "user deleted successfully",
            })
        } else {
            return makeRespObj({
                status_code: 200,
                message: "Failed to delete user",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const forgotPassword = async ({ email, key }) => {
    try {
        if(email){

            // Fetch user by email
            const user = await UserModel.fetchOneUser(email);
            
            // Check if user exists
            if (!user) {
                return makeRespObj({
                    status_code: 401,
                    message: "Invalid email",
                });
            }
    
            // console.log(process.env.ENCRYPTION_SECRET_KEY)
            // Generate JWT token with user data
           const token = await createJwtToken(
             {
               userID: user._id,
               email: user.email,
               key,
             },
             "5m",
             process.env.JWT_SECRET
           );
    
            // Generate password reset link
            const passwordResetLink = `${process.env.DOMAIN_URL}auth/reset-password/${token}`;
    
            // Prepare email content
            const data = { user: { name: user.name }, passwordResetLink };
            const emailContent = await ejs.renderFile(
                path.join(__dirname, "../../views/forgotPass/forgotPassword.ejs"),
                data
            );
    // views\forgotPass\forgotPassword.ejs
            // Send password reset email
            const subject = "Taj Perfumes";
            sendEmail(emailContent, user.email, subject);
    
            // Return success response
            return makeRespObj({
                status_code: 200,
                message: "Password reset email sent",
            });
        }else{
            return makeRespObj({
                status_code: 401,
                message: "Invalid Email",
            })
        }
    } catch (error) {
        console.log(error);
        // Return error response
        return makeRespObj({
            status_code: 500,
            message: "serverError",
        });
    }
}


const resetPassword = async ({ userData, password }) => {
    try {
        console.log("userData=============>", userData)
        if (!userData) {
            return makeRespObj({
                status_code: 403,
                message: "User Request is Unauthorized!",
            });
        }
        const user = await UserModel.fetchUserById(userData.userID)
        if (!user) {
            return makeRespObj({
                status_code: 403,
                message: "User Request is Unauthorized!",
            })
        }
       

        if(password){
            const hashedPassword = await bcrypt.hash(password, 10)
            user.password = hashedPassword
            user.token = undefined
            await user.save()
    
            return makeRespObj({
                status_code: 200,
                message: "Password reset successfully",
            })
        }else{
            return makeRespObj({
                status_code: 401,
                message: "Password cannot be empty",
            })
        }

    } catch (error) {
        console.log(error)
        return makeRespObj({
            status_code: 500,
            message: "An error occurred",
        })
    }
}

const directCreateUser = async ({ email, key }) => {
    try {

        let errorArray = {}

        const getEmailData = await UserModel.fetchUserFilterData({
            email: email,
        })
        if (getEmailData !== null) {
            errorArray = {
                email: "This email Already Exists",
                ...errorArray,
            }

            return makeRespObj({
                status_code: 400,
                message:
                    "User creation failed. Please check the provided data.",
                error: errorArray,
            })
        }

        const createUser = await UserModel.createUser({
            email,
        })

        const token = createJwtToken(
          {
            userID: createUser._id,
            email: createUser.email,
            key,
          },
          "365d",
          process.env.JWT_SECRET
        );

        return makeRespObj({
            status_code: 201,
            message: "User has been created successfully.",
            data: { userData: createUser, token: token },
        })
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

const changeUserStatus = async ({ userId, isActive }) => {
    try {

        const updatedUser = await UserModel.updateUser(userId, {
            isActive,
        })

        if (updatedUser) {
            return makeRespObj({
                status_code: 200,
                message: "User status changed successfully",
                data: true,
            })
        } else {
            return makeRespObj({
                status_code: 400,
                message: "Failed to change user status",
            })
        }
    } catch (error) {
        return makeRespObj({
            status_code: 500,
            catchErr: error,
        })
    }
}

module.exports = {
    createUser,
    loginUser,
    getUserData,
    updateUser,
    getUserById,
    deleteUser,
    forgotPassword,
    resetPassword,
    changeUserPassword,
    directCreateUser,
    changeUserStatus,
    createUserByAdmin
}
