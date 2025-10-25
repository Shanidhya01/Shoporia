import React, { useEffect } from "react";
import "./Styles/Form.css";
import PageTitle from "../components/PageTitle";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  forgotPassword,
  removeErrors,
  removeSuccess,
} from "../features/user/userSlice";
import { toast } from "react-toastify";
import Loader from "../components/Loader";

function ForgotPassword() {
  const [email, setEmail] = React.useState("");
  const { loading, error, message, success } = useSelector(
    (state) => state.user
  );
  const dispatch = useDispatch();

  const forgotPasswordEmail = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("email", email);

    dispatch(forgotPassword(myForm));
    setEmail("");
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success(message, {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
    }
  }, [success, dispatch]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <PageTitle title="Forgot Password" />
          <Navbar />
          <div className="container forgot-container">
            <div className="form-content email-group">
              <form className="form" onSubmit={forgotPasswordEmail}>
                <div className="input-group">
                  <input
                    type="email"
                    placeholder="Enter Your Registered Email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button className="authBtn">Send</button>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default ForgotPassword;
