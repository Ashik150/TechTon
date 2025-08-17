import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useAuthStore } from "../../store/authStore";

const Checkout = () => {
  const { user } = useAuthStore();
  const { cart } = useSelector((state) => state.cart);
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [userInfo, setUserInfo] = useState(false);
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState(null);
  const [discountPrice, setDiscountPrice] = useState(null);
  const [useRewardPoints, setUseRewardPoints] = useState(false);
  const [userPoints, setUserPoints] = useState(0);
  const [pointsDiscount, setPointsDiscount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    // Fetch user points when component mounts
    if (user && user._id) {
      fetchUserPoints();
    }
  }, [user]);

  // Fetch user points from the backend
  const fetchUserPoints = async () => {
    try {
      const { data } = await axios.get(
        `${server}/order/user-points/${user._id}`
      );
      setUserPoints(data.points);
    } catch (error) {
      console.error("Error fetching user points:", error);
      toast.error("Could not fetch reward points");
    }
  };

  // Calculate points discount when reward points usage changes
  useEffect(() => {
    if (useRewardPoints && userPoints >= 1000) {
      // Convert points to BDT (100 points = 1 BDT)
      const pointsValue = Math.floor(userPoints / 100);
      setPointsDiscount(pointsValue);
    } else {
      setPointsDiscount(0);
    }
  }, [useRewardPoints, userPoints]);

  const paymentSubmit = () => {
    if (
      address1 === "" ||
      address2 === "" ||
      zipCode === null ||
      country === "" ||
      city === ""
    ) {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        address1,
        address2,
        zipCode,
        country,
        city,
      };

      const orderData = {
        cart,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        pointsDiscount, // Add points discount to order data
        pointsUsed: useRewardPoints ? userPoints : 0, // Track points used
        shippingAddress,
        user,
      };

      // update local storage with the updated orders array
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  // this is shipping cost variable
  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = couponCode;

    await axios.get(`${server}/coupon/get-coupon-value/${name}`).then((res) => {
      const shopId = res.data.couponCode?.shopId;
      const couponCodeValue = res.data.couponCode?.value;
      if (res.data.couponCode !== null) {
        const isCouponValid =
          cart && cart.filter((item) => item.shopId === shopId);

        if (isCouponValid.length === 0) {
          toast.error("Coupon code is not valid for this shop");
          setCouponCode("");
        } else {
          const eligiblePrice = isCouponValid.reduce(
            (acc, item) => acc + item.qty * item.discountPrice,
            0
          );
          const discountPrice = (eligiblePrice * couponCodeValue) / 100;
          setDiscountPrice(discountPrice);
          setCouponCodeData(res.data.couponCode);
          setCouponCode("");
        }
      }
      if (res.data.couponCode === null) {
        toast.error("Coupon code does not exist!");
        setCouponCode("");
      }
    });
  };

  const handlePointsToggle = () => {
    if (userPoints < 1000 && !useRewardPoints) {
      toast.error("You need at least 1000 points to redeem!");
      return;
    }
    setUseRewardPoints(!useRewardPoints);
  };

  const discountPercentenge = couponCodeData ? discountPrice : "";

  // Calculate total price with all discounts
  const totalPrice = (() => {
    let price = subTotalPrice + shipping;

    // Subtract coupon discount if available
    if (couponCodeData && discountPrice) {
      price -= discountPrice;
    }

    // Subtract points discount if points are being used
    if (useRewardPoints && pointsDiscount > 0) {
      price -= pointsDiscount;
    }

    return price.toFixed(2);
  })();

  return (
    <div className="w-full flex flex-col items-center py-8">
      <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
        <div className="w-full 800px:w-[65%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
          />
        </div>
        <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
          <CartData
            handleSubmit={handleSubmit}
            totalPrice={totalPrice}
            shipping={shipping}
            subTotalPrice={subTotalPrice}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            discountPercentenge={discountPercentenge}
            userPoints={userPoints}
            pointsDiscount={pointsDiscount}
            useRewardPoints={useRewardPoints}
            handlePointsToggle={handlePointsToggle}
          />
        </div>
      </div>
      <div
        className={`${styles.button} w-[150px] 800px:w-[280px] mt-10`}
        onClick={paymentSubmit}
      >
        <h5 className="text-white">Go to Payment</h5>
      </div>
    </div>
  );
};

