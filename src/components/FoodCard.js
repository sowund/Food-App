import { useState } from "react";
import axios from "axios";

const API = "http://localhost:5000";

function FoodCard({ id, name, price, avgRating, image, reviews, reload }) {
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");

  const rateFood = async () => {
    if (!rating) return;

    await axios.put(`${API}/items/${id}/rate`, {
      rating: Number(rating),
    });

    setRating("");
    reload();
  };

  const addReview = async () => {
    if (!comment) return;

    await axios.post(`${API}/items/${id}/review`, {
      user: "Anonymous",
      comment,
    });

    setComment("");
    reload();
  };

  return (
  <div className="col-md-4 d-flex justify-content-center mb-4 food-grid">
    <div className="card food-card shadow-sm">
      <img src={image} className="food-image" alt={name} />

      <div className="food-body">
        <h6 className="food-title">{name}</h6>
        <p className="mb-1">₹{price}</p>
        <p className="mb-2">⭐ {avgRating}</p>

        <div className="food-controls">
          <select
            className="form-select form-select-sm mb-1"
            value={rating}
            onChange={(e) => setRating(e.target.value)}
          >
            <option value="">Rate</option>
            <option value="1">1 ⭐</option>
            <option value="2">2 ⭐</option>
            <option value="3">3 ⭐</option>
            <option value="4">4 ⭐</option>
            <option value="5">5 ⭐</option>
          </select>

          <button
            className="btn btn-success btn-sm w-100 mb-1"
            onClick={rateFood}
          >
            Rate
          </button>

          <textarea
            className="form-control form-control-sm mb-1"
            placeholder="Review..."
            rows="2"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            className="btn btn-primary btn-sm w-100"
            onClick={addReview}
          >
            Add Review
          </button>
        </div>

        <div className="review-box">
          {reviews.length === 0 && <small>No reviews</small>}
          {reviews.map((r, i) => (
            <div key={i}>💬 {r.comment}</div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

}

export default FoodCard;
