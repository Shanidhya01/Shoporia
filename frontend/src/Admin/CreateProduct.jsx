import React, { useEffect } from "react";
import "./Styles/CreateProduct.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import PageTitle from "../components/PageTitle";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, removeErrors, removeSuccess } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function CreateProduct() {
  const {success, error, loading} = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [images, setImages] = React.useState([]);
  const [imagePreview, setImagePreview] = React.useState([]);

  const categories = [
    "Electronics",
    "Cameras",
    "Laptop",
    "Accessories",
    "Food",
    "Books",
    "Clothes",
    "Shoes",
    "Beauty",
    "Health",
    "Sports",
    "Outdoor",
    "Home",
  ];
  
  const createProductSubmit = (e) => {
    e.preventDefault();
    const myForm = new FormData();
    myForm.set("name", name);
    myForm.set("price", price);
    myForm.set("description", description);
    myForm.set("category", category);
    myForm.set("stock", stock);
    images.forEach((img) => {
      myForm.append("images", img);
    });

    dispatch(createProduct(myForm));
  };

  const createProductImage = (e) => {
    const files = Array.from(e.target.files);
    setImages([]);
    setImagePreview([]);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImages((old) => [...old, reader.result]);
          setImagePreview((old) => [...old, reader.result]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  useEffect(() => {
    if (error) {
      toast.error(error.message,{ position: "top-center", autoClose: 3000});
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Product created successfully",{ position: "top-center", autoClose: 3000});
      dispatch(removeSuccess());
      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setStock("");
      setImages([]);
      setImagePreview([]);
    }
  }, [dispatch, success]);

  return (
    <>
      <Navbar />
      <PageTitle title="Create Product" />
      <div className="create-product-container">
        <h1 className="form-title font-bold">Create Product</h1>
        <form className="product-form" encType="multipart/form-data" onSubmit={createProductSubmit}>
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Name"
            required
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Price"
            required
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <input
            type="text"
            className="form-input"
            placeholder="Enter Product Description"
            required
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <select
            className="form-select"
            required
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            className="form-input"
            placeholder="Enter Product Stock"
            required
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <div className="file-input-container">
            <input
              type="file"
              accept="image/"
              className="form-input-file"
              multiple
              name="image"
              onChange={createProductImage}
            />
          </div>
          <div className="image-preview-container">
            {imagePreview.map((image, index) => (
              <img
                src={image}
                alt={`Product Preview ${index + 1}`}
                className="image-preview"
                key={index}
              />
            ))}
          </div>
          <button className="submit-btn">{loading ? "Creating..." : "Create"}</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default CreateProduct;
