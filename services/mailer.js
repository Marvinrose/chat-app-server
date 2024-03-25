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

// const mailgun = require("mailgun-");

// const dotenv = require("dotenv");
// dotenv.config({ path: "../config.env" });
// const DOMAIN = "sandbox56b130120c744fa496a9979ed9be8e22.mailgun.org";
// const mg = mailgun({ apiKey: process.env.ML_KEY, domain: DOMAIN });
// const data = {
//   from: "rozzeymarvin32@gmail.com",
//   to: "mavinrose@flexisaf.com",
//   subject: "Hello",
//   text: "Testing some Mailgun awesomness!",
// };
// mg.messages().send(data, function (error, body) {
//   if (error) {
//     console.error("Error sending email:", error);
//   } else {
//     console.log("Email sent:", body);
//   }
// });
// mg.messages().send(data, function (error, body) {
//   console.log(body);
// });

// const mailgun = require("mailgun-js");
// const dotenv = require("dotenv");
// dotenv.config({ path: "../config.env" });

// const DOMAIN = "chat-app-server-rpwp.onrende.com";

// const sendMailgunEmail = async (data) => {
//   const mg = mailgun({
//     apiKey: process.env.ML_KEY,
//     domain: DOMAIN,
//   });

//   return new Promise((resolve, reject) => {
//     mg.messages().send(data, function (error, body) {
//       if (error) {
//         console.error("Error sending email:", error);
//         reject(error);
//       } else {
//         console.log("Email sent:", body);
//         resolve(body);
//       }
//     });
//   });
// };

// module.exports.sendMailgunEmail = sendMailgunEmail;

// const dotenv = require("dotenv");
// dotenv.config({ path: "../config.env" });
// const mailchimpTx = require("@mailchimp/mailchimp_transactional")(
//   "48b8a3d83566e2f817a3f64e17f13bec-us18"
// );

// async function run() {
// //   const response = await mailchimpTx.users.ping();
//   console.log("Connect");
// }

// run();

// const axios = require("axios");
// const dotenv = require("dotenv");

// dotenv.config({ path: "../config.env" });

// const apiKey = process.env.MC_KEY || "48b8a3d83566e2f817a3f64e17f13bec-us18"; // Set your Mailchimp Transactional API key here

// console.log(apiKey, "API");

// async function sendMailchimpEmail({
//   recipient,
//   sender,
//   subject,
//   html,
//   text,
//   attachments,
// }) {
//   try {
//     const response = await axios.post(
//       "https://mandrillapp.com/api/1.0/messages/send.json",
//       {
//         key: apiKey,
//         message: {
//           from_email: sender || "rozzeymarvin32@gmail.com",
//           to: recipient,
//           subject,
//           html,
//           text,
//           attachments,
//         },
//       }
//     );

//     console.log("Mailchimp email sent successfully:", response.data);
//     return response.data;
//   } catch (error) {
//     console.error("Error sending Mailchimp email:", error.response.data);
//     throw error.response.data;
//   }
// }

// exports.sendEmail = async (args) => {
//   if (process.env.NODE_ENV === "development") {
//     return Promise.resolve();
//   } else {
//     return sendMailchimpEmail(args);
//   }
// };

