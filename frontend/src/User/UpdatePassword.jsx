import React from "react";
import "./Styles/Form.css";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import {
  removeErrors,
  removeSuccess,
  updatePassword,
} from "../features/user/userSlice";
import Loader from "../components/Loader";

function UpdatePassword() {
  const [oldPassword, setOldPassword] = React.useState("");
  const [newPassword, setNewPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { error, success, loading } = useSelector((state) => state.user || {});

  const updatePasswordSubmit = (e) => {
    e.preventDefault();

    // basic validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill all fields", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    const myForm = new FormData();
    myForm.set("oldPassword", oldPassword);
    myForm.set("newPassword", newPassword);
    myForm.set("confirmPassword", confirmPassword);

    dispatch(updatePassword(myForm));
  };

  useEffect(() => {
    if (error) {
      toast.error(error, { position: "top-center", autoClose: 3000 });
      dispatch(removeErrors());
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (success) {
      toast.success("Password updated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/profile");
    }
  }, [success, dispatch, navigate]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : (
        <>
          <Navbar />
          <PageTitle title="Update Password" />
          <div className="container update-container">
            <div className="form-content">
              <form className="form" onSubmit={updatePasswordSubmit}>
                <h2>Update Password</h2>
                <div className="input-group">
                  <label htmlFor="name">Old Password</label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    name="oldPassword"
                    id="oldPassword"
                    placeholder="Enter your old password"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="name">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    name="newPassword"
                    id="newPassword"
                    placeholder="Enter your new password"
                    required
                  />
                </div>
                <div className="input-group">
                  <label htmlFor="name">Confirm Password</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    name="confirmPassword"
                    id="confirmPassword"
                    placeholder="Enter your confirm password"
                    required
                  />
                </div>
                <button className="authBtn" type="submit" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </button>
              </form>
            </div>
          </div>
          <Footer />
        </>
      )}
    </>
  );
}

export default UpdatePassword;
