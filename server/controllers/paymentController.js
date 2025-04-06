const axios = require("axios");
const Order = require("../models/Order");
const Items = require("../models/Items");

// Payment Verify & Place Order using pidx (Khalti E-Payment v2)
const verifyKhalti = async (req, res) => {
  const { pidx, orderData, userId } = req.body;

  try {
    // 1. Verify payment using lookup API
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `key live_secret_key_68791341fdd94846a146f0457ff7b455`,
          "Content-Type": "application/json",
        },
      }
    );

    const paymentStatus = response.data?.status;

    if (paymentStatus === "Completed") {
      // 2. Enrich items from DB
      const itemIds = orderData.items.map((i) => i.itemId);
      const existingItems = await Items.find({ _id: { $in: itemIds } });

      const enrichedItems = orderData.items.map((i) => {
        const product = existingItems.find((p) => p._id.equals(i.itemId));
        return {
          product: product?._id,
          name: product?.name || "Unknown",
          price: product?.price || 0,
          quantity: i.quantity,
        };
      });

      // 3. Create enriched order
      const newOrder = new Order({
        user: userId,
        items: enrichedItems, // ✅ Use enriched version
        totalPrice: orderData.totalPrice,
        contact: orderData.contact,
        address: orderData.address,
        paymentMethod: "Khalti",
        paymentStatus: "Paid",
      });

      await newOrder.save();

      return res.status(200).json({ success: true, order: newOrder });
    }

    return res.status(400).json({
      success: false,
      message: "Payment not completed",
      status: paymentStatus,
    });
  } catch (error) {
    console.error(
      "Khalti verification failed:",
      error?.response?.data || error
    );
    res.status(400).json({
      success: false,
      error: error?.response?.data || "Verification failed",
    });
  }
};

// ✅ Initiate Payment
const initiateKhalti = async (req, res) => {
  const { amount, return_url } = req.body;

  try {
    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      {
        return_url,
        website_url: "http://localhost:5173",
        amount,
        purchase_order_id: `POID_${Date.now()}`,
        purchase_order_name: "Food Order",
      },
      {
        headers: {
          Authorization: `key live_secret_key_68791341fdd94846a146f0457ff7b455`,
          "Content-Type": "application/json",
        },
      }
    );

    res.status(200).json({
      payment_url: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error("Khalti Init Error:", error?.response?.data || error);
    res.status(400).json({
      success: false,
      error: error?.response?.data || "Khalti initiation failed",
    });
  }
};

module.exports = { verifyKhalti, initiateKhalti };
