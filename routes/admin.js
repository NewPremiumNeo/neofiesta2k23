var express = require('express');
var router = express.Router();
const photoModel = require('../models/photoModel.js');
const multer = require('../middleware/multer.js');
const { uploadOnCloudinary } = require('../middleware/cloudinary.js');
const { isLoggedIn, isAdminLoggedIn } = require('../middleware/authMiddleware.js');
// const photosController = require('../controllers/photosController.js')
const adminController = require('../controllers/adminController.js')



router.use(express.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', isAdminLoggedIn, function (req, res, next) {
    res.render('admin');
});

router.get('/login', function (req, res, next) {
    res.render('adminLogin', { messages: req.flash('error') });
});

router.post('/login', adminController.postAdminLogin, function (req, res) { })


router.get('/photos', isAdminLoggedIn, async function (req, res, next) {
    try {
        let allPhotos2k21 = await photoModel.find({ year: "2k21" });
        let allPhotos2k22 = await photoModel.find({ year: "2k22" });
        let allPhotos2k23 = await photoModel.find({ year: "2k23" });
        allPhotos2k21 = allPhotos2k22 = allPhotos2k23 = await photoModel.find();
        res.render('adminPhotos', { allPhotos2k21, allPhotos2k22, allPhotos2k23, messages: req.flash('success') });
    }
    catch (err) {
        console.error('Error in geting Post Data:- ', err.message);
        next(err);
    }
});

router.post('/photo/:photo__id/delete', isAdminLoggedIn, async function (req, res, next) {
    const del = await photoModel.findByIdAndDelete(req.params.photo__id)
    console.log("Deleted ", del)
    if (del) {
        req.flash('success', "Photo Delected!!");
    }
    res.send("<script>window.location.reload();</script>");
});

// Route for uploading photos
// router.post('/upload', multer.uploadImg.single('image'), photosController.handleUpload);
router.get('/photos/upload/', isAdminLoggedIn, function (req, res, next) {
    res.render('adminPhotoUpload', { messages: req.flash('error') });
});

router.post('/photos/upload/', isAdminLoggedIn, multer.uploadImg.array('photos', 10), async (req, res) => {
    const { postTitle, postDescription, year } = req.body;
    console.log(req.body)
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
                    console.log("Ne ww ", newPhoto)
                    // Save the new photo document to MongoDB
                    const savedPhoto = await newPhoto.save();
                    console.log("savedPhoto :- ", savedPhoto)
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



module.exports = router;