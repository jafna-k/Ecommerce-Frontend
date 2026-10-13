import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Products from "./pages/Products";
import Cart from "./pages/Cart";
import AdminDashboard from "./pages/AdminDashboard";
import AdminCustomers from "./pages/AdminCustomers";
import AdminOrders from "./pages/AdminOrders";

function App() {
  return (
    <Routes>
      {/* Separate Admin Pages */}
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/customers" element={<AdminCustomers />} />
      <Route path="/admin/orders" element={<AdminOrders />} />

      {/* Customer Website */}
      <Route
        path="/*"
        element={
          <>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/cart" element={<Cart />} />
            </Routes>
            <Footer />
          </>
        }
      />
    </Routes>
  );
}

export default App;