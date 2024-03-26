var express = require('express');
var router = express.Router();
const photoModel = require('../models/photoModel.js');
const { isLoggedIn } = require('../middleware/authMiddleware.js');
// const photosController = require('../controllers/photosController.js')
const userController = require('../controllers/userController.js');
const usersModel = require('../models/usersModel.js');


router.use(express.urlencoded({ extended: false }));

/* GET home page. */

router.get('/error', (req, res, next) => {
  throw Error("AALU GHOBHI LEGA")
})
router.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }

  res.status(500)
  res.render('error', { error: err })
})


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

router.get('/gallery/photos/:year', isLoggedIn, async function (req, res, next) {
  try {
    const year = req.params.year
    const validYear = ["2k21", "2k22", "2k23"]
    if (validYear.includes(year)) {
      const allPhotos = await photoModel.find({ year });
      res.render('photos', { allPhotos, title: `Image Gallery ${year}` });
    } else {
      throw Error("Page Not Found")
    }
  }
  catch (err) {
    console.error('Error in geting Post Data:- ', err.message);
    next(err);
  }
});

// router.get('/videos', isLoggedIn, function (req, res, next) {
//   res.render('videos');
// });

router.get('/photos2', async function (req, res, next) {
  const allPhotos = await photoModel.find();
  res.render('photos', { allPhotos, title: `Image Gallery 2222` });
});

router.get('/changepassword', isLoggedIn, (req, res) => {
  res.render('changePassword', {
    successMsg: req.flash('success'),
    errorMsg: req.flash('error')
  });
});

router.get('/profile', isLoggedIn, async (req, res) => {
  try {
    const user = await usersModel.findOne({ _id: req.user._id }).populate('likePhotoIds likeVideoIds');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});
router.get('/profile/moredetail',async (req,res)=>{
  try {
    const user = await usersModel.findOne({ _id: req.user._id }).populate('likePhotoIds likeVideoIds');
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('moredetail', { user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
})

router.post('/changePassword', isLoggedIn, userController.updatePassword);

module.exports = router;