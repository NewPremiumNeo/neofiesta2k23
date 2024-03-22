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

exports.postAdminLogin = (req, res, next) => {
    const adminEnrollments = ["MGCU2022CSIT3001", "MGCU2022CSIT3004", "MGCU2022CSIT3013"];
    if (adminEnrollments.includes(req.body.enrollment)) {
        passport.authenticate('local', (err, user, info) => {
            if (err) { return next(err); }
            if (!user) {
                req.flash('error', 'Invalid username or password');
                return res.redirect('/admin/login');
            }
            req.flash('success', 'Logged in as admin');
            return req.login(user, (err) => {
                if (err) { return next(err); }
                req.session.isAdmin = true;
                return  res.redirect('/admin');
            });
        })(req, res, next);
    } else {
        req.flash('error', 'Invalid username or password');
        res.redirect('/admin/login');
    }

};

exports.adminGetLogout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/admin/login');
    });
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