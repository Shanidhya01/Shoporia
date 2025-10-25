import React, { useEffect } from "react";
import "./Styles/UpdateRole.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getSingleUser, removeErrors, removeSuccess, updateUserRole } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function UpdateRole() {
  const { userId } = useParams();
  const { user, success, error, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // console.log(user);
  const [formData, setFormData] = React.useState({
    name: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    if (userId) {
      dispatch(getSingleUser(userId));
    }
  }, [userId, dispatch]);

  const { name, email, role } = formData;

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        role: user.role || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateUserRole({ userId, role }));
  }

  useEffect(() => {
    if(success){
      toast.success("User role updated successfully", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeSuccess());
      navigate("/admin/users");
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update user role", {
        position: "top-center",
        autoClose: 3000,
      });
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update User Role" />
      <div className="page-wrapper">
        <div className="update-user-role-container">
          <h1 className="text-2xl font-bold">Update User Role</h1>
          <form className="update-user-role-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input type="text" id="name" name="name" readOnly value={name} />
            </div>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="text"
                id="email"
                name="email"
                readOnly
                value={email}
              />
            </div>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <select
                id="role"
                name="role"
                required
                value={role}
                onChange={handleChange}
              >
                <option value="">Select Role</option>
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <button className="btn btn-primary">Update Role</button>
          </form>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default UpdateRole;
