import React from "react";
import "./Styles/Cart.css";
import { toast } from "react-toastify";
import { addItemToCart, removeErrors } from "../features/cart/cartSlice";
import { useDispatch, useSelector } from "react-redux";

function CartItem({ item }) {

  const {success,loading,error,message,cartItems} = useSelector((state) => state.cart);
  const [quantity, setQuantity] = React.useState(item.quantity);
  const dispatch = useDispatch();

  const decreaseQuantity = () => {
      if (quantity > 1) {
        setQuantity(quantity - 1);
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
        dispatch(addItemToCart({id:item.product,quantity}));
      }
      
    }

    const handleRemove = () => {
      dispatch(removeFromCart(item.id));
    }

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
        <button className="update-item-btn" onClick={handleUpdate}>Update</button>
        <button className="remove-item-btn" onClick={handleRemove}>Remove</button>
      </div>
    </div>
  );
}

export default CartItem;
