import React, { useState, useEffect } from "react";
import { RxCross1 } from "react-icons/rx";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import axios from "axios";
import styles from "../../styles/styles";

Chart.register(...registerables);

const WithdrawMoney = () => {
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSalesAmount, setTotalSalesAmount] = useState(0);
  const [categorySales, setCategorySales] = useState({});
  const [productPrices, setProductPrices] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isCategoryView, setIsCategoryView] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    fetchDeliveredOrders();
  }, []);

  const fetchDeliveredOrders = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/order/delivered"
      );
      if (Array.isArray(response.data)) {
        console.log("All Delivered Orders Data:", response.data);
        setDeliveredOrders(response.data);
        calculateTotalSales(response.data);
        calculateCategorySales(response.data);
        calculateProductPrices(response.data);
      } else {
        setDeliveredOrders([]);
      }
    } catch (error) {
      console.error("Error fetching delivered orders", error);
      setDeliveredOrders([]);
    } finally {
      setLoading(false);
    }
  };

 const calculateTotalSales = (orders) => {
   let totalAmount = 0;

   orders.forEach((order) => {
     if (order.cart && order.cart.length > 0) {
       order.cart.forEach((product) => {
        

         if (product.discountPrice && product.qty) {
           totalAmount +=
             product.discountPrice * product.qty +
             (product.discountPrice * product.qty)*(10/100);
         }
       });
     }
   });

  
   setTotalSalesAmount(totalAmount);
 };


  const calculateCategorySales = (orders) => {
    const salesByCategory = {};
    orders.forEach((order) => {
      order.cart.forEach((product) => {
        const category = product.category || "Uncategorized";
        salesByCategory[category] =
          (salesByCategory[category] || 0) + product.qty * product.discountPrice;
      });
    });
    setCategorySales(salesByCategory);
  };

  const calculateProductPrices = (orders) => {
    const productPrices = {};
    orders.forEach((order) => {
      order.cart.forEach((product) => {
        const category = product.category || "Uncategorized";
        const productKey = `${category}-${product.name}`;
        productPrices[productKey] = product.discountPrice; // Directly assigning the product price
      });
    });
    setProductPrices(productPrices);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setIsCategoryView(true);
  };

  const goBackToMainPage = () => {
    setIsCategoryView(false);
    setSelectedCategory("");
  };

  const groupProductsByName = (orders, category) => {
    const groupedProducts = {};
    orders.forEach((order) => {
      order.cart.forEach((product) => {
        if (product.category === category) {
          if (!groupedProducts[product.name]) {
            groupedProducts[product.name] = {
              quantity: product.qty,
              images: product.images && product.images.length > 0
                ? product.images[0].url : null,
              price: product.price,
            };
          } else {
            groupedProducts[product.name].quantity += product.qty;
            // product.images?.forEach((img) => {
            //   if (!groupedProducts[product.name].images.includes(img.url)) {
            //     groupedProducts[product.name].images.push(img.url);
            //   }
            // });
          }
        }
      });
    });
    return groupedProducts;
  };

  const chartData = {
    labels: Object.keys(categorySales),
    datasets: [
      {
        label: "Total Sales (BDT)",
        data: Object.values(categorySales),
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#ffce56",
          "#4bc0c0",
          "#9966ff",
          "#ff9f40",
        ],
        borderColor: "#ffffff",
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="w-full h-[90vh] p-8">
      <div className="w-full bg-white h-full rounded flex items-center justify-center flex-col">
        <h5 className="text-[20px] pb-4">
          Total Sales Amount: {totalSalesAmount.toFixed(2)} BDT
        </h5>
        <div
          className={`${styles.button} text-white !h-[42px] !rounded`}
          onClick={() => setOpen(true)}
        >
          View Sales
        </div>
      </div>

      {open && (
        <div className="w-full h-screen z-[9999] fixed top-0 left-0 flex items-center justify-center bg-[#0000004e]">
          <div className="w-[100%] 800px:w-[70%] bg-white shadow rounded h-[80vh] overflow-y-scroll p-3">
            <div className="w-full flex justify-end">
              <RxCross1
                size={25}
                onClick={() => setOpen(false)}
                className="cursor-pointer"
              />
            </div>

            {!isCategoryView ? (
              <>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Sales Overview
                </h3>
                <div className="w-full h-96 mt-4">
                  <Bar data={chartData} options={chartOptions} />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    View Sales by Category:
                  </h3>
                  <select
                    className="w-64 p-2 border border-gray-300 rounded-lg bg-white focus:ring focus:ring-blue-300"
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Choose a Category
                    </option>
                    {Object.keys(categorySales).map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={goBackToMainPage}
                  className="mb-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                >
                  Back
                </button>
                <h3 className="text-[22px] font-Poppins text-center font-[600]">
                  Category: {selectedCategory}
                </h3>
                <h3 className="text-lg text-green-600 mb-4">
                  Total Amount Sold: {categorySales[selectedCategory]}
                </h3>

                <div className="flex flex-col gap-4">
                  {Object.keys(
                    groupProductsByName(deliveredOrders, selectedCategory)
                  ).map((productName) => {
                    const product = groupProductsByName(
                      deliveredOrders,
                      selectedCategory
                    )[productName];
                    return (
                      <div
                        key={productName}
                        className="p-4 border border-gray-300 rounded-lg bg-gray-50"
                      >
                        <h4 className="text-lg font-medium text-gray-700">
                          {productName}
                        </h4>
                        <div className="flex gap-2 mt-2">
                          {product.images ? (
                           
                              <img
                    
                                src={product.images}
                                alt={productName}
                                className="w-32 h-32 object-cover"
                              />
                        
                          ) : (
                            <p className="text-gray-400">No Image Available</p>
                          )}
                        </div>
                        <p className="text-gray-600">
                          Quantity: {product.quantity}
                        </p>
                        <p className="text-gray-600">
                          Price:{" "}
                          {productPrices[
                            `${selectedCategory}-${productName}`
                          ] || "N/A"}{" "}
                          BDT
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawMoney;
