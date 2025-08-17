import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import FloatingShape from "./components/floatingShape";
import React, { useState } from "react";
import axios from "axios";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import SignUpPage from "./pages/SignUpPage";
import LoginPage from "./pages/LoginPage";
import EmailVerificationPage from "./pages/EmailVerificationPage";
import DashboardPage from "./pages/DashboardPage";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import HomePage from "./pages/HomePage";
import ProductsPage from "./pages/ProductsPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import ShopCreatePage from "./pages/ShopCreatePage";
import SellerActivationPage from "./pages/SellerActivationPage";
import ShopHomePage from "./pages/Shop/ShopHomePage";
import ShopLoginPage from "./pages/ShopLoginPage.jsx";
import ProfilePage from "./pages/ProfilePage";
import ShopDashboardPage from "./pages/Shop/ShopDashboardPage";
import ShopCreateProduct from "./pages/Shop/ShopCreateProduct";
import ShopAllProducts from "./pages/Shop/ShopAllProducts";
import ShopCreateEvents from "./pages/Shop/ShopCreateEvents";
import ShopAllEvents from "./pages/Shop/ShopAllEvents";
import ShopAllCoupons from "./pages/Shop/ShopAllCoupons";
import ShopPreviewPage from "./pages/Shop/ShopPreviewPage.jsx";
import PaymentPage from "./pages/PaymentPage.jsx";
import OrderSuccessPage from "./pages/OrderSuccessPage.jsx";
import ShopAllOrders from "./pages/Shop/ShopAllOrders";
import ShopOrderDetails from "./pages/Shop/ShopOrderDetails.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage";
import TrackOrderPage from "./pages/TrackOrderPage.jsx";
import ShopAllRefunds from "./pages/Shop/ShopAllRefunds.jsx";
import ShopSettingsPage from "./pages/Shop/ShopSettingsPage.jsx";
//import ShopWithDrawMoneyPage from "./pages/Shop/ShopWithDrawMoneyPage.jsx";
import ShopInboxPage from "./pages/Shop/ShopInboxPage.jsx";


import LoadingSpinner from "./components/LoadingSpinner";
//import SellerProtectedRoute from "./routes/SellerProtectedRoute.js";
import Loader from "./components/Layout/Loader";

import { Toaster } from "react-hot-toast";
import { useAuthStore } from "./store/authStore";
import { useEffect } from "react";
import BestSellingPage from "./pages/BestSellingPage";
import EventsPage from "./pages/EventsPage";
import FAQPage from "./pages/FAQPage";
import { server } from "./server";
import { loadSeller, loadUser } from "./redux/actions/user";
import Store from "./redux/store";
import { useSelector } from "react-redux";
import CheckoutPage from "./pages/CheckoutPage.jsx";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { get } from "mongoose";
import ShopSettings from "./components/Shop/ShopSettings.jsx";
import ShopWithDrawMoneyPage from "./pages/Shop/ShopWithDrawMoneyPage.jsx";
import UserInbox from "./pages/UserInbox.jsx";
import ChatBot from "./pages/ChatBot.jsx";



// protect routes that require authentication
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user.isVerified) {
    return <Navigate to="/verify-email" replace />;
  }

  return children;
};

const SellerProtectedRoute = ({ isSeller, children }) => {
  if (!isSeller) {
    return <Navigate to={`/shop-login`} replace />;
  }
  return children;
};


// redirect authenticated users to the home page
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user } = useAuthStore();

  if (isAuthenticated && user.isVerified) {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  const { isCheckingAuth, checkAuth } = useAuthStore();
  const { isSeller } = useSelector((state) => state.seller);
  //const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    //const { data } = await axios.get(`${server}/api/payment/stripeapikey`);
    const {data} = "pk_test_51QbznEGWFtnm4a58mz7ymVUi0qubUuhpNDJydjsPMcGVVHTY0ydJkS2RR6dRzBoU04WI78ocCIKIgum85zzcAGxs00LhW2Z51m";
    //console.log("Stripe API Key: ", data.stripeApikey);
    setStripeApiKey(data.stripeApikey);
  }
  const stripeApiKey = "pk_test_51QbznEGWFtnm4a58mz7ymVUi0qubUuhpNDJydjsPMcGVVHTY0ydJkS2RR6dRzBoU04WI78ocCIKIgum85zzcAGxs00LhW2Z51m";
  useEffect(() => {
    checkAuth();
    Store.dispatch(loadSeller());
    getStripeApiKey();
  }, [checkAuth]);
  console.log("Stripe: ", stripeApiKey);

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div>
      <div>
        {/* <FloatingShape color='bg-green-500' size='w-64 h-64' top='-5%' left='10%' delay={0} />
			<FloatingShape color='bg-emerald-500' size='w-48 h-48' top='70%' left='80%' delay={5} />
			<FloatingShape color='bg-lime-500' size='w-32 h-32' top='40%' left='-10%' delay={2} /> */}

        {/* <BrowserRouter>
            {stripeApiKey && (
              <Elements stripe={loadStripe(stripeApiKey)}>
                <Routes>
                  <Route
                    path="/payment"
                    element={
                      <ProtectedRoute>
                        <PaymentPage />
                      </ProtectedRoute>
                    }
                  />
                </Routes>
              </Elements>
            )}
          </BrowserRouter> */}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/best-selling" element={<BestSellingPage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/product/:id" element={<ProductDetailsPage />} />
          <Route
            path="/chatbot"
            element={
                            <ChatBot />
            
            }
          />
          <Route
            path="profilepage"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/shop-create" element={<ShopCreatePage />} />
          <Route path="/shop-login" element={<ShopLoginPage />} />
          <Route path="/shop/preview/:id" element={<ShopPreviewPage />} />
          <Route
            path="/shopdashboard"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopDashboardPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-create-product"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopCreateProduct />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-create-event"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopCreateEvents />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-orders"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopAllOrders />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-products"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopAllProducts />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-events"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopAllEvents />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-coupons"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopAllCoupons />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shop/:id"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopHomePage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/order/:id"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopOrderDetails />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-refunds"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopAllRefunds />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopSettingsPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-withdraw-money"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopWithDrawMoneyPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/shopdashboard-messages"
            element={
              <SellerProtectedRoute isSeller={isSeller}>
                <ShopInboxPage />
              </SellerProtectedRoute>
            }
          />
          <Route
            path="/seller/activation/:activation_token"
            element={<SellerActivationPage />}
          />
          <Route path="/order/success" element={<OrderSuccessPage />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/inbox"
            element={
              <ProtectedRoute>
                <UserInbox />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/order/:id"
            element={
              <ProtectedRoute>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/track/order/:id"
            element={
              <ProtectedRoute>
                <TrackOrderPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment"
            element={
              <ProtectedRoute>
                {stripeApiKey ? (
                  <Elements stripe={loadStripe(stripeApiKey)}>
                    <PaymentPage />
                  </Elements>
                ) : (
                  <Loader /> // or any loading component you have
                )}
              </ProtectedRoute>
            }
          />

          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            }
          />
          <Route path="/verify-email" element={<EmailVerificationPage />} />
          <Route
            path="/forgot-password"
            element={
              <RedirectAuthenticatedUser>
                <ForgotPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />

          <Route
            path="/reset-password/:token"
            element={
              <RedirectAuthenticatedUser>
                <ResetPasswordPage />
              </RedirectAuthenticatedUser>
            }
          />
          {/* catch all routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="dark"
        />
        <Toaster />
      </div>
    </div>
  );
}

export default App;
