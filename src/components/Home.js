import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';
import FoodCard from './FoodCard';
import axios from 'axios';

const API = "http://localhost:5000";

function Home() {
    const navigate = useNavigate();
    const [foods, setFoods] = useState([]);
    const [allFoods, setAllFoods] = useState([]);
    const [modal, setModal] = useState(false);

    const [category, setCategory] = useState("all");
    const [rating, setRating] = useState(0);
    const [selectedSort, setSelectedSort] = useState("");
    const handleLogout = () => {
        localStorage.removeItem("token"); // 1. Delete the token
        navigate("/login");               // 2. Go back to Login page
    };
    useEffect(() => {
        loaditems();
    }, []);

    const loaditems = async () => {
        try {
            const response = await axios.get(`${API}/items`);
            setFoods(response.data);
            setAllFoods(response.data);
        } catch (err) {
            console.error("Error fetching items:", err);
        }
    };

    const reset = () => {
        setFoods(allFoods);
        setCategory("all");
        setRating(0);
        setSelectedSort("");
    };

    const applyAll = () => {
        let result = [...allFoods];

        if (category !== "all") {
            result = result.filter(
                item => item.category?.toLowerCase() === category.toLowerCase()
            );
        }

        if (rating > 0) {
            result = result.filter(
                item => Number(item.avgRating) >= Number(rating)
            );
        }

        if (selectedSort === "priceLow") {
            result = [...result].sort((a, b) => a.price - b.price);
        }
        else if (selectedSort === "priceHigh") {
            result = [...result].sort((a, b) => b.price - a.price);
        }
        else if (selectedSort === "ratingHigh") {
            result = [...result].sort((a, b) => b.avgRating - a.avgRating);
        }

        setFoods(result);
        setModal(false);
    };

    return (
        <div className="container">
            <p className="mt-3">Welcome to Restaurant!!!</p>
            <button className="btn btn-warning" onClick={handleLogout}>
                Logout
            </button>
            {/* Buttons */}
            <button
                className="btn btn-primary m-2"
                onClick={() => setModal(true)}
            >
                Filter / Sort
            </button>

            <button className="btn btn-danger m-2" onClick={reset}>
                Reset
            </button>

            {/* Filter Modal */}
            {modal && (
                <div className="filter-overlay">
                    <div className="filter-modal">

                        <h5 className="mb-3">Filter & Sort Foods</h5>

                        {/* Category */}
                        <select
                            className="form-select mb-3"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="all">All Categories</option>
                            <option value="veg">Vegetarian</option>
                            <option value="non-veg">Non-Vegetarian</option>
                        </select>

                        {/* Rating */}
                        <select
                            className="form-select mb-3"
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            <option value={0}>All Ratings</option>
                            <option value={1}>1 Star & above</option>
                            <option value={2}>2 Stars & above</option>
                            <option value={3}>3 Stars & above</option>
                            <option value={4}>4 Stars & above</option>
                        </select>

                        {/* Sort */}
                        <select
                            className="form-select mb-3"
                            value={selectedSort}
                            onChange={(e) => setSelectedSort(e.target.value)}
                        >
                            <option value="">Sort By</option>
                            <option value="priceLow">Price: Low to High</option>
                            <option value="priceHigh">Price: High to Low</option>
                            <option value="ratingHigh">Rating: High to Low</option>
                        </select>

                        {/* Actions */}
                        <div className="d-flex gap-2">
                            <button className="btn btn-primary w-100" onClick={applyAll}>
                                Apply
                            </button>

                            <button
                                className="btn btn-secondary w-100"
                                onClick={() => setModal(false)}
                            >
                                Close
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* Food Grid */}
            <div className="row mt-3">
                {foods.map((item) => (
                    <FoodCard
                        key={item._id}
                        id={item._id}
                        name={item.name}
                        price={item.price}
                        avgRating={item.avgRating}
                        image={item.image}
                        reviews={item.reviews}
                        reload={loaditems}
                    />
                ))}
            </div>

        </div>
    );
}

export default Home;
