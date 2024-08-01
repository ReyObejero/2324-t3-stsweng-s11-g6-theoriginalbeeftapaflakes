import './App.css';
import Collapsible from 'react-collapsible';
import Navbar from './Components/Navbar/Navbar.jsx';
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './Components/Views/Home/Home.jsx';
import Products from './Components/Views/ProductList_Views/ProductList_Views.jsx';
import ProductList from './Components/ProductList/ProductList.jsx';
import About from './Components/Views/About/About.jsx';
import ProductPage from './Components/Views/Products/ProductPage_Views.jsx';
import Login from './Components/Views/Login/Login_Views.jsx';
import Register from './Components/Views/Register/Register_Views.jsx';
import CreateAdmin from './Components/Views/CreateAdmin/CreateAdmin_Views.jsx';
import ForgotPassword from './Components/Views/ForgotPassword_Views/ForgotPassword_Views.jsx';
import Cart from './Components/Views/Cart/Cart.jsx';
import AdminDashboard from './Components/Views/Admin/Admin.jsx';
import OrderManagement from './Components/Views/OrderManagement/OrderManagement_Views.jsx';
import { decodeToken } from 'react-jwt';
import CheckoutandStatus from './Components/Views/CheckoutandStatus/CS.jsx';

function App() {
    const [token, setToken] = useState(localStorage.getItem('jwt'));
    const decodedToken = token ? decodeToken(token) : null;
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Initialize isLoggedIn state

    const isTokenExpired = (token) => {
        if (!token) {
            setIsLoggedIn(false); // Set isLoggedIn to false if there's no token
            return false;
        }
        setIsLoggedIn(true); // Set isLoggedIn to true if there's a token
        const expirationTime = decodedToken.exp * 1000;
        return Date.now() >= expirationTime;
    };

    // Function to handle logout
    const logout = () => {
        localStorage.removeItem('jwt'); // Clear token from storage
        setIsLoggedIn(false); // Set isLoggedIn to false when logging out
        alert('Your session has expired. You have been logged out.');
        window.location.href = '/login';
    };

    // Check token expiration on component mount and token change
    useEffect(() => {
        const handleTokenChange = () => {
            setToken(localStorage.getItem('jwt'));
        };

        window.addEventListener('storage', handleTokenChange);

        if (token && isLoggedIn) {
            logout(); // Token is expired, log out user
        } else if (token && decodedToken) {
            const expirationTime = decodedToken.exp * 1000;
            const timeToExpire = expirationTime - Date.now();
            if (timeToExpire > 0) {
                setTimeout(() => {
                    logout(); // Logout user after token expiration time
                }, timeToExpire);
            }
        }

        return () => {
            window.removeEventListener('storage', handleTokenChange);
        };
    }, [token]);

    return (
        <div className="App">
            <BrowserRouter>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products/:productId" element={<ProductPage />} />
                    <Route path="/products" element={<Products category="list" />} />
                    <Route path="/about/*" element={<About />} />
                    <Route path="/product-management" element={<AdminDashboard />} />
                    <Route path="/order-management" element={<OrderManagement />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/productlist" element={<ProductList />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/createadmin" element={<CreateAdmin />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path='/COS' element={<CheckoutandStatus />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
