import React from 'react'
import Footer from '../components/Footer'
import "./Styles/Home.css"
import Navbar from '../components/Navbar'
import ImageSlider from '../components/ImageSlider'
import Product from '../components/Product'

const products = [
  {
            "_id": "68ce98c81dac062361aa77df",
            "name": "Product1",
            "description": "Product Description",
            "price": 100,
            "ratings": 0,
            "images": [
                {
                    "public_id": "this is test id1",
                    "url": "This is test url",
                    "_id": "68ce98c81dac062361aa77e0"
                }
            ],
            "category": "shirt",
            "stock": 10,
            "numOfReviews": 0,
            "reviews": [],
            "createdAt": "2025-09-20T12:06:32.860Z",
            "__v": 0
        },
        {
            "_id": "68d42e08f9bd10fc5c06712c",
            "name": "Product401",
            "description": "Product Description",
            "price": 1000,
            "ratings": 0,
            "images": [
                {
                    "public_id": "this is test id1",
                    "url": "This is test url",
                    "_id": "68d42e08f9bd10fc5c06712d"
                }
            ],
            "category": "Laptop",
            "stock": 10,
            "numOfReviews": 0,
            "user": "68d14585d866bb93d2bfa5cd",
            "reviews": [],
            "createdAt": "2025-09-24T17:44:40.315Z",
            "__v": 0
        },
]

function Home() {
  return (
    <>
      <div>
        <Navbar />
        <ImageSlider />
        <div className='home-container'>
          <h2 className='home-heading'>Welcome to Shoporia</h2>
          <div className="home-product-container">
            {products.map((product,index) => (
              <Product key={index} product={product} />
            ))}
          </div>
        </div>
        <Footer />
      </div>
    </>
  )
}

export default Home
