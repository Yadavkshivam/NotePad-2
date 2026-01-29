  import nodemailer from "nodemailer";

  const otpStore = new Map();

  function generateCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  export async function createAndSendOtp(email) {
    const code = generateCode();
    const expiresAt = Date.now() + 5 * 60 * 1000;
    otpStore.set(email, { code, expiresAt });

    console.log(`📧 OTP for ${email}: ${code} (valid 5 minutes)`);

    
    const testAccount = await nodemailer.createTestAccount();

    const transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    return code;
  }

  export function verifyOtp(email, code) {
    const record = otpStore.get(email);
    if (!record) return false;
    const isValid = record.code === code && Date.now() < record.expiresAt;
    if (isValid) otpStore.delete(email);
    return isValid;
  }
