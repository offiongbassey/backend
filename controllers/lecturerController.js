const asyncHandler = require("express-async-handler");
const Transaction = require("../models/transactionModel");
const User = require("../models/userModel");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');
const crypto = require("crypto");
const { sendEmail } = require('../utils/sendEmail');
const RegisterToken = require("../models/registerToken");
const PinToken = require("../models/withdrawalToken");
const Order = require("../models/orderModel");
const Withdraw = require("../models/withDrawalModel");
const Bank = require("../models/bankModel");

exports.updateLecturerProfile = asyncHandler(async(req, res, next) => {
const {firstName, lastName, otherName, photo, phone, bio, address, accountNumber, accountName, bank } = req.body;

const user = await User.findById({_id: req.user._id});
user.firstName = firstName;
user.lastName = lastName;
user.otherName = otherName;
user.photo = photo || user.photo;
user.phone = phone;
user.bio = bio || user.bio;
user.updateStatus = "Updated";
user.address = address || user.address;
user.accountNumber = accountNumber;
user.accountName = accountName;
user.bank = bank;

const saveUser = await user.save();
if(saveUser){
    res.status(200).json({
        _id: saveUser._id,
        firstName: saveUser.firstName,
        lastName: saveUser.lastName,
        otherName: saveUser.otherName,
        photo: saveUser.photo,
        phone: saveUser.phone,
        bio: saveUser.bio,
        address: saveUser.address,
        accountNumber: saveUser.accountNumber,
        accountName: saveUser.accountName,
        bank: saveUser.bank,
    });
}else{
    res.status(500);
    throw new Error("An error occured, please try again later");
}
});

