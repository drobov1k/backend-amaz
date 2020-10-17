const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const User = require('../../models/user');

exports.signup = (req, resp) => {
  User.find({
    email: req.body.email,
  })
    .exec((error, user) => {
      if (user.length) {
        return resp.status(400).json({
          message: 'Admin already exists',
        });
      }

      const {
        firstName,
        lastName,
        email,
        password,
      } = req.body;

      const newUser = new User({
        firstName,
        lastName,
        email,
        password,
        username: uuidv4(),
        role: 'admin',
      });

      newUser.save((err, data) => {
        if (err) {
          return resp.status(400).json({
            message: 'Something went wrong',
          });
        }

        if (data) {
          return resp.status(201).json({
            message: 'Admin created successfully',
          });
        }
      });
    });
};

exports.signin = (req, resp) => {
  User.findOne({
    email: req.body.email,
  })
    .exec((error, user) => {
      if (error) {
        return resp.status(400).json({ error });
      }

      if (user) {
        if (user.authenticate(req.body.password) && user.role === 'admin') {
          const token = jwt.sign(
            { _id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '10d' },
          );

          resp.cookie('token', token, { expiresIn: '1h' });
          resp.status(200).json({ token, user });
        } else {
          resp.status(400).json({
            message: 'Invalid password',
          });
        }
      }
    });
};

exports.signout = (req, resp) => {
  resp.clearCookie('token');
  resp.status(200).json({
    message: 'Signout succefully',
  });
};
