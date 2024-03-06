const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SG_KEY);

const sendSgMail = async ({
  recipient,
  sender,
  subject,
  content,
  attachments,
}) => {
  try {
    const from = sender || "rozzeymarvin32@gmail.com";

    const msg = {
      to: recipient, // email of recipient
      from: from, // this would be our verified sender
      subject,
    };
  } catch (error) {
    console.log(error);
  }
};
