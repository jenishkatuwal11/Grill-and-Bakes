// tests/emailService.test.js
const nodemailer = require("nodemailer");
const sendEmail = require("../utils/emailService");

jest.mock("nodemailer");

beforeAll(() => {
  jest.spyOn(console, "error").mockImplementation(() => {});
});

describe("Email Service", () => {
  let mockSendMail;

  beforeEach(() => {
    mockSendMail = jest.fn().mockResolvedValue("Email sent");
    nodemailer.createTransport.mockReturnValue({ sendMail: mockSendMail });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("should send email with correct parameters", async () => {
    const mockData = {
      to: "test@example.com",
      subject: "Test Email",
      text: "This is a test email.",
      html: "<p>This is a test email.</p>",
    };

    await sendEmail(
      mockData.to,
      mockData.subject,
      mockData.text,
      mockData.html
    );

    expect(mockSendMail).toHaveBeenCalledTimes(1);
    expect(mockSendMail).toHaveBeenCalledWith({
      from: process.env.EMAIL_USER,
      to: mockData.to,
      subject: mockData.subject,
      text: mockData.text,
      html: mockData.html,
    });
  });

  test("should throw error if sending fails", async () => {
    mockSendMail.mockRejectedValueOnce(new Error("SMTP error"));

    await expect(
      sendEmail("fail@example.com", "Fail", "fail", "<p>fail</p>")
    ).rejects.toThrow("SMTP error");
  });
});
