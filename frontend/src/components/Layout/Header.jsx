import React, { useState } from "react";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import {
  AiOutlineHeart,
  AiOutlineAudio,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { categoriesData } from "../../static/data";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { CgProfile } from "react-icons/cg";
import Cart from "../Cart/Cart";
import WishList from "../WishList/WishList";
import { useSelector } from "react-redux";
import { set } from "mongoose";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-toastify";



const Header = ({ activeHeading }) => {
  const { user } = useAuthStore();
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const { allProducts } = useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishlist, setOpenWishlist] = useState(false);
  const [listening, setListening] = useState(false);

  console.log("Header products are", allProducts);


  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    searchProducts(term);

    if (term) {
      const filteredProducts = allProducts && allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchData(filteredProducts);
    } else {
      setSearchData([]);
    }
  };

  const searchProducts = (term) => {
    if (term) {
      const filteredProducts = allProducts.filter((product) =>
        product.name.toLowerCase().includes(term.toLowerCase())
      );
      setSearchData(filteredProducts);
    } else {
      setSearchData([]);
    }
  };

  window.addEventListener("scroll", () => {
    if (window.scrollY > 70) {
      setActive(true);
    } else {
      setActive(false);
    }
  });

  const handleVoiceSearch = () => {
    if (!("webkitSpeechRecognition" in window)) {
      alert("Your browser does not support speech recognition.");
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.continuous = false;

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event) => {
      const voiceText = event.results[0][0].transcript;
      setSearchTerm(voiceText);
      searchProducts(voiceText);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };


  // console.log("Header products are", allProducts);
  // console.log("Header wishlist is", wishlist);
  // console.log("Header cart is", cart
  return (
    <>
      <div className={styles.section}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            {/* <Link to="/">
              <img
                src="https://shopo.quomodothemes.website/assets/images/logo.svg"
                alt=""
              />
            </Link>
            <h1 className="text-[35px] leading-[1.2] 800px:text-[40px] text-[#4B5320] font-[600] capitalize">
              GadgetMart
            </h1> */}
            <div>
              <Link to="/" onClick={() => window.location.reload()}>
                <h1 className="text-[35px] leading-[1.2] 800px:text-[30px] text-[#4B5320] font-[600] capitalize ">
                  GadgetMart
                </h1>
              </Link>
            </div>

          </div>

          {/* Search box */}
          <div className="w-[50%] relative ">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-[#006A4E] border-[2px] rounded-md"
            />
            {/* <AiOutlineSearch
              size={30}
              className="absolute right-2 top-1.5 cursor-pointer"
            /> */}

            <div>
              <AiOutlineAudio
                size={30}
                className={`absolute right-2 top-1.5 cursor-pointer ${listening ? "text-red-500" : "text-gray-700"}`}
                onClick={handleVoiceSearch}
              />
            </div>

            {/* Display search suggestions */}
            {searchData && searchData.length !== 0 ? (
              <div className="absolute min-h-[30vh]  bg-slate-50 shadow-sm-2 z-[9] p-4 ">
                {searchData &&
                  searchData.map((i, index) => {
                    return (
                      <Link to={`/product/${i._id}`} key={index}
                        onClick={() => {
                          setSearchTerm("");
                          setSearchData([]);
                        }}
                      >
                        <div className="w-full flex items-start py-3">
                          <img
                            src={`${i.images[0]?.url}`}
                            alt=""
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div className={styles.button}>
            <Link to="/shop-create">
              <h1 className="text-[#fff] flex items-center">
                Seller <IoIosArrowForward className="ml-1" />
              </h1>
            </Link>
          </div>
        </div>
      </div>
      <div
        className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null
          } transition hidden 800px:flex items-center justify-between w-full bg-[#006A4E] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.noramlFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button className="h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select none rounded-t-md">
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* navitems */}
          <div className={styles.noramlFlex}>
            <Navbar active={activeHeading} />
          </div>
          <div className="flex">
            <div className={styles.noramlFlex}>
              <div className="relative cursor-pointer mr-[15px]"
                onClick={() => {
                  if (user !== null) {
                    setOpenWishlist(true)
                  } else {
                    toast.error("Please login to view wishlist");
                  }
                }}>
                <AiOutlineHeart size={30} color="rgb(255 255 255/83%)" />
                {user != null && (
                  <span className="absolute right-0 top-0 rounded-full bg-[#00FF40] w-4 h-4 top right p-0 m-0 text-black font-mono text-[12px] leading-tight text-center">
                    {wishlist && wishlist.length}
                  </span>
                )}
              </div>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => {
                  if (user !== null) {
                    setOpenCart(true)
                  } else {
                    toast.error("Please login to view cart");
                  }
                }}
              >
                <AiOutlineShoppingCart size={30} color="rgb(255 255 255/83%)" />
                {user != null && (
                  <span className="absolute right-0 top-0 rounded-full bg-[#00FF40] w-4 h-4 top right p-0 m-0 text-black font-mono text-[12px] leading-tight text-center">
                    {cart && cart.length}
                  </span>
                )}
              </div>

              <div className="relative cursor-pointer mr-[15px]">
                {user === null ? (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255/83%)" />
                  </Link>
                ) : (
                  <Link to="/profilepage">
                    <img
                      src={`${user?.avatar?.url}`}
                      className="w-[35px] h-[35px] rounded-full"
                      alt=""
                    />
                  </Link>
                )}
              </div>
            </div>

            {/* Cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishlist popup */}
            {openWishlist ? <WishList setOpenWishlist={setOpenWishlist} /> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;
