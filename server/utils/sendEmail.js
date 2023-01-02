import nodemailer from "nodemailer"
import { keys } from "../env.js"

export const sendEmail=options=>{
    const transporter=nodemailer.createTransport({
        service:keys.EMAIL_SERVICE,
        auth:{
            user:keys.EMAIL_USERNAME,
            pass:keys.EMAIL_PASSWORD
        }
    });

    const mailOptions={
        from:keys.EMAIL_FROM,
        to:options.to,
        subject:options.subject,
        html:options.text
    }

    transporter.sendMail(mailOptions,(err,info)=>{
        if(err) console.log(err);
        if(info) console.log(info);
    })
}