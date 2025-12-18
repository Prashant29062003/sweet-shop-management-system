import { useState } from "react";
import { useCart } from "../context";
import { Card, Button, Alert } from "../components";
import { createPayment } from "../api/payment.api";
import { useNavigate } from "react-router-dom";

const BasketPage = () => {
  const { cartItems, removeFromCart, totalAmount, clearCart, addToCart, deleteItemEntirely } = useCart();
  
  const navigate = useNavigate();

  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = async () => {
    if (totalAmount === 404) {
      alert("Bank Server Down (Simulated 404 Error). Try a different total!");
      return;
    }

    const orderItems = cartItems.map((item) => ({
      sweetId: item._id,
      quantity: item.quantity,
    }));

    setIsProcessing(true);

    setTimeout(async () => {
      try {
        await createPayment({
          amount: totalAmount,
          method: "upi", // later can be allow user to select
          items: orderItems,
        });
        Alert(
          "Payment Initiated! Check your `My Orders` section.",
          "info"
        );
        clearCart();
        navigate("/dashboard/my-payments", {replace: true});
      } catch (err) {
        Alert("Checkout failed: " + err.message + "danger");
      }finally{
        setIsProcessing(false);
      }
    }, 2000);
  };

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <span className="text-6xl mb-4">🛒</span>
        <h2 className="text-xl font-semibold text-gray-600">
          Your basket is empty
        </h2>
        <Button className="mt-4" onClick={() => navigate("/dashboard/sweets")}>
          Go Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold">Your Basket</h2>
      <Card className="divide-y divide-gray-100">
        {cartItems.map((item) => (
          <div
            key={item._id}
            className="flex justify-between items-center p-4 border-b"
          >
            <div>
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-sm text-gray-500">
                ₹{item.price} x {item.quantity}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-bold">₹{item.price * item.quantity}</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => removeFromCart(item._id)}
              >
                -
              </Button>

              <span className="font-bold">{item.quantity}</span>

              {/* Increment one by one */}
              <Button size="sm" onClick={() => addToCart(item)}>
                +
              </Button>

              <Button
                variant="danger"
                size="sm"
                onClick={() => deleteItemEntirely(item._id)}
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
        <div className="p-4 flex justify-between items-center bg-gray-50">
          <span className="text-xl font-bold">Total: ₹{totalAmount}</span>
          <Button
            variant="success"
            onClick={handleCheckout}
            disabled={isProcessing}
            className="border-2 border-green-600 hover:bg-green-600 hover:text-white cursor-pointer"
          >
            {isProcessing ? (
              <div className="flex items-center gap-2 ">
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                Processing Payment...
              </div>
            ) : (
              `Pay ₹${totalAmount}`
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default BasketPage;