// Other components remain the same
const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  userInfo,
  setUserInfo,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
}) => {
  const [selectedAddress, setSelectedAddress] = useState(null);
  return (
    <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
      <h5 className="text-[18px] font-[500]">Shipping Address</h5>
      <br />
      <form>
        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Full Name</label>
            <input
              type="text"
              value={user && user.name}
              required
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Email Address</label>
            <input
              type="email"
              value={user && user.email}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Phone Number</label>
            <input
              type="number"
              required
              value={user && user.phoneNumber}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Zip Code</label>
            <input
              type="number"
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Country</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>
              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">City</label>
            <select
              className="w-[95%] border h-[40px] rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>
              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex pb-3">
          <div className="w-[50%]">
            <label className="block pb-2">Address1</label>
            <input
              type="address"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-[95%]`}
            />
          </div>
          <div className="w-[50%]">
            <label className="block pb-2">Address2</label>
            <input
              type="address"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              required
              className={`${styles.input}`}
            />
          </div>
        </div>

        <div></div>
      </form>
      <h5
        className="text-[18px] cursor-pointer inline-block"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose From saved address
      </h5>
      {userInfo && (
        <div>
          {user &&
            user.addresses.map((item, index) => (
              <div className="w-full flex mt-1" key={index}>
                <input
                  type="checkbox"
                  className="mr-3"
                  checked={selectedAddress === item.addressType}
                  value={item.addressType}
                  onClick={() =>
                    setSelectedAddress(item.addressType) ||
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setZipCode(item.zipCode) ||
                    setCountry(item.country) ||
                    setCity(item.city)
                  }
                />
                <h2>{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  handleSubmit,
  totalPrice,
  shipping,
  subTotalPrice,
  couponCode,
  setCouponCode,
  discountPercentenge,
  userPoints,
  pointsDiscount,
  useRewardPoints,
  handlePointsToggle,
}) => {
  return (
    <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Subtotal:</h3>
        <h5 className="text-[18px] font-[600]">{subTotalPrice} BDT</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">Shipping:</h3>
        <h5 className="text-[18px] font-[600]">{shipping.toFixed(2)} BDT</h5>
      </div>
      <br />
      <div className="flex justify-between">
        <h3 className="text-[16px] font-[400] text-[#000000a4]">
          Coupon Discount:
        </h3>
        <h5 className="text-[18px] font-[600]">
          - {discountPercentenge ? discountPercentenge.toString() : 0} BDT
        </h5>
      </div>
      <br />
      {/* Reward points section */}
      <div className="mt-2 mb-4 border-t pt-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-[16px] font-[500] text-[#000000d4]">
              Your Reward Points:{" "}
              <span className="font-[600] text-[#f63b60]">{userPoints}</span>
            </h3>
            <p className="text-[12px] text-[#00000094]">
              (100 points = 1 BDT discount)
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="sr-only peer"
              checked={useRewardPoints}
              onChange={handlePointsToggle}
              disabled={userPoints < 1000}
            />
            <div
              className={`w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer ${
                useRewardPoints ? "peer-checked:bg-[#f63b60]" : ""
              } peer-disabled:bg-gray-300`}
            ></div>
            <span className="ml-3 text-sm font-medium text-gray-900">
              Use Points
            </span>
          </label>
        </div>
        {userPoints < 1000 && (
          <p className="text-[13px] text-[#f63b60] mt-1">
            Need at least 1000 points to redeem!
          </p>
        )}
        {useRewardPoints && pointsDiscount > 0 && (
          <div className="flex justify-between mt-2">
            <h3 className="text-[16px] font-[400] text-[#000000a4]">
              Points Discount:
            </h3>
            <h5 className="text-[18px] font-[600] text-[#f63b60]">
              - {pointsDiscount} BDT
            </h5>
          </div>
        )}
      </div>
      <div className="flex justify-between border-t border-b py-3">
        <h3 className="text-[16px] font-[500] text-[#000000a4]">Total:</h3>
        <h5 className="text-[18px] font-[600]">{totalPrice} BDT</h5>
      </div>
      <br />
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} h-[40px] pl-2`}
          placeholder="Coupoun code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          required
        />
        <input
          className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
          required
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
