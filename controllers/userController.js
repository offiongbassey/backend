const asyncHandler = require('express-async-handler');
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const Token = require("../models/tokenModel");
const crypto = require("crypto");
const { sendEmail } = require('../utils/sendEmail');
const RegisterToken = require("../models/registerToken");
const Order = require("../models/orderModel");
const Transaction = require("../models/transactionModel");
const Withdraw = require("../models/withDrawalModel");
const Product = require("../models/productModel");

//jw token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: '1d'});
}

exports.registerUser = asyncHandler(async (req, res) => {
   const {firstName, lastName, email, password, confirmPassword} = req.body;
   //validation
   if(!firstName || !lastName || !email || !password || !confirmPassword){
       res.status(400);
       throw new Error("Please fill in all required fields");
   }
   if(password.length < 6){
       res.status(400);
       throw new Error("Password must be upto 6 characters")
   }
   if(password !== confirmPassword){
       res.status(400);
       throw new Error("Passwords do not match.");
   }
   //check if email already exist
   //Check if user's email already exist
 const userExist =  await User.findOne({email})
 if(userExist){
     res.status(500)
     throw new Error("Sorry, email already exist")
 }
 
    
    //create new user
    const user = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    //generate token 
    // const token = generateToken(user._id);
    //send HTTP-only cookie
    // res.cookie("token", token, {
    //     path: "/",
    //     httpOnly: true,
    //     expires: new Date(Date.now() + 1000 * 86400), // 1 day
    //     sameSite: "none",
    //     secure: false 
    // });

    if(user){
        //generate RegisterToken and send mail to user
        let registerToken = await RegisterToken.findOne({userId: user._id});
        if(registerToken){
            await RegisterToken.deleteOne();
        }

        //save token to database
         let newRegisterToken = crypto.randomBytes(30).toString("hex") + user._id;
         const hashedRegisterToken = crypto
         .createHash("sha256")
         .update(newRegisterToken)
         .digest("hex");

         await new RegisterToken({
             userId: user._id,
             token: hashedRegisterToken
         }).save();

         //send mail
         const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${newRegisterToken}`;

         const message = `
<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:660px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block img.big,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">

<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="20" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-top:50px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="font-family: sans-serif">

<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Hi ${user.firstName},</strong></span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">Kindly confirm your email by clicking on the link below. <br/> 
Thank you.
</span></p>
<p>Regards...</p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
<div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:203px;v-text-anchor:middle;" arcsize="97%" stroke="false" fillcolor="#1aa19c"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]-->
<a href="${confirmUrl}" clicktracking=off>${confirmUrl}</a>
<br/>
<a href="${confirmUrl}" clicktracking=off> 
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>Confirm Your Email</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
</div>
</a>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">

</body>
</html>

`;
const subject = "Verify your email";
const send_to = user.email;
    await sendEmail(subject, message, send_to);

        // const {_id, firstName, lastName, email, photo} = user
        // res.status(201).json({ 
        //     _id, firstName, lastName, email, photo, token
        // });
        res.status(201).json({message: "A verification link has been sent to your mail, kindly verify."});
    }else{
        res.status(400);
        throw new Error("Sorry, something went wrong. Please try again later");

    }
});

exports.loginUser = asyncHandler(async (req, res, next) => {
const { email, password} = req.body;
if(!email || !password){
    res.status(400);
    throw new Error("Please add Email and Password");
}
const user = await User.findOne({email});
if(!user){
    res.status(400);
    throw new Error("User not found, please signup");
}
//check the status if verified
if(user.status === "Pending"){
    res.status(400);
    throw new Error("Account not verified, kindly verify your account with the link sent to your mail.");
}
//check the status if blocked
if(user.status === "Inactive"){
    res.status(400);
    throw new Error("Account disabled, kindly contact the administrator");
}
const checkPassword = await bcrypt.compare(password, user.password);
if(user && checkPassword){
//generate token and send
const token = generateToken(user._id);

res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    expires: new Date(Date.now() + 1000 * 86400),
    sameSite: "none",
    secure: true
});

     const {_id, firstName, lastName, email, photo, role} = user;
     res.status(200).json({
         _id,
         firstName,
         lastName,
         email,
         photo,
         token,
         role
     });
     
}else{
    res.status(400);
    throw new Error("Invalid Email or Password");
}
});

exports.logout = asyncHandler(async(req, res, next) => {
res.cookie("token", "", {
    path: "/",
    httpOnly: true, 
    expires: new Date(0),
    sameSite: "none",
    secure: false
});
return res.status(200).json({message: "Successfully logged out"});
});

// exports.getUser = asyncHandler(async(req, res, next) => {
//     const user = await User.findById(req.user._id);
//     if(user){
//         const {_id, firstName, lastName, email, photo} = user;
//         res.status(200).json({
//             _id, 
//             firstName,
//             lastName,
//             email,
//             photo,
//         })
//     }else{
//         res.status(400);
//         throw new Error("User not found");
//     }
// });


exports.loginStatus = asyncHandler(async(req, res, next) => {
    const token = req.cookies.token;
    if(!token){
        return res.json(false);
    }
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if(verified){
        return res.json(true);
    }
    return res.json(false);

});

exports.getSingleUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user._id);
    if(user){
        const {_id, firstName, lastName, email, photo, role, phone, address, bio, otherName, accountName, accountNumber, bankStatus, bank, bankCode, bankRecipientCode, bankId, bankVerificationId, regNumber, campus, faculty, department, unit} = user;
        res.status(200).json({
            _id, 
            firstName,
            lastName,
            email,
            photo,
            role,
            phone,
            address,
            bio, 
            otherName,
            accountName,
            accountNumber,
            bankStatus,
            bank,
            bankCode, 
            bankRecipientCode, 
            bankId, 
            bankVerificationId,
            regNumber,
            campus,
            faculty,
            department,
            unit
            
        })
    }else{
        res.status(400);
        throw new Error("User not found");
    }
});


exports.updateUser = asyncHandler(async(req, res, next) => {
    const user = await User.findById(req.user._id);
    if(user){
        const { firstName, lastName, email, photo, phone, otherName, address, bio, regNumber, campus, faculty, department, unit} = user;
        user.email = email;
        user.firstName = req.body.firstName || firstName;
        user.lastName = req.body.lastName || lastName;
        user.photo = req.body.photo || photo;
        user.phone = req.body.phone || phone;
        user.otherName = req.body.otherName || otherName;
        user.address = req.body.address || address;
        user.bio = req.body.bio || bio;
        user.regNumber = req.body.regNumber || regNumber;
        user.campus = req.body.campus || campus;
        user.faculty = req.body.faculty || faculty;
        user.department = req.body.department || department;
        user.unit = req.body.unit || unit;

        const updatedUser = await user.save();
        if(updatedUser){

        
        res.status(200).json("Profile Updated Successfully");
    }else{
        res.status(404);
        throw new Error("An error occured, please try again later");
    }

    }else{
        res.status(404);
        throw new Error("User not found");
    }
});

exports.changePassword = asyncHandler(async(req, res, next) => {
    const {oldPassword, password, confirmPassword } = req.body;
    if(!oldPassword || !password || !confirmPassword){
        res.status(400);
        throw new Error("All field is required");
    }
    if(password.length < 6){
        res.status(400);
        throw new Error("Password must not be less than 6 characters");
    }
    if(password !== confirmPassword){
        res.status(400);
        throw new Error("Passwords do not match");
    }
    const user = await User.findById(req.user._id);
    if(!user){
        res.status(400);
        throw new Error("User not found!");
    }
    const checkPassword = await bcrypt.compare(oldPassword, user.password);
    if(checkPassword){
       //update the password
       user.password = password;

       const updatedPassword = await user.save();
       if(updatedPassword){
        res.status(200).json({message: "password successfully changed"});
       }else{
           res.status(400);
           throw new Error("Sorry, an error occured, please try again later");
       }
    }else{
        res.status(400);
        throw new Error("Incorrect Old password.");
    }
   

});

// exports.sendMail = async (req, res, next) => {
//     let config = {
//         service: 'gmail',
//         auth: {
//             user: process.env.EMAIL,
//             pass: process.env.EMAIL_PASSWORD
//         }
//     }
//     let transporter = nodemailer.createTransport(config);
   
//     let message = {
//         from: process.env.EMAIL,
//         to: "naijaspeed1@gmail.com",
//         subject: 'Place Order',
//         html: "Your order has been confirmed."
//     }
//     transporter.sendMail(message)
//     .then(() => {
// return res.status(201).json({msg: "You should receive a mail"})
//     })
//     .catch(error => {   
//         return res.status(500).json({error});
//     })

// }

exports.forgotPassword = asyncHandler(async(req, res, next) => {
    const {email} = req.body;
    const user = await User.findOne({email});
    if(!user){
        res.status(404);
        throw new Error("User does not exist.");
    }
//if token already exist, then delete
let token = await Token.findOne({userId: user._id});
if(token){
    await Token.deleteOne();
}

//Create reset token
let resetToken = crypto.randomBytes(32).toString("hex") + user._id;
const hashedToken = crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

await new Token({
    userId: user._id,
    token: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 30 * (60 * 1000) //30 minutes
}).save();

const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;

//Reset email
const message = `
<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<style>
		* {
			box-sizing: border-box;
		}

		body {
			margin: 0;
			padding: 0;
		}

		a[x-apple-data-detectors] {
			color: inherit !important;
			text-decoration: inherit !important;
		}

		#MessageViewBody a {
			color: inherit;
			text-decoration: none;
		}

		p {
			line-height: inherit
		}

		.desktop_hide,
		.desktop_hide table {
			mso-hide: all;
			display: none;
			max-height: 0px;
			overflow: hidden;
		}

		.image_block img+div {
			display: none;
		}

		@media (max-width:660px) {

			.desktop_hide table.icons-inner,
			.social_block.desktop_hide .social-table {
				display: inline-block !important;
			}

			.icons-inner {
				text-align: center;
			}

			.icons-inner td {
				margin: 0 auto;
			}

			.image_block img.big,
			.row-content {
				width: 100% !important;
			}

			.mobile_hide {
				display: none;
			}

			.stack .column {
				width: 100%;
				display: block;
			}

			.mobile_hide {
				min-height: 0;
				max-height: 0;
				max-width: 0;
				overflow: hidden;
				font-size: 0px;
			}

			.desktop_hide,
			.desktop_hide table {
				display: table !important;
				max-height: none !important;
			}
		}
	</style>
</head>
<body style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">

<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="20" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-top:50px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="font-family: sans-serif">

<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Hi ${user.firstName},</strong></span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">We received a request that you want to change your password, click on the link below to change your password. <br/> 
This reset link is valid for only 30 minutes.
</span></p>
<p>Regards...</p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
<div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:203px;v-text-anchor:middle;" arcsize="97%" stroke="false" fillcolor="#1aa19c"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]-->
<a href="${resetUrl}" clicktracking=off>${resetUrl}</a>
<br/>
<a href="${resetUrl}" clicktracking=off> 
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>Reset Password</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
</div>
</a>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">

</body>
</html>

`;
const subject = "Password Reset";
const send_to = user.email;

try {
    await sendEmail(subject, message, send_to);
    res.status(200).json({success: true, message: "Reset Email sent."});
} catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again.");
}

});

exports.resetPassword = asyncHandler(async(req, res, next) => {
const {password, confirmPassword} = req.body;
const {resetToken} = req.params;
if(!password || !confirmPassword){
    res.status(400);
    throw new Error("Password field is required");
}
if(password.length < 6){
    res.status(400);
    throw new Error("Password must be greater than 5 characters.")
}
if(password !== confirmPassword){
    res.status(400);
    throw new Error("Passwords do not match");
}
const hashedToken = crypto
.createHash("sha256")
.update(resetToken)
.digest("hex");

const userToken = await Token.findOne({
    token: hashedToken,
expiresAt: {$gt: Date.now()}
});
if(!userToken){
    res.status(404);
    throw new Error("Invalid or expired token");
}
const user = await User.findOne({_id: userToken.userId});
user.password = password;

await user.save();
res.status(200).json({
    message: "Password successfully changed, please login."
});
//if token already exist, then delete
// let token = await Token.findOne({_id: userToken});
// if(token){
//     await Token.deleteOne();
// }

});

exports.resendVerificationMail = asyncHandler(async(req, res, next) => {
    const email = req.body.email;
    if(!email){
        res.status(400);
        throw new Error("Please provide your Email");
    }
    const user = await User.findOne({email});
    if(!user){
        res.status(400);
        throw new Error("Account not found, please signup");
    }
    let token = await RegisterToken.findOne({userId: user._id});
    if(token){
       await RegisterToken.deleteOne({_id: token._id});
    }
     //create new token
     token = crypto.randomBytes(30).toString("hex") + user._id;
     const hashedToken = crypto
     .createHash("sha256")
     .update(token)
     .digest("hex");

     await new RegisterToken({
         userId: user._id,
         token: hashedToken
     }).save();
    //send mail using the token

    //send mail
    const confirmUrl = `${process.env.FRONTEND_URL}/confirm-email/${token}`;

    const message = `
<!DOCTYPE html>

<html lang="en" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:v="urn:schemas-microsoft-com:vml">
<head>
<title></title>
<meta content="text/html; charset=utf-8" http-equiv="Content-Type"/>
<meta content="width=device-width, initial-scale=1.0" name="viewport"/><!--[if mso]><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch><o:AllowPNG/></o:OfficeDocumentSettings></xml><![endif]-->
<style>
   * {
       box-sizing: border-box;
   }

   body {
       margin: 0;
       padding: 0;
   }

   a[x-apple-data-detectors] {
       color: inherit !important;
       text-decoration: inherit !important;
   }

   #MessageViewBody a {
       color: inherit;
       text-decoration: none;
   }

   p {
       line-height: inherit
   }

   .desktop_hide,
   .desktop_hide table {
       mso-hide: all;
       display: none;
       max-height: 0px;
       overflow: hidden;
   }

   .image_block img+div {
       display: none;
   }

   @media (max-width:660px) {

       .desktop_hide table.icons-inner,
       .social_block.desktop_hide .social-table {
           display: inline-block !important;
       }

       .icons-inner {
           text-align: center;
       }

       .icons-inner td {
           margin: 0 auto;
       }

       .image_block img.big,
       .row-content {
           width: 100% !important;
       }

       .mobile_hide {
           display: none;
       }

       .stack .column {
           width: 100%;
           display: block;
       }

       .mobile_hide {
           min-height: 0;
           max-height: 0;
           max-width: 0;
           overflow: hidden;
           font-size: 0px;
       }

       .desktop_hide,
       .desktop_hide table {
           display: table !important;
           max-height: none !important;
       }
   }
</style>
</head>
<body style="background-color: #f8f8f9; margin: 0; padding: 0; -webkit-text-size-adjust: none; text-size-adjust: none;">

<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #f8f8f9; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; padding-bottom: 5px; padding-top: 5px; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="20" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
</td>
</tr>
</tbody>
</table>
</td>
</tr>
</tbody>
</table>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row row-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tbody>
<tr>
<td>
<table align="center" border="0" cellpadding="0" cellspacing="0" class="row-content stack" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; background-color: #fff; color: #000000; width: 640px;" width="640">
<tbody>
<tr>
<td class="column column-1" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; font-weight: 400; text-align: left; vertical-align: top; border-top: 0px; border-right: 0px; border-bottom: 0px; border-left: 0px;" width="100%">
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-1" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-3" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-top:50px;">
<div align="center" class="alignment">
<table border="0" cellpadding="0" cellspacing="0" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="divider_inner" style="font-size: 1px; line-height: 1px; border-top: 0px solid #BBBBBB;"><span> </span></td>
</tr>
</table>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-4" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="font-family: sans-serif">

<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Hi ${user.firstName},</strong></span></p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="text_block block-5" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt; word-break: break-word;" width="100%">
<tr>
<td class="pad" style="padding-bottom:10px;padding-left:40px;padding-right:40px;padding-top:10px;">
<div style="font-family: sans-serif">
<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 18px; color: #555555; line-height: 1.5;">
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">Kindly confirm your email by clicking on the link below. <br/> 
Thank you.
</span></p>
<p>Regards...</p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
<div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:203px;v-text-anchor:middle;" arcsize="97%" stroke="false" fillcolor="#1aa19c"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]-->
<a href="${confirmUrl}" clicktracking=off>${confirmUrl}</a>
<br/>
<a href="${confirmUrl}" clicktracking=off> 
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>Confirm Your Email</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
</div>
</a>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="divider_block block-7" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-bottom:12px;padding-top:60px;">

</body>
</html>

`;
const subject = "Verify your email";
const send_to = user.email;

try {
    await sendEmail(subject, message, send_to);
    res.status(200).json({success: true, message: "Verification mail sent, Please check your mail."});
} catch (error) {
    res.status(500);
    throw new Error("An error occured, please try again later");
}


});


exports.confirmEmail = asyncHandler(async(req, res, next) => {
    const token = req.params.token;
    if(!token){
        res.status(400);
        throw new Error("Token is required");
    }
  const hashedToken = crypto.createHash("sha256")
  .update(token)
  .digest("hex");

  const userToken = await RegisterToken.findOne({token: hashedToken});
  if(!userToken){
      res.status(404);
      throw new Error("Invalid Token");
  }
  const user = await User.findOne({_id: userToken.userId});
  user.status = "Active";

  await user.save();
  res.status(200).json({message: "Account successfully verified, please login"});
});

exports.viewStudents = asyncHandler(async(req, res, next) => {
    const students = await User.find({role: "Student"}).sort("-createdAt");
    if(students){
        res.status(200).json({students});
    }else{
        res.status(404);
        throw new Error("Record not found");
    }
});

exports.updateStudentStatus = asyncHandler(async(req, res, next) => {
    const {studentId} = req.params;
    const student = await User.findById({_id: studentId});
    if(!student){
        res.status(400);
        throw new Error("Student not identified")
    }
    let status = student.status;
    if(status === "Active"){
        student.status = "Inactive";
    }else{
        student.status = "Active";
    }
     const modifyStudent = await student.save();
    if(modifyStudent){
        res.status(200).json({message: "Status Successfully modified"});
    }else{
        res.status(500);
        throw new Error("Sorry, an error occured, try again later");
    }

    
});
exports.updateProductStatus = asyncHandler(async(req, res, next) => {
    const {url} = req.params;
    const product = await Product.findOne({url: url});
    if(!product){
        res.status(400);
        throw new Error("Product not identified")
    }
    let status = product.status;
    if(status === "Active"){
        product.status = "Inactive";
    }else{
        product.status = "Active";
    }
     const modifyProduct = await product.save();
    if(modifyProduct){
        res.status(200).json({message: "Status Successfully modified"});
    }else{
        res.status(500);
        throw new Error("Sorry, an error occured, try again later");
    }

    
});



exports.deleteStudent = asyncHandler(async(req, res, next) => {
    const {studentId} = req.params;
    const student = await User.findById({_id: studentId});
    if(!student){
        res.status(400);
        throw new Error("Student not identified");
    }
    const removeStudent = student.deleteOne();
    if(removeStudent){
        res.status(200).json({message: "Student successfully deleted"});
    }else{
        res.status(500);
        throw new Error("Sorry, an error occured, try again later");
    }
});

exports.viewSignleStudent = asyncHandler(async(req, res, next) => {
    const {studentId} = req.params;
    const student = await User.findOne({_id: studentId, role: "Student"});
    if(student){
        res.status(200).json({student});
    }else{
        res.status(400);
        throw new Error("Student not found");
    }
});

exports.viewLecturers = asyncHandler(async(req, res, next) => {
const lecturers = await User.find({role: "Lecturer"}).sort("-createdAt");
if(lecturers){
    res.status(200).json({lecturers});
}else{
    res.status(500);
    throw new Error("Record not found");
}
});

exports.updateLecturerStatus = asyncHandler(async(req, res, next) => {
    const {lecturerId} = req.params;
    const lecturer = await User.findById({_id: lecturerId});
    if(!lecturer){
        res.status(400);
        throw new Error("Lecturer not found");
    }
    let status = lecturer.status;
    if(status === 'Active'){
        lecturer.status = "Inactive";
    }else{
        lecturer.status = "Active";
    }
    const saveLecturer = await lecturer.save();
    if(saveLecturer){
        res.status(200).json({message: "Status Successfully Modified"});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again later");
    }
});

exports.deleteLecturer = asyncHandler(async(req, res, next) => {
    const {lecturerId} = req.params;
    const lecturer = await User.findById({_id: lecturerId});
    if(!lecturer){
        res.status(400);
        throw new Error("Lecturer not found");
    }
    const removeLecturer = await lecturer.deleteOne();
    if(removeLecturer){
        res.status(200).json({message: "Lecturer Successfully Deleted"});
    }else{
        res.status(500);
        throw new Error("An error occured, please try again later");
    }
});

exports.viewSignleLecturer = asyncHandler(async(req, res, next) => {
    const {lecturerId} = req.params;
    const lecturer = await User.findOne({_id: lecturerId, role: "Lecturer"});
    if(lecturer){
        res.status(200).json({lecturer});
    }else{
        res.status(400);
        throw new Error("Lecturer not found");
    }
    

});
//admin view orders
exports.getOrders = asyncHandler(async(req, res, next) => {
    const orders = await Order.find().populate("userId").populate("author").populate("productId").sort("-createdAt");
    if(orders){
        res.status(200).json({orders});
    }else{
        res.status(400);
        throw new Error("Order not found");
    }
    
    });
    
    exports.getOrder = asyncHandler(async(req, res, next) => {
        const {orderId} = req.params;
        if(!orderId){
            res.status(400);
            throw new Error("Order not found");
        }
        const order = await Order.findOne({_id: orderId});
        if(order){
            res.status(200).json({order});
            
        }else{
            res.status(400);
            throw new Error("Order not found");
        }
        
    });

    exports.viewTransactions = asyncHandler(async(req, res, next) => {
        const transactions = await Transaction.find().populate("userId").populate("authorId").sort("-createdAt");
        if(transactions){
            res.status(200).json(transactions);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });
    
    exports.viewWithdrawals = asyncHandler(async(req, res, next) => {
        const withdraws = await Withdraw.find().populate("userId").sort("-createdAt");
        if(withdraws){
            res.status(200).json(withdraws);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });

    exports.viewUserTransactions = asyncHandler(async(req, res, next) => {
        const {userId} = req.params;
        const transactions = await Transaction.find({userId: userId});
        if(transactions){
            res.status(200).json(transactions);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });
    

    
    exports.viewStudentOrders = asyncHandler(async(req, res, next) => {
        const {userId} = req.params;
        const orders = await Order.find({userId: userId});
        if(orders){
            res.status(200).json(orders);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });
    

    exports.viewLecturerOrders = asyncHandler(async(req, res, next) => {
        const {userId} = req.params;
        const orders = await Order.find({author: userId});
        if(orders){
            res.status(200).json(orders);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });
    //general receipt
    
    exports.viewGeneralReceipt = asyncHandler(async(req, res, next) => {
        const {transactionCode} = req.params;
        const transaction = await Transaction.findOne({transactionCode}).populate('userId').populate('productId');
        if(!transaction){
            res.status(400);
            throw new Error("Invalid Transaction Code");    
        }else{
            res.status(200).json({transaction});
            
        }
    });
    

    //get admin dashboard data
    exports.adminAccountData = asyncHandler(async(req, res, next) => {
        //get total sum order
        const sumOrder = await Transaction.aggregate(
            [
                {$match: {status: "Successful"}},
                {$group: {_id: null, amount: {$sum: "$amount"}}}
            ],
        )
            //get total funds withdrawn
            const fundsWithdrawn = await Withdraw.aggregate(
                [
                    {$match: {status: "Successful"}},
                    {$group: {_id: null, amount: {$sum: "$amount"}}}
                ]
            )
            //get total balance 
            const totalBalance = await User.aggregate(
                [
                    {$match: {}},
                    {$group: {_id: null, balance: {$sum: "$balance"}}}
                ]
            )
            //count products
            const totalProducts = await Product.estimatedDocumentCount();

            //count total lecturers
            const lecturers  = {role: "Lecturer"};
            const totalLecturers = await User.countDocuments(lecturers);
            const students = {role: "Student"};
            const totalStudents = await User.countDocuments(students);


        if(sumOrder){
            return res.status(200).json({sumOrder, fundsWithdrawn, totalBalance, totalProducts, totalLecturers, totalStudents});
        }
            res.status(400);
            throw new Error("An error occured, please try again later");
        
    });