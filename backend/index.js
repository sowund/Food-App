const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost:27017/restaurantdb")
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

const ItemSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  image: String,

  totalRating: { type: Number, default: 0 },
  ratingCount: { type: Number, default: 0 },

  reviews: [
    {
      user: String,
      comment: String,
      createdAt: { type: Date, default: Date.now }
    }
  ]
});

const Item = mongoose.model("Item", ItemSchema, "items");

// ✅ Get all items
app.get("/items", async (req, res) => {
  const items = await Item.find();

  const result = items.map(item => ({
    ...item._doc,
    avgRating:
      item.ratingCount === 0
        ? 0
        : Number((item.totalRating / item.ratingCount).toFixed(1))
  }));

  res.json(result);
});

// ✅ Add rating
app.put("/items/:id/rate", async (req, res) => {
  const { rating } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json("Invalid rating");
  }

  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json("Item not found");

  item.totalRating += rating;
  item.ratingCount += 1;

  await item.save();

  res.json({
    message: "Rating added",
    avgRating: Number((item.totalRating / item.ratingCount).toFixed(1))
  });
});

// ✅ Add review
app.post("/items/:id/review", async (req, res) => {
  const { user, comment } = req.body;

  if (!comment) return res.status(400).json("Review cannot be empty");

  const item = await Item.findById(req.params.id);
  if (!item) return res.status(404).json("Item not found");

  item.reviews.push({ user, comment });
  await item.save();

  res.json({ message: "Review added" });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
