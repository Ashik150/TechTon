import React from "react";
import {
  AiOutlineCreditCard,
  AiOutlineLogout,
  AiOutlineMessage,
  AiOutlineGift, // Import the Rewards (Gift) icon
} from "react-icons/ai";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { useNavigate } from "react-router-dom";
import { MdOutlineTrackChanges } from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { RiLockPasswordLine } from "react-icons/ri";

const ProfileSidebar = ({ setActive, active }) => {
  const navigate = useNavigate();

  return (
    <div className="w-full bg-white shadow-sm rounded-[10px] p-4 pt-8">
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 1 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Profile
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <HiOutlineShoppingBag size={20} color={active === 2 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 2 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Orders
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 3 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Refunds
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(4) || navigate("/inbox")}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 4 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Inbox
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 5 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Track Order
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(6)}
      >
        <RiLockPasswordLine size={20} color={active === 6 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 6 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Change Password
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 7 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Address
        </span>
      </div>
      <div
        className="flex items-center cursor pointer w-full mb-8"
        onClick={() => setActive(8)} // Set active to 8 for Rewards
      >
        <AiOutlineGift size={20} color={active === 8 ? "green" : ""} />
        <span
          className={`pl-3 ${
            active === 8 ? "text-[green]" : ""
          } 800px:block hidden`}
        >
          Rewards
        </span>
      </div>
      <div className="flex items-center cursor pointer w-full mb-8">
        <Link to="/dashboard" className="flex">
          <AiOutlineLogout size={20} />
          <span className="pl-3 800px:block hidden">Log out</span>
        </Link>
      </div>
    </div>
  );
};

export default ProfileSidebar;
