import nodemailer from "nodemailer";

export const sendEmail = async (email: string, url: string) => {
  console.log("making mail");
  //   const account = await nodemailer.createTestAccount();

  // create reusable transporter object using the default SMTP transport
  //   const transporter = nodemailer.createTransport({
  //     host: "smtp.ethereal.email",
  //     port: 587,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: account.user, // generated ethereal user
  //       pass: account.pass // generated ethereal password
  //     }
  //   });

  const transporter = nodemailer.createTransport({
    jsonTransport: true
  });

  // setup email data with unicode symbols
  const mailOptions = {
    from: '"Fred Foo 👻" <foo@example.com>',
    to: email, // list of receivers
    subject: "Hello ✔", // Subject line
    text: `${url}`, // plain text body
    html: `<a href="${url}> ${url} </a>"` // html body
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    const parsedInfo = JSON.parse(info.message.toString());
    console.log({ msg: info.message });
    // tslint:disable
    console.log({ from: parsedInfo.from });
    console.log({ to: parsedInfo.to });
    console.log({ subject: parsedInfo.subject });
    console.log({ text: parsedInfo.text });
    console.log({ html: parsedInfo.html });
    // Preview only available when sending through an Ethereal account
    console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  } catch (e) {
    console.log({ e });
  }
};
