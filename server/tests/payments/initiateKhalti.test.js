const axios = require("axios");
const { initiateKhalti } = require("../../controllers/paymentController");

jest.mock("axios");

describe("Payment Controller - initiateKhalti", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        amount: 2000,
        return_url: "http://localhost:5173/verify-khalti",
      },
    };

    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should initiate Khalti payment and return payment URL and pidx", async () => {
    axios.post.mockResolvedValueOnce({
      data: {
        payment_url: "https://khalti.com/payment/xyz",
        pidx: "mocked-pidx",
      },
    });

    await initiateKhalti(req, res);

    expect(axios.post).toHaveBeenCalledWith(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      expect.objectContaining({
        return_url: req.body.return_url,
        website_url: "http://localhost:5173",
        amount: 2000,
      }),
      expect.any(Object)
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      payment_url: "https://khalti.com/payment/xyz",
      pidx: "mocked-pidx",
    });
  });

  it("should handle Khalti initiation failure", async () => {
    axios.post.mockRejectedValueOnce({
      response: { data: { message: "Invalid data" } },
    });

    await initiateKhalti(req, res);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      success: false,
      error: { message: "Invalid data" },
    });
  });
});
