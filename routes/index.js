var express = require('express');
var router = express.Router();
const photoModel = require('../models/photoModel.js');
const multer = require('../middleware/multer.js');
const { uploadOnCloudinary } = require('../middleware/cloudinary.js');
const { isLoggedIn } = require('../middleware/authMiddleware.js');
// const photosController = require('../controllers/photosController.js')
const userController = require('../controllers/userController.js')


router.use(express.urlencoded({ extended: false }));

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index');
});

router.get('/register', function (req, res, next) {
  res.render('register', { messages: req.flash('error') });
});

router.post('/register', userController.postRegister)

// Login or Signin Get
router.get('/login', function (req, res) {
  res.render('login', { messages: req.flash('error') });
});

//Login or Signin Post
router.post('/login', userController.postLogin, function (req, res) { })

router.get('/logout', userController.getLogout);

router.get('/about', function (req, res, next) {
  res.render('about');
});


router.get('/gallery', isLoggedIn, function (req, res, next) {
  res.render('gallery');
});

router.get('/gallery/photos', isLoggedIn, async function (req, res, next) {
  try {
    const allPhotos = await photoModel.find();
    console.log(allPhotos)
    res.render('photos', { allPhotos, messages: req.flash('error') });
  } 
  catch (err) {
    console.error('Error in geting Post Data:- ', err.message);
    next(err);
  }
  // console.log(allPosts)
});

router.get('/videos', isLoggedIn, function (req, res, next) {
  res.render('videos');
});


router.get('/upload', function (req, res, next) {
  res.render('upload');
});

// Route for uploading photos
// router.post('/upload', multer.uploadImg.single('image'), photosController.handleUpload);
router.post('/upload', multer.uploadImg.array('photos', 10), async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No files uploaded.');
  }
  const uploadedPhotos = req.files.map(file => ({ imageUrl: file.path }));
  try {
    // Upload photos to Cloudinary and save the uploaded photo links to MongoDB
    const savedPhotos = await Promise.all(
      uploadedPhotos.map(async photo => {
        console.log("phtot url ",photo.imageUrl)
        const result = await uploadOnCloudinary(photo.imageUrl); // Call your function to upload to Cloudinary
        console.log("Result ", result)
        if (result) {
          // Create a new photo document with Cloudinary URL
          const newPhoto = new photoModel({
            postImageUrl: result.secure_url,
            postTitle: req.body.postTitle,
            postDescription: req.body.postDescription,
          });
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
