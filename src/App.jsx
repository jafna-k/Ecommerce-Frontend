
import { Routes, Route, useLocation } from "react-router-dom";

// Website pages
import Home from "./website/pages/Home";
import Products from "./website/pages/Products";
import ProductDetails from "./website/pages/ProductsDetails";
import Cart from "./website/pages/Cart";
import Login from "./website/pages/Login";
import Register from "./website/pages/Register";
import Checkout from "./website/pages/Checkout";
import Orders from "./website/pages/Orders";
import Profile from "./website/pages/Profile";
import OrderDetails from "./website/pages/OrderDetails";

// Website components
import Navbar from "./website/components/Navbar";
import Footer from "./website/components/Footer";

// Admin layout and pages
import DashboardLayout from "./Dashboard/components/DashboardLayout";
import AdminOrderDetails from "./Dashboard/pages/AdminOrderDetails";
import AdminCustomers from "./Dashboard/pages/AdminCustomers";
import AdminDashboard from "./Dashboard/pages/AdminDashboard";
import AdminCategories from "./Dashboard/pages/AdminCategories";
import AdminProduct from "./Dashboard/pages/AdminProduct";
import AdminOrders from "./Dashboard/pages/AdminOrders";
import Inventory from "./Dashboard/pages/Inventory";
import AdminProductVariants from "./Dashboard/pages/AdminProductVariants";

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <>
      {!isAdminRoute && <Navbar />}

      <Routes>
        {/* Customer Website */}
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/orders/:id" element={<OrderDetails />} />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<DashboardLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="products" element={<AdminProduct />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetails />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="category" element={<AdminCategories />} />
          <Route path="variants" element={<AdminProductVariants />} />
        </Route>
      </Routes>

      {!isAdminRoute && <Footer />}
    </>
  );
}

export default App;
