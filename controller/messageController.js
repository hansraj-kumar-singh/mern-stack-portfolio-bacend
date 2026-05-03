import { Message } from "../models/messageSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { sendEmail } from "../utils/sendEmail.js";

export const sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { senderName, subject, message } = req.body;
  if (!senderName || !subject || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }
  const data = await Message.create({ senderName, subject, message });

  // Send email notification
  const emailSubject = `New Message from ${senderName}: ${subject}`;
  const emailMessage = `
    You have received a new message from your portfolio website.

    Sender Name: ${senderName}
    Subject: ${subject}
    Message: ${message}

    Please check your dashboard for more details.
  `;

  try {
    await sendEmail({
      email: process.env.SMTP_EMAIL, // Send to admin's email
      subject: emailSubject,
      message: emailMessage,
    });
  } catch (emailError) {
    console.error("Email sending failed:", emailError);
    // Don't fail the request if email fails, just log it
  }

  res.status(201).json({
    success: true,
    message: "Message Sent",
    data,
  });
});


export const getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();
  res.status(200).json({
    success: true,
    messages,
  });
});


export const deleteMessage = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const message = await Message.findById(id);
  if (!message) {
    return next(new ErrorHandler("Message Not Found!", 404));
  } await message.deleteOne();
  res.status(200).json({
    success: true,
    message: "Message Deleted",
  });
});