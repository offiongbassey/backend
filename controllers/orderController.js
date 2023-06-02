const Order = require("../models/orderModel");
const User = require("../models/userModel");
const { sendEmail } = require('../utils/sendEmail');
const Transaction = require("../models/transactionModel");
const Product = require("../models/productModel");
const asyncHandler = require("express-async-handler");
const crypto = require("crypto");

exports.createOrder = asyncHandler(async(req, res, next) => {
const {productId} = req.body;


if(!productId){
    res.status(400);
    throw new Error("Invalid Product");
}
const product = await Product.findById({_id: productId});
if(!product){
    res.status(400);
    throw new Error("Product not found");
}
const userId = req.user._id;
const author = product.userId;
const productCode = product.productCode;
const orderCode =  Math.floor(987256152406 + Math.random() * 900000);
const amount = product.price;
const serviceCharge = 300;
const grandTotal = amount + serviceCharge; 
let transactionCode = Math.floor(167542189026 + Math.random() * 900000);

const order = await Order.create({
    userId,
    author,
    productId,
    productCode,
    orderCode,
    amount,
    serviceCharge,
    grandTotal,
    transactionCode
});
if(order){
    res.status(201).json({order: order});
}else{
    res.status(500);
    throw new Error("An error occured, please try again later");
}

});


exports.studentOrders = asyncHandler(async(req, res, next) => {
const orders = await Order.find({userId: req.user._id}).populate('productId').sort("-createdAt");
if(orders){
    res.status(200).json({orders});
}else{
    res.status(400);
    throw new Error("Order not found");
}

});
exports.studentTransactions = asyncHandler(async(req, res, next) => {
    const transactions = await Transaction.find({userId: req.user._id}).populate('userId').sort("-createdAt");
    if(transactions){
        res.status(200).json(transactions);
    }else{
        res.status(400);
        throw new Error("Order not found");
    }
    
    });

exports.studentOrder = asyncHandler(async(req, res, next) => {
    const {orderId} = req.params;
    if(!orderId){
        res.status(400);
        throw new Error("Order not found");
    }
    const order = await Order.findOne({_id: orderId}).populate('userId');
    if(!order){
        res.status(400);
        throw new Error("Order not found");
    }
    if(order.userId._id.toString() === req.user._id.toString()){
        res.status(200).json({order});
    }else{
        res.status(400);
        throw new Error("An Error occured, please try again later");
    }
    
});

exports.studentOrderPayment = asyncHandler(async(req, res, next) => {
    const {transactionCode} = req.params;
    const order = await Order.findOne({transactionCode});
   
    if(!order){
        res.status(400);
        throw new Error("Invalid Order Code");
    }
    if(order.status === "Approved"){
        res.status(400);
        throw new Error("Order already approved, you can print your receipt.");
    }
    const {author, userId, _id, amount, serviceCharge, grandTotal, productId } = order;
    const product = await Product.findOne({_id: productId});
    if(!product){
        res.status(400);
        throw new Error("Product unvailable. Contact Admin"); 
    }
    //update order status
    order.status = 'Successful';
    await order.save();
    const newQuantity = product.quantity - 1;
    //update product quantity
    product.quantity =    newQuantity;
    await product.save();

    
    // create transaction
    const studentTransaction = await Transaction.create({
        userId: req.user._id,
        authorId: author,
        orderId: _id,
        productId: productId,
        amount:  amount,
        serviceCharge: serviceCharge,
        grandTotal: grandTotal,
        type: "Order",
        purpose: "Order",
        status: "Successful",
        transactionCode
    });

    //get author email
    const getAuthor = await User.findById({_id: author});
    const authorEmail = getAuthor.email;
    const authorFirstName = getAuthor.firstName;
    const authorLastName = getAuthor.lastName;
    const oldBalance = getAuthor.balance;

    //update lecturer balance
    
    getAuthor.balance =  amount + oldBalance;
    await getAuthor.save();
    
    const resultUrl = `${process.env.FRONTEND_URL}/receipt/${transactionCode}`;

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
<p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>New Order</strong></span></p>
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
<p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">Dear ${authorFirstName + ' ' + authorLastName}, we are glad to inform you that you have a New Order from ${req.user.firstName + ' ' + req.user.lastName }.
</span></p>
<br/>
<p style="margin: 0; font-size: 14px;">Transaction Code: ${transactionCode} <br/>
Amount: ₦${amount.toLocaleString()}
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
<div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>View Receipt</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
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
let subject = `New Order from ${req.user.firstName + ' ' +req.user.lastName + ' : ' +transactionCode}`;
let send_to = authorEmail;

await sendEmail(subject, message, send_to);

//send mail to student



 
 message = `
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
 <p style="margin: 0; font-size: 16px; text-align: center; mso-line-height-alt: 19.2px;"><span style="font-size:30px;color:#2b303a;"><strong>Payment Successful</strong></span></p>
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
 <p style="margin: 0; font-size: 14px; text-align: center; mso-line-height-alt: 22.5px;"><span style="color:#808389;font-size:15px;">Dear ${req.user.firstName + ' ' + req.user.lastName}, we are glad to inform you that your payment was successful.
 </span></p>
 <br/>
 <p style="margin: 0; font-size: 14px;">Transaction Code: ${transactionCode} <br/>
 Amount: ₦${grandTotal.toLocaleString()}
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
 <div style="text-decoration:none;display:inline-block;color:#ffffff;background-color:#1aa19c;border-radius:60px;width:auto;border-top:0px solid transparent;font-weight:undefined;border-right:0px solid transparent;border-bottom:0px solid transparent;border-left:0px solid transparent;padding-top:15px;padding-bottom:15px;font-family:Montserrat, Trebuchet MS, Lucida Grande, Lucida Sans Unicode, Lucida Sans, Tahoma, sans-serif;font-size:16px;text-align:center;mso-border-alt:none;word-break:keep-all;"><span style="padding-left:30px;padding-right:30px;font-size:16px;display:inline-block;letter-spacing:normal;"><span style="margin: 0; word-break: break-word; line-height: 32px;"><strong>View Receipt</strong></span></span></div><!--[if mso]></center></v:textbox></v:roundrect><![endif]-->
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
  subject = `Payment Successful ${' : ' +transactionCode}`;
  send_to = req.user.email;
 
 await sendEmail(subject, message, send_to);

try {
    res.status(200).json({success: true, message: "Order Successfuly"});
} catch (error) {
    res.status(500);
    throw new Error("An error occured Please try again later.");
}
});

