import React from "react";
import styles from "../../../styles/styles";
import { categoriesData } from "../../../static/data";
import { useNavigate } from "react-router-dom";
import Marquee from "react-fast-marquee";

const Categories = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className={`${styles.section} hidden sm:block`}>
        <div className="branding my-12 flex justify-between w-full shadow-sm bg-gradient-to-r from-green-700 via-green-800 to-green-900 p-5 rounded-md">
          <Marquee speed={50} pauseOnHover={true}>
            <p className="text-[18px] font-[Poppins] font-bold text-white px-5">
              Whether you're building your dream PC, upgrading your gear, or
              looking for the latest gadgets, we've got everything you need from
              powerful GPUs to sleek monitors, top-of-the-line RAM, and more.
              Explore our wide range of high-quality tech products and find the
              perfect fit for your needs. Let's power up your tech world! 🚀
            </p>
          </Marquee>
        </div>
      </div>

      <div
        className={`${styles.section} bg-white p-6 rounded-lg mb-12`}
        id="categories"
      >
        <div className="grid grid-cols-1 gap-[5px] md:grid-cols-2 md:gap-[10px] lg:grid-cols-4 lg:gap-[20px] xl:grid-cols-5 xl:gap-[30px]">
          {categoriesData &&
            categoriesData.map((i) => {
              const handleSubmit = (i) => {
                navigate(`/products?category=${i.title}`);
              };
              return (
                <div
                  className="w-full h-[100px] flex items-center justify-between cursor-pointer overflow-hidden"
                  key={i.id}
                  onClick={() => handleSubmit(i)}
                >
                  <h5 className={`text-[18px] leading-[1.3]`}>{i.title}</h5>
                  <img
                    src={i.image_Url}
                    className="w-[120px] object-cover"
                    alt=""
                  />
                </div>
              );
            })}
        </div>
      </div>
    </>
  );
};

export default Categories;
