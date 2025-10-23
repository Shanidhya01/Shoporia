import React, { useEffect } from "react";
import "./Styles/Cart.css";
import { toast } from "react-toastify";
import { addItemToCart, removeErrors, removeItemFromCart } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

function CartItem({ item }) {

  const {success,loading,error,message,cartItems} = useSelector((state) => state.cart);
  const [quantity, setQuantity] = React.useState(item.quantity);
  const dispatch = useDispatch();
  // console.log("Subtotal in CartItem:", subtotal);
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
      // Immediately update the cart in Redux
      dispatch(addItemToCart({ id: item.product, quantity: -1 }));
    } else {
      toast.error("Quantity cannot be less than 1", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  };

  const increaseQuantity = () => {
    if (quantity < item.stock) {
      setQuantity(quantity + 1);
    } else {
      toast.error(`Only ${item.stock} items in stock`, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  };

    const handleUpdate = () => {
      if(loading) return;
      if(quantity !== item.quantity){
        // Only send the difference to Redux
        const diff = quantity - item.quantity;
        if(diff > 0){
          dispatch(addItemToCart({id:item.product,quantity:diff}));
        } else if(diff < 0){
          // If you want to support decreasing quantity, implement a removeQuantity thunk
          // For now, just show error
          toast.error("To decrease quantity, remove and re-add the item.", { position: "top-center", autoClose: 3000 });
        }
      }
    }

    const handleRemove = () => {
      if(loading) return;
      dispatch(removeItemFromCart(item.product));
      toast.success("Item removed from cart successfully.", {
        position: "top-center",
        autoClose: 3000,
      })
    }

  useEffect(() => {
    if(error){
      toast.error(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, message, dispatch]);

  useEffect(() => {
    if(success){
      toast.success(message, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [success, message, dispatch]);

  return (
    <div className="cart-item">
      <div className="item-info">
        <img src={item.image} alt={item.name} className="item-image" />
        <div className="item-details">
          <h3 className="item-name">{item.name}</h3>
          <p className="item-price">
            <strong>Price :</strong> ₹{item.price.toFixed(2)}/-
          </p>
          <p className="item-quantity">
            <strong>Quantity:</strong> {item.quantity}
          </p>
        </div>
      </div>

      <div className="quantity-controls">
        <button className="quantity-button decrease-btn" onClick={decreaseQuantity} disabled={loading}>-</button>
        <input
          type="number"
          value={quantity}
          readOnly
          className="quantity-input"
          min={1}
        />
        <button className="quantity-button increase-btn" onClick={increaseQuantity} disabled={loading}>+</button>
      </div>

      <div className="item-total">
        <span className="item-total-price"> ₹{(item.price * item.quantity).toFixed(2)}</span>
      </div>

      <div className="item-actions">
        <button className="update-item-btn" onClick={handleUpdate} disabled={loading || quantity === item.quantity}>{loading ? "Updating..." : "Update"}</button>
        <button className="remove-item-btn" disabled={loading} onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
}

export default CartItem;
