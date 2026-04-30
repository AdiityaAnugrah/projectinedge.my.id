import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
const FROM = process.env.SMTP_FROM || 'noreply@projectinedge.my.id';

export async function sendVerificationEmail(email: string, username: string, token: string) {
  const verifyUrl = `${APP_URL}/verify-email/${token}`;

  await transporter.sendMail({
    from: `"Pembuat Invoice" <${FROM}>`,
    to: email,
    subject: 'Verifikasi Email Akun Anda',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto; padding: 24px;">
        <h2 style="color: #e07830;">🧾 Pembuat Invoice</h2>
        <p>Halo <b>${username}</b>,</p>
        <p>Terima kasih telah mendaftar. Klik tombol di bawah untuk memverifikasi email Anda:</p>
        <div style="text-align: center; margin: 32px 0;">
          <a href="${verifyUrl}"
            style="background: #e07830; color: #fff; padding: 12px 28px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 1rem;">
            Verifikasi Email
          </a>
        </div>
        <p style="color: #999; font-size: 0.85rem;">Link berlaku selama 24 jam. Jika Anda tidak mendaftar, abaikan email ini.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
        <p style="color: #aaa; font-size: 0.8rem;">Link: ${verifyUrl}</p>
      </div>
    `,
  });
}
