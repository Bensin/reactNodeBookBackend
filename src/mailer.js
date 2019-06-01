import nodemailer from 'nodemailer';

const from ='"Bensin"<info@admintest.com>';

function setup(){

     return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
}

export function sendConfirmationMail(user) {
    const transport = setup();
    const email ={
        from,
        to:user.email,
        subject:"Weolcome to book",
        text:`
            please confirm your mail.
            ${user.generateConfirmationUrl()}

        `
    };

    transport.sendMail(email);
};

export function sendRestPasswordMail(user){
    const transport = setup();
    const email ={
        from,
        to:user.email,
        subject:"Password rest mail",
        text:`
            please click the link.
            ${user.generateResetPasswordLink()}

        `
    };

    transport.sendMail(email);   
}