exports.registerLecturer = asyncHandler(async (req, res) => {
    const {firstName, lastName, email, password, confirmPassword} = req.body;
    //validation
    if(!firstName || !lastName || !email || !password || !confirmPassword){
        res.status(400);
        throw new Error("Please fill in all fields");
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
         password,
         role: "Lecturer"
     });
 
     //generate Token 
     // const Token = generateToken(user._id);
     //send HTTP-only cookie
     // res.cookie("Token", Token, {
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
 
         //save Token to database
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

 exports.resetWithdrawalPin = asyncHandler(async(req, res, next) => {
    let token = crypto.randomBytes(32).toString("hex") + req.user._id;
    const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

    await PinToken.create({
        userId: req.user._id,
        token: hashedToken,
        createdAt: Date.now(),
        expiresAt: Date.now() + 30 * (60 * 100) //30 minutes
    });

    const resultUrl = `${process.env.FRONTEND_URL}/reset-pin/${token}`;

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
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Hi ${req.user.firstName},</strong></span></p>
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
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">We received a request that you want to change your Wallet PIN, click on the link below to change your PIN. <br/> 
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
<a href="${resultUrl}" clicktracking=off>${resultUrl}</a>
<br/>
<a href="${resultUrl}" clicktracking=off> 
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
const subject = "Wallet PIN Reset";
const send_to = req.user.email;

try {
    await sendEmail(subject, message, send_to);
    res.status(200).json({success: true, message: "PIN Reset mail successfully sent."});
} catch (error) {
    res.status(500);
    throw new Error("Email not sent, please try again.");
}
 });

 exports.changeWalletPin = asyncHandler(async(req, res, next) => {
     const {token} = req.params;
     const {walletPin, confirmWalletPin} = req.body;
     if(!walletPin || !confirmWalletPin){
         res.status(400);
         throw new Error("Please Provide Wallet Pin");
     }
     if(walletPin !== confirmWalletPin){
         res.status(400);
         throw new Error("Wallet Pins do not match");
     }
     const hashedToken = crypto
     .createHash("sha256")
     .update(token)
     .digest("hex");

     const pinToken = await PinToken.findOne({
         token: hashedToken,
         expiresAt: {$gt: Date.now()}
     });
     if(!pinToken){
         res.status(400);
         throw new Error("Invalid or expired Token");
     }
     //hash the pin
     const salt = await bcrypt.genSalt(10);
     const hashedPin = await bcrypt.hash(walletPin, salt);

     const user = await User.findById({_id: req.user._id});
     user.walletPin = hashedPin;

     const savePin = await user.save();
     if(savePin){
         res.status(200).json({message: "Pin successfully changed"});
     }else{
         res.status(500);
         throw new Error("Sorry, an error occured, please try again later");
     }


 });

 
exports.lecturerOrders = asyncHandler(async(req, res, next) => {
    const orders = await Order.find({author: req.user._id}).populate('productId').populate('userId').sort("-createdAt");
    if(orders){
        res.status(200).json({orders});
    }else{
        res.status(400);
        throw new Error("Order not found");
    }
    
    });
    
    exports.lecturerOrder = asyncHandler(async(req, res, next) => {
        const {orderId} = req.params;
        if(!orderId){
            res.status(400);
            throw new Error("Order not found");
        }
        const order = await Order.findOne({_id: orderId});
        if(!order){
            res.status(400);
            throw new Error("Order not found");
        }
        if(order.author.toString() === req.user._id.toString()){
            res.status(200).json({order});
        }else{
            res.status(400);
            throw new Error("User not authorized");
        }
    });
    exports.sumLecturerOrder = asyncHandler(async(req, res, next) => {
        const sumOrder = await Transaction.aggregate(
            [
                {$match: {authorId: req.user._id}},
                {$group: {_id: null, amount: {$sum: "$amount"}}}
            ],
        )

        //get total funds withdrawn
        const fundsWithdrawn = await Withdraw.aggregate(
            [
                {$match: {userId: req.user._id, status: "Successful"}},
                {$group: {_id: null, amount: {$sum: "$amount"}}}
            ]
        )
        //get total balance 
        const totalBalance = await User.aggregate(
            [
                {$match: {_id: req.user._id}},
                {$group: {_id: null, balance: {$sum: "$balance"}}}
            ]
        )
        if(sumOrder){
            return res.status(200).json({sumOrder, fundsWithdrawn, totalBalance});
        }
            res.status(400);
            throw new Error("An error occured, please try again later");
        
    });

    exports.lecturerTransaction = asyncHandler(async(req, res, next) => {
        const transactions = await Transaction.find({authorId: req.user._id}).populate('userId').sort('-createdAt');
        if(transactions){
            res.status(200).json(transactions);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });

    exports.lecturerWithdraws = asyncHandler(async(req, res, next) => {
        const withdraw = await Withdraw.find({userId: req.user._id}).sort('-createdAt');
        if(withdraw){
            res.status(200).json(withdraw);
        }else{
            res.status(400);
            throw new Error("No Record Found");
        }
    });
//paystack withdraw documentation
    exports.withdrawFunds = asyncHandler(async(request, response, next) => {
        const https = require('https');

        const {amount, pin} = request.body;
        transactionCode = Math.floor(100000000000 + Math.random() * 9765431234567);
        if(!request.user.walletPin){
            response.status(400);
            throw new Error("Please Create a withdrawal Pin");
        }
        if(!amount){
            response.status(400);
            throw new Error("Please provide amount");
        }
        if(!pin){
            response.status(400);
            throw new Error("Please provide Pin");
        }
        //verify pin
        const checkPassword = await bcrypt.compare(pin, request.user.walletPin);
        if(!checkPassword){
            response.status(400);
            throw new Error("Incorrect PIN");
        }


        if(amount > request.user.balance){
            response.status(400);
            throw new Error("Insufficient Funds");
        }

const params = JSON.stringify({

  "source": "balance",

  "amount": amount * 100,

  "reference": transactionCode,

  "recipient": request.user.bankRecipientCode,

  "reason": "Wallet Withdrawal"

})


const options = {

  hostname: 'api.paystack.co',

  port: 443,

  path: '/transfer',

  method: 'POST',

  headers: {

    Authorization:  process.env.PAYSTACK_LIVE_KEY,

    'Content-Type': 'application/json'

  }

}
const req = https.request(options, res => {
  let data = ''
  res.on('data', (chunk) => {
    data += chunk
  });
  res.on('end', () => {
    // console.log(JSON.parse(data))
    const newData = JSON.parse(data);
  if(newData.status === true){
    const userId = request.user._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");
    const userBalance = request.user.balance;
    const userFirstName = request.user.firstName;
    const userLastName = request.user.lastName;
    const userEmail = request.user.email;
    approveWithdraw(userId, amount, userBalance, transactionCode, userFirstName, userLastName, userEmail);
}
response.status(200).json(newData);
  })
  
}).on('error', error => {
  console.error(error)
})
req.write(params)
req.end()
// response.status(201).json({message: "Transaction Successful"});
    });

     const approveWithdraw = asyncHandler(async(userId, amount, userBalance, transactionCode, userFirstName, userLastName, userEmail) => {
        
        const newBalance = userBalance - amount;
        const withdraw = await Withdraw.create({
            userId: userId,
            amount:  amount,
            currentBal: newBalance,
            type: "Credit",
            purpose: "Withdraw",
            status: "Successful",
            transactionCode
        });
        
        const currentUser = await User.findById({_id: userId});
        currentUser.balance = userBalance - amount;
        
        const updateBalance = await currentUser.save();
        //send withdrawal mail
        const currentBalance = updateBalance.balance;
        const resultUrl = `${process.env.FRONTEND_URL}/withdraw`;

    //send mail to author
let message = `
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
<img src="https://res.cloudinary.com/dfhabqprq/image/upload/v1684559158/schoolstore/success_l1xuqj.png" style="width: 600px; text-align: center;" />
<div class="" style="font-size: 12px; font-family: Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif; mso-line-height-alt: 14.399999999999999px; color: #555555; line-height: 1.2;">
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Transaction Successful</strong></span></p>
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
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">Dear ${userFirstName + ' ' + userLastName}, you have successfully withdrawn ₦${amount.toLocaleString(undefined, {maximumFactorDigits: 2})} from your account.
</span></p>
<br/>
<p style="margin: 0; font-size: 14px;">Current Balance: ₦${currentBalance.toLocaleString()}<br/>
</p>
<p>Best Regards!</p>
</div>
</div>
</td>
</tr>
</table>
<table border="0" cellpadding="0" cellspacing="0" class="button_block block-6" role="presentation" style="mso-table-lspace: 0pt; mso-table-rspace: 0pt;" width="100%">
<tr>
<td class="pad" style="padding-left:10px;padding-right:10px;padding-top:15px;text-align:center;">
<div align="center" class="alignment"><!--[if mso]><v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" style="height:62px;width:203px;v-text-anchor:middle;" arcsize="97%" stroke="false" fillcolor="#1aa19c"><w:anchorlock/><v:textbox inset="0px,0px,0px,0px"><center style="color:#ffffff; font-family:Tahoma, sans-serif; font-size:16px"><![endif]-->
<br/>
<a href="${resultUrl}" clicktracking=off> 
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>View More</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
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
let subject = `Transaction Successful : ${transactionCode}`;
let send_to = userEmail;

await sendEmail(subject, message, send_to);

    });

    exports.lecturerViewStudent = asyncHandler(async(req, res, next) => {
        const {userId} = req.params;
        if(!userId){
            res.status(400);
            throw new Error("Invalid Student ID");
        }
        const student = await User.findOne({_id: userId, role: "Student"});
        if(student){
            res.status(200).json({student});
            
        }else{
            res.status(400);
            throw new Error("Student not found");
        }
    });

    exports.verifyBankInfo = asyncHandler(async(req, response, next) => {
        const {type, account_number, bank, currency} = req.body;
        
        if(!account_number){
            response.status(400);
            throw new Error("Account Number is required");
        }
        if(!bank){
            response.status(400);
            throw new Error("Please Select a Bank");
        }
        const userBank = await Bank.findById({_id: bank});
        if(!userBank){
            response.status(400);
            throw new Error("Invalid Bank");
        }
        const bank_code = userBank.code;


        const https = require('https')

const params = JSON.stringify({
  "type": type,
  "name": "",
  "account_number": account_number,
  "bank_code": bank_code,
  "currency": currency
})
const options = {
  hostname: 'api.paystack.co',
  port: 443,
  path: '/transferrecipient',
  method: 'POST',
  headers: {
    Authorization: process.env.PAYSTACK_LIVE_KEY,
    'Content-Type': 'application/json'
  }
}
const reqs = https.request(options, res => {
 let data = ''
  res.on('data', (chunk) => {
    data += chunk
  });
  res.on('end', () => {
    console.log(JSON.parse(data));
    const newData = JSON.parse(data);
    if(newData.status === true){
        const userId = req.user._id.toString().replace(/ObjectId\("(.*)"\)/, "$1");;

        // console.log(userId);
        newAccountNumber = newData.data.details.account_number;
        newAccountName = newData.data.details.account_name;
        newBankName =  newData.data.details.bank_name;
        newBankId = bank;
        newBankVerificationId = newData.data.id;
        newBankRecipientCode = newData.data.recipient_code;
        newBankCode = bank_code
        
        updateLecturerBankInfo(newAccountName, userId, newAccountNumber, newBankName, newBankId, newBankRecipientCode, newBankCode);
    }
    response.status(200).json(newData);
  })
}).on('error', error => {
    response = (error);
  console.error(error)
  response.status(500);
    throw new Error(`An Error occured, try again later. Err${error}`);
})
reqs.write(params)
reqs.end()
    });
    const updateLecturerBankInfo = asyncHandler(async(newAccountName, userId, newAccountNumber, newBankName, newBankId, newBankRecipientCode, newBankCode) => {
         // update user profile
         const user = await User.findById({_id: userId});
         user.accountNumber = newAccountNumber;
         user.accountName = newAccountName;
         user.bank = newBankName;
         user.bankId = newBankId;
         user.bankStatus = "Active";
         user.bankRecipientCode = newBankRecipientCode;
         user.bankCode = newBankCode;
 
     const saveUser = await user.save();
   
    })

    var secret = process.env.PAYSTACK_LIVE_KEY;
    exports.transferWebhook = asyncHandler(async(req, res) => {
    // Using Express
    //validate event

    const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(req.body)).digest('hex');
    if (hash == req.headers['x-paystack-signature']) {
    // Retrieve the request's body
    const event = req.body;
    const data = req.body;
    const reference = data.reference;

    // Do something with event  
        console.log(event);
        //get reference from withdraw
        // const withdraw = await Withdraw.findOne({transactionCode: reference});
        // if(!withdraw){
        //     res.status(500);
        //     throw new Error("Transaction code not found");
        // }
        // if(event === "transfer.success"){
        // withdraw.status = 'Verified';
        // await withdraw.save();
        // return res.send(200).json(`Transfer webhook success. ${reference}`);
        // }else if(event === "transfer.failed"){
        //     return res.send(200).json(`Withdrawal Failed. ${reference}`);
        // }else if (event === "transfer.reversed"){
        //     return res.send(200).json(`Withdrawal Reversed. ${reference}`);
        // }

    }else{
        res.send("Something went wrong");
        console.log("Something went wrong");
    }
    

    });