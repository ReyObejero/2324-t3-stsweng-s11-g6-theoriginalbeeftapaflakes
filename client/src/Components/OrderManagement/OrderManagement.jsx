import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import './OrderManagement.css';
import { decodeToken } from "react-jwt";
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
    const [filter, setFilter] = useState('All Orders');
    const [searchQuery, setSearchQuery] = useState('');
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedOrderDetails, setSelectedOrderDetails] = useState(null);
    const [orders, setOrders] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [token, setToken] = useState(localStorage.getItem('jwt'));
    const navigate = useNavigate();
    
    useEffect(() => {
    
        // Check if there is a valid token in the local storage
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login');
        } else {
            const decoded_token = decodeToken(token);
            const isAdmin = decoded_token.isAdmin;
            if (!isAdmin) {
                navigate('/');
            }
        }
    }, [token, navigate])

    useEffect(() => {
        // Display success message for 3 seconds then clear it
        if (successMessage) {
            const timeout = setTimeout(() => {
                setSuccessMessage('');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [successMessage]);

    useEffect(() => {
        // Display error message for 3 seconds then clear it
        if (errorMessage) {
            const timeout = setTimeout(() => {
                setErrorMessage('');
            }, 3000);
            return () => clearTimeout(timeout);
        }
    }, [errorMessage]);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await fetch(`https://tobtf.onrender.com/api/orders/fetchOrders`, {
                    headers: {
                        Authorization: `Bearer ${token}`, // If your API requires authorization
                    },
                });
                const data = await response.json();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders:', error);
            }
        };

        fetchOrders();
    }, [orders]);

    const fetchUser = async (userId) => {
        try {
            const response = await fetch(`https://tobtf.onrender.com/api/users/${userId}`);
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Failed to fetch users:', error);
        }
    };


    const StatusMessage = ({ message, type }) => (
        <div className={`status-message ${type}`}>{message}</div>
    );

    const openOrderDetailsModal = async (orderId) => {
        // Find the order details by orderId
        const orderDetails = orders.find(order => order._id === orderId);
        if (orderDetails) {
            if (orderDetails.userId) {
                try {
                    // Fetch user data asynchronously
                    const user = await fetchUser(orderDetails.userId);
                    // Add the username from the decoded token to the order details
                    const orderDetailsWithUsername = { ...orderDetails, username: user.username };
                    setSelectedOrderDetails(orderDetailsWithUsername);
                    setShowDetailsModal(true);
                } catch (error) {
                    console.error('Failed to fetch user:', error);
                }
            }
        }
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const today = new Date().toISOString(); // Get current date and time in ISO format
        try {
            // Assuming you're using Bearer token authentication
            const token = localStorage.getItem('jwt');
            const response = await fetch(`https://tobtf.onrender.com/api/orders/updateOrderStatus/${orderId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Include your auth token here
                },
                body: JSON.stringify({ status: newStatus, dateCompleted: today }),
            });

            if (!response.ok) {
                // If the server response is not ok, throw an error
                throw new Error('Failed to update order status');
            }
    
            

            const updatedOrders = orders.map((order) => {
                if (order._id === orderId) {
                    if (order.status === "Delivered") {
                        return { ...order, status: newStatus, dateCompleted: today };
                    }
                    return { ...order, status: newStatus, dateCompleted: null };
                }
                return order;
            });
    
            setOrders(updatedOrders);
            setSuccessMessage('Order status updated successfully.');
        } catch (error) {
            console.error(error);
            setErrorMessage('Failed to update order status');
        }
    };

    // Function to handle filter change
    const handleFilterChange = (e) => {
        setFilter(e.target.value);
    };

    // Function to handle search change
    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const formatDate = (isoDateString) => {
        if (!isoDateString) return '';
        const date = new Date(isoDateString);
        const formattedDate = date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
        return `${formattedDate} ${formattedTime}`;
    };

    return (
        <div className="order-grid-container">
            {successMessage && <StatusMessage message={successMessage} type="success" />}
            {errorMessage && <StatusMessage message={errorMessage} type="error" />}
            <div className="order-elements-container">
                <h1 className="order-dashboard-title">
                    Order Management
                    <div>
                        <span className="order-filter-search">
                            Search:
                            <input
                                type="text"
                                placeholder="Order ID"
                                value={searchQuery}
                                onChange={handleSearchChange}
                            />
                        </span>
                        <span className="order-filter-dropdown">
                            Filter:
                            <select
                                onChange={handleFilterChange}
                                value={filter}
                            >
                                <option value="All Orders">All Orders</option>
                                <option value="Payment Not Confirmed">Payment Not Confirmed</option>
                                <option value="Canceled">Canceled</option>
                                <option value="Paid">Paid</option>
                                <option value="Processing">Processing</option>
                                <option value="Packed">Packed</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                            </select>
                        </span>
                    </div>
                </h1>
                <div className="order-grid-product">
                    <div className="order-cart-container">
                        <div className="order-flex-container">
                            <div className="order-product-container">
                                {orders
                                    .filter(order => filter === "All Orders" || order.status === filter)
                                    .filter(order => searchQuery === '' || order._id.toLowerCase().includes(searchQuery.toLowerCase()))
                                    .map((order, index) => (
                                        <div key={index} className="item">
                                            <div className="order-product-details">
                                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                    <p>Order ID: {order._id}</p>
                                                </div>
                                                <div className="order-price-quantity-container">
                                                    <div className="order-price-container">
                                                        <div className="order-price-quantity">
                                                            <span>Status: </span>
                                                            <select
                                                                className="order-status-dropdown"
                                                                value={order.status}
                                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                            >
                                                                <option value="Payment Not Confirmed">Payment Not Confirmed</option>
                                                                <option value="Canceled">Canceled</option>
                                                                <option value="Paid">Paid</option>
                                                                <option value="Processing">Processing</option>
                                                                <option value="Packed">Packed</option>
                                                                <option value="Shipped">Shipped</option>
                                                                <option value="Delivered">Delivered</option>
                                                            </select>
                                                            <span style={{ marginLeft: '20px' }}>Order Details: </span>
                                                            <button
                                                                className="order-open-product-btn"
                                                                onClick={() => openOrderDetailsModal(order._id)}
                                                            >
                                                                OPEN
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showDetailsModal} onHide={() => setShowDetailsModal(false)}>
                <Modal.Header>
                    <Modal.Title className="order-modal-title-center">
                        <h2>Order Details</h2>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="order-modal-body-center">
                    {selectedOrderDetails ? (
                        <table className="order-modal-table">
                            <tbody>
                                <tr>
                                    <td>Customer Username: </td>
                                    <td>{selectedOrderDetails.username}</td>
                                </tr>
                                <tr>
                                    <td>Product Ordered: </td>
                                    <td>{selectedOrderDetails.product}</td>
                                </tr>
                                <tr>
                                    <td>Quantity: </td>
                                    <td>{selectedOrderDetails.quantity}</td>
                                </tr>
                                <tr>
                                    <td>Address: </td>
                                    <td>{selectedOrderDetails.address}</td>
                                </tr>
                                <tr>
                                    <td>Current Status: </td>
                                    <td>{selectedOrderDetails.status}</td>
                                </tr>
                                <tr>
                                    <td>Proof of Payment: </td>
                                    <td>
                                        {selectedOrderDetails.proofOfPayment && selectedOrderDetails.proofOfPayment.data ? (
                                            <img
                                                src={`data:${selectedOrderDetails.proofOfPayment.contentType};base64,${selectedOrderDetails.proofOfPayment.data}`}
                                                alt="Proof of Payment"
                                                style={{ width: '100px', height: '100px' }}
                                            />
                                        ) : 'No proof of payment uploaded'}
                                    </td>
                                </tr>
                                <tr>
                                    <td>Order Date Placed: </td>
                                    <td>{formatDate(selectedOrderDetails.datePlaced)}</td>
                                </tr>
                                <tr>
                                    <td>Order Date Completed: </td>
                                    <td>
                                        {formatDate(selectedOrderDetails.dateCompleted)}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    ) : (
                        <p>No order details</p>
                    )}
                </Modal.Body>
                <Modal.Footer className="order-modal-footer-center">
                    <button className="order-modal-cancel-inventory-btn" onClick={() => setShowDetailsModal(false)}>Close</button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrderManagement;
