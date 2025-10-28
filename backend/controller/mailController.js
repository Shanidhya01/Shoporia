import nodemailer from "nodemailer";

// Basic CRLF/header-injection guard and HTML escaping
const stripCRLF = (s) => String(s || "").replace(/[\r\n]+/g, " ").trim();
const escapeHtml = (s) =>
  String(s || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const isValidEmail = (e) => /[^\s@]+@[^\s@]+\.[^\s@]+/.test(String(e || "").toLowerCase());

export const sendContactMail = async (req, res) => {
  try {
    // Support both host/port and nodemailer service config to be compatible with existing envs
    const hasHostSet = !!(process.env.SMTP_HOST && process.env.SMTP_PORT && process.env.SMTP_USER && process.env.SMTP_PASS);
    const hasServiceSet = !!(process.env.SMTP_SERVICE && process.env.SMTP_MAIL && (process.env.SMTP_PASSWORD || process.env.SMTP_PASS));

    if (!process.env.SMTP_MAIL) {
      return res.status(500).json({ success: false, error: "Server misconfigured: missing SMTP_MAIL" });
    }
    if (!hasHostSet && !hasServiceSet) {
      return res.status(500).json({ success: false, error: "Server misconfigured: missing SMTP credentials" });
    }

    // Extract and sanitize input
    const rawName = req.body?.name;
    const rawEmail = req.body?.email;
    const rawSubject = req.body?.subject;
    const rawMessage = req.body?.message;

    const name = stripCRLF(rawName);
    const email = stripCRLF(rawEmail);
    const subject = stripCRLF(rawSubject);
    const message = String(rawMessage || "").trim();

    if (!name || !email || !subject || !message) {
      return res.status(400).json({ success: false, error: "All fields are required." });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ success: false, error: "Invalid email." });
    }
    if (name.length > 120 || subject.length > 200 || message.length > 5000) {
      return res.status(400).json({ success: false, error: "Input too long." });
    }

    const transporter = hasHostSet
      ? nodemailer.createTransport({
          host: process.env.SMTP_HOST,
          port: Number(process.env.SMTP_PORT),
          secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false otherwise
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        })
      : nodemailer.createTransport({
          service: process.env.SMTP_SERVICE,
          auth: {
            user: process.env.SMTP_MAIL,
            pass: process.env.SMTP_PASSWORD || process.env.SMTP_PASS,
          },
        });

    const html = `
      <div style="font-family:Segoe UI,Roboto,Arial,sans-serif;line-height:1.6;color:#222">
        <h2>New Contact Message</h2>
        <p><strong>Name:</strong> ${escapeHtml(name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email)}</p>
        <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
        <hr />
        <p style="white-space:pre-wrap">${escapeHtml(message)}</p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `${name} <${email}>`, // header From (may be rewritten by provider)
      to: process.env.SMTP_MAIL,   // forced admin recipient
      subject,
      html,
      replyTo: `${name} <${email}>`,
      envelope: {
        from: process.env.SMTP_USER, // actual MAIL FROM to avoid open relay/SPF/DMARC issues
        to: process.env.SMTP_MAIL,
      },
    });

    return res.status(200).json({ success: true, id: info.messageId });
  } catch (err) {
    console.error("sendContactMail error:", err?.message || err);
    return res.status(500).json({ success: false, error: "Failed to send email." });
  }
};
