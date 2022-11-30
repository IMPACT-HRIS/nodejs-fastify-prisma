// Load the AWS SDK for Node.js
import nodemailer from 'nodemailer'
import { ENV_SENDER_EMAIL, ENV_SENDER_PASSWORD } from '~/config/env'

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: ENV_SENDER_EMAIL,
    pass: ENV_SENDER_PASSWORD,
  },
})

type SendNodeMailerEmailProps = {
  to: string
  from: string
  subject: string
  html: string
  onCompleted: (args: any) => void
  onFailed: (args: any) => void
}

const sendNodeMailerEmail = async ({
  to,
  from,
  subject,
  html,
  onCompleted = (arg: any) => {},
  onFailed = (arg: any) => {},
}: SendNodeMailerEmailProps) => {
  const mailOptions = {
    from: ENV_SENDER_EMAIL ?? from,
    to,
    subject,
    html,
  }

  await transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error)
      onFailed(error)
    } else {
      console.log('Email sent: ' + info.response)
      onCompleted(info)
    }
  })
}

export default sendNodeMailerEmail
