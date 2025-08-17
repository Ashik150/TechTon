import React, { useEffect, useState } from "react";
import styles from "../styles/styles";
import Header from "../components/Layout/Header";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import axios from "axios";

const BestSellingPage = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchBestSellingProducts = async () => {
      try {
        const response = await axios.get(
          " http://localhost:5000/api/product/get-best-selling-products"
        );
        setData(response.data.products);
      } catch (error) {
        console.error("Error fetching best-selling products:", error);
      }
    };

    fetchBestSellingProducts();
  }, []);

  return (
    <div className="bg-gray-100">
      <Header activeHeading={2} />
      <br />
      <br />
      <div className={styles.section}>
        <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12 border-0">
          {data &&
            data.map((product, index) => (
              <ProductCard data={product} key={index} />
            ))}
        </div>
      </div>
    </div>
  );
};

export default BestSellingPage;
