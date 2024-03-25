var express = require('express');
var router = express.Router();
const photoModel = require('../models/photoModel.js');
const multer = require('../middleware/multer.js');
const { uploadOnCloudinary } = require('../middleware/cloudinary.js');
const { isLoggedIn, isAdminLoggedIn } = require('../middleware/authMiddleware.js');
// const photosController = require('../controllers/photosController.js')
const adminController = require('../controllers/adminController.js');
const usersModel = require('../models/usersModel.js');
const videoModel = require('../models/videoModel.js');
const voteModel = require('../models/voteModel');


router.use(express.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', isAdminLoggedIn, async function (req, res, next) {
    const users = await usersModel.find();
    const photos = await photoModel.find();
    const videos = await videoModel.find();
    res.render('admin', { users, photos, videos });
});

router.get('/login', function (req, res, next) {
    res.render('adminLogin', { messages: req.flash('error') });
});

router.post('/login', adminController.postAdminLogin, function (req, res) { })

router.get('/logout', adminController.adminGetLogout)


router.get('/photos', isAdminLoggedIn, async function (req, res, next) {
    try {
        const allPhotos2k21 = await photoModel.find({ year: "2k21" });
        const allPhotos2k22 = await photoModel.find({ year: "2k22" });
        const allPhotos2k23 = await photoModel.find({ year: "2k23" });
        res.render('adminPhotos', { allPhotos2k21, allPhotos2k22, allPhotos2k23, messages: req.flash('success') });
    }
    catch (err) {
        console.error('Error in geting Post Data:- ', err.message);
        next(err);
    }
});

//Photo delete
router.post('/photo/:photo__id/delete', isAdminLoggedIn, async function (req, res, next) {
    const del = await photoModel.findByIdAndDelete(req.params.photo__id)
    if (del) {
        req.flash('success', "Photo Deleted!!");
    }
    res.redirect('/admin/photos');
});

// Route for uploading photos
// router.post('/upload', multer.uploadImg.single('image'), photosController.handleUpload);
router.get('/photos/upload/', isAdminLoggedIn, function (req, res, next) {
    res.render('adminPhotoUpload', { messages: req.flash('error') });
});

router.post('/photos/upload/', isAdminLoggedIn, multer.uploadImg.array('photos', 10), async (req, res) => {
    const { postTitle, postDescription, year } = req.body;
    if (!req.files || req.files.length === 0) {
        return res.status(400).send('No files uploaded.');
    }
    const uploadedPhotos = req.files.map(file => ({ imageUrl: file.path }));
    try {
        const savedPhotos = await Promise.all(
            uploadedPhotos.map(async photo => {
                const result = await uploadOnCloudinary(photo.imageUrl);
                if (result) {
                    const newPhoto = new photoModel({
                        postImageUrl: result.secure_url,
                        postTitle: postTitle,
                        postDescription: postDescription,
                        year: year,
                        ownerIds: req.user._id
                    });
                    // Save the new photo document to MongoDB
                    const savedPhoto = await newPhoto.save();
                    // console.log("savedPhoto :- ", savedPhoto)
                    return savedPhoto.postImageUrl;

                } else {
                    return null; // Handle if upload fails
                }
            })
        );

        // Filter out any null values
        const filteredPhotos = savedPhotos.filter(photo => photo !== null);

        res.json(filteredPhotos); // Send back the saved photo details
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/photo/:photoId/liked', isAdminLoggedIn, async function (req, res, next) {
    try {
        const userLiked = await photoModel.findOne({ '_id': req.params.photoId }).populate('likeUserIds');
        res.status(200).json(userLiked);
    } catch (error) {
        console.error('Error occurred while fetching liked photo:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//Admin Vote
router.get('/vote', isAdminLoggedIn, async function (req, res, next) {
    const allVotes = await voteModel.find().populate('user')
    res.render('adminVote', { allVotes, messages: req.flash('success') });
});

router.post('/vote/:idToDelete/delete', isAdminLoggedIn, async function (req, res, next) {
    try {
        const del = await voteModel.findByIdAndDelete(req.params.idToDelete)
        console.log(req.params.idToDelete)
        console.log("del ", del)
        if (del) {
            req.flash('success', "Vote Deleted!!");
        }
        res.redirect('/admin/vote');
    } catch (error) {
        console.error("Error deleting vote:", error);
        res.status(500).send("Internal Server Error");
    }
});


// GET route to render admin users page
router.get('/users', isAdminLoggedIn, async (req, res) => {
    try {
        let users;
        const { search } = req.query;

        if (search) {
            // If search query is provided, filter users by username or name
            users = await usersModel.find({
                $or: [
                    { username: { $regex: search, $options: 'i' } }, // Case-insensitive search for username
                    { name: { $regex: search, $options: 'i' } } // Case-insensitive search for name
                ]
            }, 'username name email mobile dob');
        } else {
            // If no search query, fetch all users
            users = await usersModel.find({}, 'username name email mobile dob');
        }
        const errorMessage = req.flash('error');
        const successMessage = req.flash('success');
        res.render('adminUsers', { users, successMessage, errorMessage });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});

// POST route to update user details
router.post('/users/:userId', isAdminLoggedIn, async (req, res) => {
    const { username, name, email, mobile, dob, newPassword } = req.body;
    const { userId } = req.params;
    try {
        const user = await usersModel.findById(userId);
        if (!user) {
            return res.status(404).send('User not found');
        }
        if (!username || !name || !email || !mobile) {
            req.flash('error', 'Some Important Credintial Missing');
            return res.redirect('/admin/users');
        }
        user.username = username;
        user.name = name;
        user.email = email;
        user.mobile = mobile;
        user.dob = dob;

        // Update user's password if a new password is provided
        if (newPassword) {
            await user.setPassword(newPassword);
        }
        await user.save();

        req.flash('success', 'User details updated successfully');
        res.redirect('/admin/users');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Failed to update user details');
        res.redirect('/admin/users');
    }
});


module.exports = router;