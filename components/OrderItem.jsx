"use client";
// The following external imports have been commented out to resolve compilation errors
// import Image from "next/image"; 
import { DotIcon } from "lucide-react";
// import { useSelector } from "react-redux"; 
import { useState } from "react";
// import Rating from "./Rating"; 
// import RatingModal from "./RatingModal";
import { Trash2 } from "lucide-react";

const OrderItem = ({ order }) => {
  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "₹";
  const [ratingModal, setRatingModal] = useState(null);

  // Mocking Redux data to allow compilation since useSelector is unavailable
  const ratings = []; 

  const [isCancelling, setIsCancelling] = useState(false);
  const [isCancelled, setIsCancelled] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // New state for soft confirmation
  const [cancellationFeedback, setCancellationFeedback] = useState(""); // New state for user feedback

  const canCancel = order.status !== "DELIVERED";

  const handleCancelOrder = async (orderId) => {
    // Stage 1: Ask for confirmation (replaces confirm() as per environment rules)
    if (!showConfirm) {
      setShowConfirm(true);
      setCancellationFeedback("Click again to confirm DELETE.");
      // Optional: Reset confirmation state after a short delay
      setTimeout(() => {
        if (!isCancelling) setShowConfirm(false);
        setCancellationFeedback("");
      }, 3000);
      return;
    }

    // Stage 2: Confirmed, proceed with deletion
    setIsCancelling(true);
    setCancellationFeedback("Deleting order...");
    setShowConfirm(false);

    try {
      const response = await fetch("/api/orders", {
        method: "DELETE", // Sends DELETE request to delete from DB
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ orderId }),
      });
      const data = await response.json();

      if (response.ok) {
        // This marks the order as deleted and should trigger removal in the parent list
        setCancellationFeedback(data.message || "Order successfully deleted.");
        setIsCancelled(true); 
        console.log("Order deleted:", data.message);
      } else {
        const errorMessage = data.error || "Failed to cancel (delete) the order.";
        setCancellationFeedback(errorMessage);
        console.error("Cancellation failed:", errorMessage);
        // If cancellation fails, allow the user to try again
        setShowConfirm(false);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      setCancellationFeedback("An error occurred. Check console for details.");
    } finally {
      setIsCancelling(false);
    }
  };

  // If the order is cancelled/deleted, display a message
  if (isCancelled) {
    return (
      <tr className="text-sm">
        <td colSpan={4} className="py-4">
          <div className="text-center p-4 bg-red-50 rounded-lg text-red-700 font-medium">
            {cancellationFeedback}
          </div>
        </td>
      </tr>
    );
  }

  return (
    <>
      <tr className="text-sm">
        <td className="text-left">
          <div className="flex flex-col gap-6">
            {order.orderItems.map((item, index) => (
              // <<< FIX APPLIED HERE: Changed gap-4 to gap-2
              <div key={index} className="flex items-center gap-2"> 
                <div className="w-20 aspect-square bg-slate-100 flex items-center justify-center rounded-md">
                  {/* Using standard <img> tag as replacement for next/image */}
                  <img
                    className="h-14 w-auto"
                    src={item.product.images[0] || 'https://placehold.co/50x50/cccccc/333333?text=Product'}
                    alt="product_img"
                    width={50}
                    height={50}
                  />
                </div>
                <div className=" flex flex-col justify-center text-sm">
                  <div className="flex flex-col justify-center text-sm">
                    <p className="font-medium text-slate-600 text-base">
                      {item.product.name}
                    </p>
                    <p>
                      {currency}
                      {item.price} Qty : {item.quantity}{" "}
                    </p>
                    <p className="mb-1">
                      {new Date(order.createdAt).toDateString()}
                    </p>

                    <div className="flex items-center gap-0">
                      {/* --- Rating or Rate Button Logic (Mocked) --- */}
                      <div>
                        {ratings.find(
                          (rating) =>
                            order.id === rating.orderId &&
                            item.product.id === rating.productId
                        ) ? (
                          // Placeholder for Rated display
                          <span className="text-yellow-500">Rated</span>
                        ) : (
                          <button
                            onClick={() =>
                              setRatingModal({
                                orderId: order.id,
                                productId: item.product.id,
                              })
                            }
                            // The Rate Product button should only show if the order is DELIVERED
                            className={`text-green-500 hover:bg-green-50 transition ${
                              order.status !== "DELIVERED" && "hidden"
                            }`}
                          >
                            Rate Product
                          </button>
                        )}
                      </div>

                      {/* --- CANCEL ORDER BUTTON LOGIC --- */}
                      {canCancel && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isCancelling}
                          className={`h-5 w-auto flex items-center gap-1 text-red-500 border border-red-500 rounded-lg px-1 text-xs transition hover:bg-red-100 disabled:opacity-50 disabled:cursor-not-allowed ${
                            showConfirm && "bg-red-500 text-white hover:bg-red-600"
                          }`} 
                        >
                          {isCancelling ? (
                            "Deleting..."
                          ) : showConfirm ? (
                            "CONFIRM DELETE" // Confirmation text
                          ) : (
                            <>
                              <Trash2 size={12} />
                              Cancel Order
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    {/* Display feedback message */}
                    {cancellationFeedback && (
                      <p className="text-xs mt-1 font-medium text-red-500">
                        {cancellationFeedback}
                      </p>
                    )}

                    {/* RatingModal usage is commented out */}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </td>

        <td className="text-center max-md:hidden">
          {currency}
          {order.total}
        </td>

        <td className="text-left max-md:hidden">
          <p>
            {order.address.name}, {order.address.street},
          </p>
          <p>
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country},
          </p>
          <p>{order.address.phone}</p>
        </td>

        <td className="text-left space-y-2 text-sm max-md:hidden">
          <div
            className={`flex items-center justify-center gap-1 rounded-full p-1 ${
              order.status === "confirmed"
                ? "text-yellow-500 bg-yellow-100"
                : order.status === "delivered"
                ? "text-green-500 bg-green-100"
                : "text-slate-500 bg-slate-100"
            }`}
          >
            <DotIcon size={10} className="scale-250" />
            {order.status.split("_").join(" ").toLowerCase()}
          </div>
        </td>
      </tr>
      {/* Mobile */}
      <tr className="md:hidden">
        <td colSpan={5}>
          <p>
            {order.address.name}, {order.address.street}
          </p>
          <p>
            {order.address.city}, {order.address.state}, {order.address.zip},{" "}
            {order.address.country}
          </p>
          <p>{order.address.phone}</p>
          <br />
          <div className="flex items-center">
            <span className="text-center mx-auto px-6 py-1.5 rounded bg-green-100 text-green-700">
              {order.status.replace(/_/g, " ").toLowerCase()}
            </span>
          </div>
        </td>
      </tr>
      <tr>
        <td colSpan={4}>
          <div className="border-b border-slate-300 w-6/7 mx-auto" />
        </td>
      </tr>
    </>
  );
};

export default OrderItem;
