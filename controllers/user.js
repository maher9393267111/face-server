//const { validateEmail, validateLength } = require("../helpers/validation");
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const { generateToken } = require("../helpers/tokens");
const jwt = require("jsonwebtoken");
const { body, validationResult } = require('express-validator');
const { sendVerificationEmail } = require("../helpers/mailer")

exports.registerValiations = [
  body("first_name").not().isEmpty().trim().withMessage("first_name is required"),
  body("last_name").not().isEmpty().trim().withMessage("last_name is required"),
  body("email").isEmail().not().isEmpty().trim().withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be 6 characters long"),
];


// register new user

exports.register2 =  async (req, res) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }



  try {
  
      const { email, password, first_name, last_name,username,gender,bYear,bMonth,bDay } = req.body

       console.log(req.body)

      const userCheck = await User.findOne({ email: email })

      if (userCheck) {
        return res.status(422).json({ error: "User already exists" })
      }

      const HashedPassword = await bcrypt.hash(password, 12)
      const user = await new User({
        
        password: HashedPassword,
        email, first_name, last_name,username,gender,bYear,bMonth,bDay
        
      }).save()

      // const token = jwt.sign({ _id: user._id,user:newUser }, process.env.JWT_SECRET, {
      //   expiresIn: "30d",
      // })


    //  newUser.emailToken = token
      await user.save()

      const emailVerificationToken = generateToken(
        { id: user._id.toString() },
        "4hr"
      );
      
      const url = `${process.env.BASE_URL}/activate/${emailVerificationToken}`;
   
      sendVerificationEmail(user.email, user.first_name, url);


      res.send({
        id: user._id,
        username: user.username,
        picture: user.picture,
        first_name: user.first_name,
        last_name: user.last_name,
        token: emailVerificationToken,
        verified: user.verified,
        message: "Register Success ! please activate your email to start",
      });
     
    
  } catch (error) {
    console.log(error)
  }
}