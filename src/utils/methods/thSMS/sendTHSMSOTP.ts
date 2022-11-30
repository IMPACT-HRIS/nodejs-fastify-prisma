import axios from 'axios'
import { ENV_TH_SMS_API_KEY, ENV_TH_SMS_API_URL } from '~/config/env'

export const sendTHSMSOTP = async ({ phoneNumber, code, ref }: { phoneNumber: string; code: string; ref: string }) => {
  try {
    await axios.post(
      `${ENV_TH_SMS_API_URL}/send-sms`,
      {
        sender: 'SMSOTP',
        msisdn: [phoneNumber],
        message: `HRIM: Your OTP is ${code} (ref.${ref}) hriz-quiz`,
      },
      {
        headers: { Authorization: `Bearer ${ENV_TH_SMS_API_KEY}` },
      },
    )
  } catch (err) {
    throw err
  }
}
