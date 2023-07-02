const users = require("../models/userSchema");
const userotp = require("../models/userOtp");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

const tarnsporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    }
})


exports.userregister = async (req, res) => {
    const { fname, email, password } = req.body;

    if (!fname || !email || !password) {
        res.status(400).json({ error: "Please Enter All Input Data" })
    }

    try {
        const presuer = await users.findOne({ email: email });

        if (presuer) {
            res.status(400).json({ error: "This User Allready exist in our db" })
        } else {
            const userregister = new users({
                fname, email, password
            });

            // here password hasing

            const storeData = await userregister.save();
            res.status(200).json(storeData);
        }
    } catch (error) {
        res.status(400).json({ error: "Invalid Details", error })
    }

};



exports.userOtpSend = async (req, res) => {
    const { mobile } = req.body;
  
    if (!mobile) {
      res.status(400).json({ error: "Please Enter Your Mobile Number" });
    }
  
    try {
      const presuer = await users.findOne({ mobile: mobile });
  
      if (presuer) {
        const OTP = otpGenerator.generate(6, { digits: true, alphabets: false, upperCase: false, specialChars: false });
  
        const existMobile = await userotp.findOne({ mobile: mobile });
  
        if (existMobile) {
          const updateData = await userotp.findByIdAndUpdate({ _id: existMobile._id }, {
            otp: OTP
          }, { new: true });
  
          await updateData.save();
  
          // TODO: Send the OTP to the user's mobile number (e.g., via SMS)
  
          res.status(200).json({ message: "OTP sent Successfully" });
        } else {
          const saveOtpData = new userotp({
            mobile,
            otp: OTP
          });
  
          await saveOtpData.save();
  
          // TODO: Send the OTP to the user's mobile number (e.g., via SMS)
  
          res.status(200).json({ message: "OTP sent Successfully" });
        }
      } else {
        res.status(400).json({ error: "This User Not Exist In our Db" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid Details", error });
    }
  };

exports.userLogin = async (req, res) => {
    const { mobile, otp } = req.body;
  
    if (!otp || !mobile) {
      res.status(400).json({ error: "Please Enter Your OTP and Mobile Number" });
    }
  
    try {
      const otpverification = await userotp.findOne({ mobile: mobile });
  
      if (otpverification.otp === otp) {
        const preuser = await users.findOne({ mobile: mobile });
  
        // token generate
        const token = await preuser.generateAuthtoken();
        res.status(200).json({ message: "User Login Successfully Done", userToken: token });
      } else {
        res.status(400).json({ error: "Invalid OTP" });
      }
    } catch (error) {
      res.status(400).json({ error: "Invalid Details", error });
    }
  };
  