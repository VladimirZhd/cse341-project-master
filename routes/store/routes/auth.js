const router = require('express').Router();
const { check, body } = require('express-validator');
const authController = require('../controllers/auth');
const User = require('../models/user');

router.get('/login', authController.getLogin);
router.get('/signup', authController.getSignup);
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Check your credentials, and try again.').normalizeEmail(),
    body('password', 'Check your credentials, and try again.').isLength({ min: 6 }).isAlphanumeric().trim(),
  ],
  authController.postLogin
);
router.post('/logout', authController.postLogout);
router.post(
  '/signup',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid Email')
      .custom(async (value, { req }) => {
        try {
          const user = await User.findOne({ email: value });
          if (user) {
            return Promise.reject('This email address is already in use.');
          }
        } catch (error) {
          console.error(error);
        }
      })
      .normalizeEmail(),
    body('password', 'Please enter a password with only numbers and text and at least six characters')
      .isLength({ min: 6 })
      .isAlphanumeric()
      .trim(),
    body('confirmPassword')
      .custom((value, { req }) => {
        if (value === req.body.password) {
          throw new Error('Passwords do not match');
        }
        return true;
      })
      .trim(),
  ],
  authController.postSignup
);
router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);
router.get('/reset/:token', authController.getNewPassword);
router.post('/new-password', authController.postNewPassword);

module.exports = router;
