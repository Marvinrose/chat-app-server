// const sgMail = require("@sendgrid/mail");

// const dotenv = require("dotenv");

// dotenv.config({ path: "../config.env" });

// sgMail.setApiKey(process.env.SG_KEY);

// const sendSgMail = async ({
//   recipient,
//   sender,
//   subject,
//   content,
//   html,
//   text,
//   attachments,
// }) => {
//   try {
//     const from = sender || "rozzeymarvin32@gmail.com";

//     const msg = {
//       to: recipient, // email of recipient
//       from: from, // this would be our verified sender
//       subject,
//       html: html,
//       text: text,
//       attachments,
//     };
//     return sgMail.send(msg);
//   } catch (error) {
//     console.log(error);
//   }
// };

// exports.sendEmail = async (args) => {
//   if (process.env.NODE_ENV === "development") {
//     return new Promise.resolve();
//   } else {
//     return sendSgMail(args);
//   }
// };
