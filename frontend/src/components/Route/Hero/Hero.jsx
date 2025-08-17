import React from "react";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat bg-cover ${styles.noramlFlex}`}
      style={{
        backgroundImage:
          "url(https://img.freepik.com/free-photo/christmas-present-shopping-cart_24837-517.jpg?t=st=1742318108~exp=1742321708~hmac=c7aeea694c8cf44ab65e6dbae05625d847c27e40e4fbc199fdd5d653f1ff8d6b&w=1380)",
      }}
    >
      <div className={`${styles.section} w-[90%] 800px:w-[60%]`}>
        <h1 className="text-[35px] leading-[1.2] 800px:text-[60px] text-[#3d3a3a] font-[600] capitalize">
          Gadget Mart
        </h1>
        <p className="pt-5 text-[16px] font-[Poppins] font-[400] text-[#000000ba]">
          Whether you're building your dream PC, upgrading your gear, or looking
          for the latest gadgets, we've got <br /> everything 
          you need from powerful GPUs to sleek monitors, top of the line RAM,
          and more. Explore our <br /> wide range of high 
          quality tech products and find the perfect fit for your needs. Let's
          power up your tech world!
        </p>
        <Link to="/products" className="inline-block">
          <div className={`${styles.button} mt-5`}>
            <span className="text-[#fff] text-[18px]">Shop Now</span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;
