import { body } from "express-validator";


const userRegisterValidator = () => {
    return [
        body("email")
            .trim()
            .notEmpty()
            .withMessage("Email is reqiured!")
            .isEmail()
            .withMessage("Emial is invalid")
            ,
        body("username")
            .trim()
            .notEmpty()
            .withMessage("User-name is required")
            .isLowercase()
            .withMessage("username must be in lowercase")
            .isLength({min: 3})
            .withMessage("Username must be at least 3 characters long")
            ,
        body("password")
            .trim()
            .notEmpty()
            .withMessage("Password is required!")
            .isLength({min: 6})
            .withMessage("Password must be at least 6 characters long")
            ,
        body("fullname")
            .optional()
            .trim()
            .notEmpty()
            .withMessage("Fullname cannot be empty if provided")
    ]
}


const userLoginValidator = () => {
    return (
        body("email")
            .optional()
            .isEmail()
            .withMessage("Email is invalid"),
        
            body("password")
                .notEmpty()
                .withMessage("Password is required.")
    )
}

const userChangeCurrentPasswordValidator = () => {
    return [
        body("oldPassword").notEmpty().withMessage("Old password is required."),
        body("newPassword").notEmpty().withMessage("New password is required.")
    ]
}

const userForgotPasswordValidator = () => {
    return [
        body("email").notEmpty().withMessage("Email is required.").isEmail().withMessage("Email is invalid."),
    ];
}

const userResetForgotPasswordVaidator = () => {
    return [
        body("newPassword").notEmpty().withMessage("Password is required.")
    ]
}
export {
    userRegisterValidator,
    userLoginValidator,
    userChangeCurrentPasswordValidator,
    userForgotPasswordValidator,
    userResetForgotPasswordVaidator
}