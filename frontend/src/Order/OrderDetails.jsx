import React, { use, useEffect } from 'react'
import "./Styles/OrderDetails.css"
import PageTitle from '../components/PageTitle'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { getOrderDetails, removeErrors } from '../features/order/orderSlice'
import { toast } from 'react-toastify'
import Loader from '../components/Loader'

function OrderDetails() {
  const {orderID} = useParams();
  const {order,loading,error} = useSelector((state)=>state.order);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(getOrderDetails(orderID));
    if(error){
      toast.error(error, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  },[dispatch,error,orderID]);
  const {
    shippingInfo = {},
    orderItems = [],
    paymentInfo = {},
    orderStatus,
    totalPrice,
    paidAt,
    itemsPrice,
    taxPrice,
    shippingPrice,
  } = order;
  const paymentStatus = paymentInfo.status === "succeeded" ? 'Paid' : 'Not Paid';
  const finalOrderStatus = paymentStatus === "Not Paid" ? "Cancelled" : orderStatus;
  const orderStatusClass = finalOrderStatus === "Delivered" ? "status-tag delivered" : `status-tag ${finalOrderStatus.toLowerCase()}`;
  const paymentStatusClass = paymentStatus === "Paid" ? "pay-tag paid" : "pay-tag not-paid";

  return (
    <>
      <Navbar />
      <PageTitle title={`${orderID} Details`} />
      {loading ? (<Loader />) : (<div className="order-box">
        {/* Order Items table */}
        <div className="table-block">
          <h2 className="table-title">Order Items</h2>
          <table className="table-main">
            <thead>
              <tr>
                <th className='head-cell'>Image</th>
                <th className='head-cell'>Name</th>
                <th className='head-cell'>Quantity</th>
                <th className='head-cell'>Price</th>
              </tr>
            </thead>
            <tbody>
              { orderItems.map((item)=>(
                <tr className='table-row' key={item.product}>
                  <td className='table-cell'>
                    <img
                      src={item.image}
                      alt={item.name}
                      className='item-img'
                    />
                  </td>
                  <td className='table-cell'>{item.name}</td>
                  <td className='table-cell'>{item.quantity}</td>
                  <td className='table-cell'>₹{item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Shipping Info Table */}
        <div className="table-block">
          <h2 className="table-title">Shipping Information</h2>
          <table className="table-main">
            <tbody>
              <tr className='table-row'>
                <th className='table-cell'>Address</th>
                <td className='table-cell'>
                  {`${shippingInfo.address}, ${shippingInfo.city}, ${shippingInfo.state}, ${shippingInfo.country} - ${shippingInfo.pinCode}`}
                </td>
              </tr>
              <tr className='table-row'>
                <th className='table-cell'>Phone</th>
                <td className='table-cell'>{shippingInfo.phoneNo}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Order Summary Table */}
        <div className="table-block">
          <h2 className="table-title">Order Summary</h2>
          <table className="table-main">
            <tbody>
              <tr className='table-row'>
                <th className='table-cell'>Order Status</th>
                <td className='table-cell'>
                  <span className={orderStatusClass}>{finalOrderStatus}</span>
                </td>
              </tr>
              <tr className='table-row'>
                <th className='table-cell'>Payment</th>
                <td className='table-cell'>
                  <span className={paymentStatusClass}>{paymentStatus}</span>
                </td>
              </tr>
              {paidAt && (<tr className='table-row'>
                <th className='table-cell'>Paid At</th>
                <td className='table-cell'>
                  {new Date(paidAt).toLocaleString()}
                </td>
              </tr>)}
              <tr className='table-row'>
                <th className='table-cell'>Item Price</th>
                <td className='table-cell'>
                  {`₹${itemsPrice}`}
                </td>
              </tr>
              <tr className='table-row'>
                <th className='table-cell'>Tax Price</th>
                <td className='table-cell'>
                  {`₹${taxPrice}`}
                </td>
              </tr>
              <tr className='table-row'>
                <th className='table-cell'>Shipping Price</th>
                <td className='table-cell'>
                  {`₹${shippingPrice}`}
                </td>
              </tr>
              <tr className='table-row'>
                <th className='table-cell'>Total Price</th>
                <td className='table-cell'>
                  {`₹${totalPrice}`}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>)}
      <Footer />
    </>
  )
}

export default OrderDetails
