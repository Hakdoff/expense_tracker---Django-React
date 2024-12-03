import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import useAxios from "../../utils/useAxios";
import AuthContext from "../../context/AuthContext";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from "chart.js";
import { Pie } from "react-chartjs-2";
const swal = require("sweetalert2");

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const WishlistPage = () => {
  const api = useAxios();
  const { authTokens } = useContext(AuthContext);
  const navigate = useNavigate();
  const [wishlists, setWishlist] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await api.get("/wishlist/");
        setWishlist(response.data);
      } catch (error) {
        setError("Failed to fetch wishlists.");
        swal.fire({
          title: "Error!",
          text: error.response?.data?.detail || "Failed to fetch wishlists.",
          icon: "error",
          timer: 3000,
          showConfirmButton: false,
        });
        if (error.response.status === 401) {
          navigate("/login");
        }
      }
    };

    if (!authTokens) {
      navigate("/login");
    }

    fetchWishlist();
  }, [authTokens, navigate]);

  const getYearAndMonth = (dateString) => {
    const date = new Date(dateString);
    return {
      year: date.getFullYear(),
      month: date.getMonth() + 1,
    };
  };

  const totalWishlist = wishlists.reduce(
    (sum, wishlist) => sum + (wishlist.price || 0),
    0
  );
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const formattedMonth = new Date().toLocaleString("en-US", { month: "long" });

  const yearlyWishlist = wishlists
    .filter(
      (wishlist) => getYearAndMonth(wishlist.date_received).year === currentYear
    )
    .reduce((sum, wishlist) => sum + (wishlist.amount || 0), 0);

  const monthlyWishlist = wishlists
    .filter(
      (wishlist) =>
        getYearAndMonth(wishlist.date_received).month === currentMonth
    )
    .reduce((sum, wishlist) => sum + (wishlist.amount || 0), 0);

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      </div>
    );
  }

  const groupWishlistByCategory = (wishlists) => {
    return wishlists.reduce((acc, wishlist) => {
      const category = wishlist.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + (wishlist.amount || 0);
      return acc;
    }, {});
  };

  // const handleToggleCompleted = async (id) => {
  //   const updatedWishlist = wishlists.map((wishlist) =>
  //     wishlist.id === id
  //       ? { ...wishlist, is_bought: !wishlist.is_bought }
  //       : wishlist
  //   );

  //   setWishlist(updatedWishlist);

  //   try {
  //     const updatedWishlist = wishlists.find((wishlist) => wishlist.id === id);
  //     const backendUpdate = {
  //       ...updatedWishlist,
  //       is_bought: !updatedWishlist.is_bought,
  //     };
  //     await api.put(`/wishlist/${id}`, backendUpdate);
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };
  const handleToggleCompleted = async (id) => {
    // Find the item to be updated
    const wishlistToUpdate = wishlists.find((wishlist) => wishlist.id === id);

    if (!wishlistToUpdate) {
      console.error("Wishlist item not found");
      return;
    }

    // Prepare updated item for local state (optimistic update)
    const updatedWishlistItem = {
      ...wishlistToUpdate,
      is_bought: !wishlistToUpdate.is_bought, // Toggle the value
    };

    // Update the local state immediately
    setWishlist((prevWishlists) =>
      prevWishlists.map((wishlist) =>
        wishlist.id === id ? updatedWishlistItem : wishlist
      )
    );

    try {
      // Now send the updated item to the backend
      await api.put(`/wishlist/${id}`, updatedWishlistItem);
    } catch (error) {
      // If backend update fails, roll back the local state
      console.error("Failed to update wishlist in the backend:", error);
      setWishlist((prevWishlists) =>
        prevWishlists.map((wishlist) =>
          wishlist.id === id
            ? { ...wishlist, is_bought: !wishlist.is_bought } // Undo optimistic update
            : wishlist
        )
      );
    }
  };

  return (
    <>
      <div className="bg-white p-4">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-2 mb-3 border-bottom">
          <div className="h2">Wishlist</div>
          <button className="nav-link" onClick={() => navigate(`/addwishlist`)}>
            <span data-feather="bar-chart-2" />
            Add Wishlist
          </button>
        </div>
        <div className="m-10">
          <div className="grid grid-cols-1 gap-10">
            <div className="border border-sky-500">
              <div className="flex flex-col text-center gap-4 p-4">
                <div className="text-2xl text-blue-400">
                  ₱{totalWishlist.toFixed(2)}
                </div>
                <div>Overall Wishlist</div>
              </div>
            </div>
          </div>
        </div>
        <div className="m-10">
          <div className="grid grid-cols-2 xl:grid-cols-4 pb-2 gap-2">
            {wishlists.map((wishlist) => (
              <div className="border-2 rounded-lg w-64 xl:w-80 justify-center items-center">
                <div className="m-2">
                  <input
                    type="checkbox"
                    checked={wishlist.is_bought}
                    onChange={() => handleToggleCompleted(wishlist.id)}
                  />
                  <button>Delete</button>
                  <div className="w-full rounded-full">
                    <img src={wishlist.image} alt={wishlist.name} />
                  </div>
                  <div className="pt-2 font-medium">{wishlist.item}</div>
                  <div>{wishlist.category || "N/A"}</div>
                  <div>₱ {wishlist.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default WishlistPage;
