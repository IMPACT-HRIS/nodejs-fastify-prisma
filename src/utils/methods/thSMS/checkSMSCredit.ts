import axios from 'axios'
import { ENV_TH_SMS_API_KEY, ENV_TH_SMS_API_URL } from '~/config/env'
import sendNodeMailerEmail from '~/utils/methods/email/sendNodeMailerEmail'

export const checkSMSCredit = async () => {
  const result = await axios.get(`${ENV_TH_SMS_API_URL}/me`, {
    headers: { Authorization: `Bearer ${ENV_TH_SMS_API_KEY}` },
  })
  const credit = result?.data?.data?.wallet?.credit
  if (credit && Number(credit) <= 500 && Number(credit) >= 495) {
    console.info('=== SEND BALANCE EMAIL')
    // send warning email
    await sendNodeMailerEmail({
      to: 'hris@hrim.one',
      from: 'kariz.matchaparn@gmail.com',
      subject: 'แจ้งเตือน TH SMS Balance ใกล้หมด',
      html: `<p>เรียนพี่มาร์ช</p><p>ตอนนี้ Balance เหลือ ${Number(
        credit,
      )} บาทแล้วครับ</p><p>รบกวนเพิ่มด้วยครับ</p><p>กราบขอบพระคุณครับ</p>`,
      onCompleted: () => {},
      onFailed: () => {},
    })
  }
  if (credit <= 0) return false
  return true
}
