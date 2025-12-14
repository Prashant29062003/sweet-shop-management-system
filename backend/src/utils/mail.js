// options => {mailgenContent, email, subject}
const sendEmail = async function (options) {
  // Skip initializing Mailgen or nodemailer during tests to avoid loading
  // their dependencies (and to prevent sending emails while testing).
  if (process.env.NODE_ENV === "test") return;

  const MailgenMod = await import("mailgen");
  const Mailgen = MailgenMod && MailgenMod.default ? MailgenMod.default : MailgenMod;
  const nodemailerMod = await import("nodemailer");
  const nodemailer = nodemailerMod && nodemailerMod.default ? nodemailerMod.default : nodemailerMod;

  const mailGenerator = new Mailgen({
    theme: "default",
    product: {
      name: "task manager",
      link: "hhtps://taskmaangerlink.com",
    },
  });

  const emailTextual = mailGenerator.generatePlaintext(options.mailgenContent);
  const emailHtml = mailGenerator.generate(options.mailgenContent);

  const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_SMPT_HOST,
    port: process.env.MAILTRAP_SMPT_PORT,
    auth: {
      user: process.env.MAILTRAP_SMPT_USER,
      pass: process.env.MAILTRAP_SMPT_PASS,
    },
  });

  const mail = {
    from: "mail.taskmanager.com",
    to: options.email,
    subject: options.subject,
    text: emailTextual,
    html: emailHtml,
  };

  try {
    await transporter.sendMail(mail);
  } catch (error) {
    console.error(
      "Email service failed silently. Make sure that you have provided your MAILTRAP credentials in the .env file.",
    );
    console.error("Error: ", error);
  }
};

const emailVerificationMailgenContent = (username, verficationUrl) => {
  return {
    body: {
      name: username,
      intro: "Welcome to our App! we are excited to have you on board.",
      action: {
        instruction:
          "To verify your email please click on the following button",
        button: {
          color: "#1aae5aff",
          text: "Verify your email",
          link: verficationUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this emial, we'd love to help.",
    },
  };
};

const forgotPasswordMailgenContent = (username, passwordResetUrl) => {
  return {
    body: {
      name: username,
      intro: "We got a request to reset the password of you account.",
      action: {
        instruction:
          "To reset your password please click on the following button or link",
        button: {
          color: "#89e2b0ff",
          text: "Reset password",
          link: passwordResetUrl,
        },
      },
      outro:
        "Need help, or have questions? Just reply to this emial, we'd love to help. | Sign in",
    },
  };
};

export {
  emailVerificationMailgenContent,
  forgotPasswordMailgenContent,
  sendEmail,
};
