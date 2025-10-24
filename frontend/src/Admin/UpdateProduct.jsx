import React, { useEffect } from "react";
import "./Styles/UpdateProduct.css";
import Navbar from "../components/Navbar";
import PageTitle from "../components/PageTitle";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { getProductDetails } from "../features/products/productSlice";
import { removeErrors, removeSuccess, updateProduct } from "../features/admin/adminSlice";
import { toast } from "react-toastify";

function UpdateProduct() {
  const [name, setName] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [category, setCategory] = React.useState("");
  const [stock, setStock] = React.useState("");
  const [imagePreview, setImagePreview] = React.useState([]);
  const [oldImages, setOldImages] = React.useState([]);
  const [images, setImages] = React.useState([]);
  const {product} = useSelector((state) => state.product);
  const {success, error, loading} = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const {updateId} = useParams();
  const Navigate = useNavigate();

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

  useEffect(() => {
    dispatch(getProductDetails(updateId));
  },[dispatch, updateId]);

  useEffect(() => {
    if(product){
      setName(product.name || "");
      setPrice(product.price || "");
      setDescription(product.description || "");
      setCategory(product.category || "");
      setStock(product.stock || "");
      setOldImages(product.images || []);
    }
  },[product]);

  const handleImageChange = (e) => {
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

  const updateProductSubmit = (e) => {
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
    dispatch(updateProduct({id: updateId, formData: myForm}));
  }

  useEffect(() => {
    if (error) {
      toast.error(error,{ position: "top-center", autoClose: 3000});
      dispatch(removeErrors());
    }
  }, [dispatch, error]);

  useEffect(() => {
    if (success) {
      toast.success("Product updated successfully",{ position: "top-center", autoClose: 3000});
      dispatch(removeSuccess());
      Navigate('/admin/products');
    }
  }, [dispatch, success]);

  return (
    <>
      <Navbar />
      <PageTitle title="Update Product" />
      <div className="update-product-wrapper">
        <h1 className="update-product-title">Update Product</h1>
        <form className="update-product-form" encType="multipart/form-data" onSubmit={updateProductSubmit}>
          <label htmlFor="name">Product Name</label>
          <input
            type="text"
            className="update-product-input"
            required
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="price">Product Price</label>
          <input
            type="number"
            className="update-product-input"
            required
            id="price"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
          <label htmlFor="description">Product Description</label>
          <textarea
            type="text"
            className="update-product-textarea"
            required
            id="description"
            name="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <label htmlFor="category">Product Category</label>
          <select
            name="category"
            id="category"
            className="update-product-select"
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
          <label htmlFor="stock">Product Stock</label>
          <input
            type="number"
            className="update-product-input"
            required
            id="stock"
            name="stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
          <label htmlFor="images">Product Images</label>
          <div className="update-product-file-wrapper">
            <input
              type="file"
              accept="image/*"
              className="update-product-file-input"
              id="images"
              name="images"
              multiple
              onChange={handleImageChange}
            />
          </div>
          <div className="update-product-preview-wrapper">
            {imagePreview.map((img, index) => (
              <img
                src={img}
                alt="Image Preview"
                className="update-product-preview-image"
                key={index}
              />
            ))}
          </div>
          <div className="update-product-old-images-wrapper">
            {oldImages.map((img, index) => (
              <img
                src={img.url}
                alt="Old Image Preview"
                className="update-product-old-image"
                key={index}
              />
            ))}
          </div>
          <button className="update-product-submit-btn ">{loading ? "Updating..." : "Update"}</button>
        </form>
      </div>
      <Footer />
    </>
  );
}

export default UpdateProduct;