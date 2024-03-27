const userModel = require('../models/usersModel');
const passport = require('passport');
const localStrategy = require('passport-local').Strategy;

passport.use(
    new localStrategy({
        usernameField: "enrollment",
        passwordField: "password"
    },
        userModel.authenticate())
);


function validateEnrollment(enrollment) {
    const regex = /^MGCU(2020|2021|2022|2023)CSIT(30(01|0[2-9]|[1-3]\d)|303([0-2]\d|3[0-3]))$/;
    if (!regex.test(enrollment)) {
        return false;
    }

    const YYYY = enrollment.slice(4, 8);
    const XXXX = enrollment.slice(12);

    switch (YYYY) {
        case "2020":
            if (!(XXXX >= 3001 && XXXX <= 3033)) {
                return false;
            }
            break;
        case "2021":
            if (!(XXXX >= 3001 && XXXX <= 3039) || XXXX == 3013 || XXXX == 3024 || XXXX == 3029) {
                return false;
            }
            break;
        case "2022":
            if (!(XXXX >= 3001 && XXXX <= 3025) || XXXX == 3005 || XXXX == 3007 || XXXX == 3019 || XXXX == 3022) {
                return false;
            }
            break;
        case "2023":
            if (!(XXXX >= 3001 && XXXX <= 3030)) {
                return false;
            }
            break;
        default:
            return false;
    }

    return true;
}

exports.postRegister = async (req, res) => {
    try {
        const { enrollment, email, name, mobile, password } = req.body;

        // Check if enrollment number is provided
        if (!enrollment) {
            req.flash('error', 'Enrollment number is required.');
            return res.redirect('/register');
        }

        // Check if email is already used or not provided
        const existingEmailUser = await userModel.findOne({ email });
        if (existingEmailUser || !email) {
            req.flash('error', 'Email is already used');
            return res.redirect('/register');
        }
        console.log(enrollment)
        // Check if enrollment number is already used
        const existingEnrollmentUser = await userModel.findOne({ username: enrollment });
        if (existingEnrollmentUser) {
            req.flash('error', 'Enrollment is already used');
            return res.redirect('/register');
        }

        // Validate enrollment number format
        if (!validateEnrollment(enrollment.toUpperCase())) {
            req.flash('error', 'Invalid Enrollment Number');
            return res.redirect('/register');
        }


        // Create new user data
        const userData = {
            username: enrollment,
            name,
            email,
            mobile,
        };

        // Register the user
        await userModel.register(userData, password)
            .then(() => {
                passport.authenticate('local')(req, res, () => {
                    req.flash('success', 'Registration successful. You are now logged in.');
                    res.redirect('/');
                });
            })
            .catch((err) => {
                console.log('Error in Register!! ', err.message);
                req.flash('error', err.message);
                res.redirect('/register');
            });
        console.log("2 shuuuuuuuu")
    } catch (err) {
        console.error('Error in registerUser:', err.message);
        req.flash('error', err.message);
        res.redirect('/register');
    }
};


exports.postLogin = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
});


exports.getLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/login');
    });
};

exports.updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        req.user.changePassword(oldPassword, newPassword, (err, user) => {
            if (err) {
                if (err.name === 'IncorrectPasswordError') {
                    req.flash('error', 'Incorrect old password');
                    return res.redirect('/changepassword'); // Redirect to change password page
                }
                console.error(err);
                req.flash('error', 'Failed to update password');
                return res.redirect('/changepassword'); // Redirect to change password page
            }
            req.flash('success', 'Password updated successfully');
            return res.redirect('/login'); // Redirect to login page
        });
    } catch (error) {
        console.error(error);
        req.flash('error', 'Server Error');
        res.redirect('/changepassword'); // Redirect to change password page
    }
};

// exports.postEditProfile = async function (req, res) {
//     const {username, email, fullname, bio, userOldDp} = req.body;
//     try {
//         const existingEmailUser = await userModel.findOne({ email, _id: { $ne: req.user._id } });
//         const existingEnrollmentUser = await userModel.findOne({ username, _id: { $ne: req.user._id } });
//         if (existingEmailUser) {
//             req.flash('error', 'Email is already used');
//             return res.redirect('/profile');
//         }
//         if (existingEnrollmentUser) {
//             req.flash('error', 'Username is already used');
//             return res.redirect('/profile');
//         }
//         const userdp = req.file ? req.file.filename : userOldDp;
//         let updatedUserData = await userModel.findByIdAndUpdate(req.user._id, {
// enrollment,
// name,
// email,
// mobile,
// dob
// // userDp: userdp
//         })
//         console.log(updatedUserData);
//         res.redirect('/profile');
//     } catch (err) {
//         console.error('Error in editing profile:', err.message);
//         res.status(500).send('Internal Server Error');
//     }
// };