const sendEmail = require("../utils/emailService");

const handleContactForm = async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const subject = `New Contact Form Submission from ${name}`;
    const text = `You received a new message:\n\nFrom: ${name} (${email})\n\nMessage:\n${message}`;
    const html = `
      <h3>New Contact Message</h3>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Message:</strong><br/>${message}</p>
    `;

    await sendEmail(process.env.EMAIL_USER, subject, text, html);
    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(" Email send error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
};

module.exports = { handleContactForm };
