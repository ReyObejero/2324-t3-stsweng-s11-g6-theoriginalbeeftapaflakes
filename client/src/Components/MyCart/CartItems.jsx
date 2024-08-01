import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import prod from '../../Assets/flakes.png';
import './CartItems.css';
import addIcon from '../../Assets/add.png';
import minusIcon from '../../Assets/minus.png';
import deleteIcon from '../../Assets/delete.png';
import { Link } from 'react-router-dom';
import { CARTS_URL, PRODUCT_URL, ORDERS_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance.js';
import Cart from '../Views/Cart/Cart.jsx';
import { decodeToken } from 'react-jwt';

const CartItems = () => {
  const [cart, setCart] = useState();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0);

  useEffect(() => {
    const fetchCartItems = async () => {
      const token = localStorage.getItem('jwt');
      try {
        const response = await axiosInstance.get(`${CARTS_URL}/`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch cart items');
        }

        setCart(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cart items:', error);
        setLoading(false);
      }
      
    };

    fetchCartItems();
  }, []);

  useEffect(() => {
    const fetchProductDetails = async () => {
      if (!cart) return;

      const productIds = cart.cartItems.map(item => item.productId);
      try {
        const token = localStorage.getItem('jwt');
        const responses = await Promise.all(
          productIds.map(productId =>
            axiosInstance.get(`${PRODUCT_URL}/${productId}`, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            })
          )
        );
        const productsData = responses.map(response => response.data);
        setProducts(productsData);
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [cart]);

  const cartItems = cart ? cart.cartItems : [];

  const [showModal, setShowModal] = useState(false);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('jwt');
      const response = await axiosInstance.delete(`${CARTS_URL}/remove/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to remove item from cart');
      }
  
      // Filter out the deleted item from the cartItems state
      const updatedCart = cartItems.filter(item => item._id !== id);
      setCart({ ...cart, cartItems: updatedCart }); // Update cart with the new cartItems
    } catch (error) {
      console.error('Error removing item from cart:', error);
    }
  };

  const handleQuantityChange = async (id, change) => {
    try {
      const token = localStorage.getItem('jwt');
      const cartItem = cartItems.find(item => item._id === id);
      if (!cartItem) return; // Guard against undefined cartItem
  
      const newQuantity = cartItem.quantity + change;
  
      if (newQuantity <= 0) {
        // If new quantity is zero or negative, remove the item from the cart
        await handleDelete(id);
        return;
      }
  
      const response = await axiosInstance.put(`${CARTS_URL}/update/${id}`, {
        newQuantity,
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (response.status !== 200) {
        throw new Error('Failed to update quantity');
      }
  
      // Update the local state with the updated quantity
      const updatedCartItems = cartItems.map(item =>
        item._id === id ? { ...item, quantity: newQuantity } : item
      );
      setCart({ ...cart, cartItems: updatedCartItems }); // Update cart with the updated cartItems
    } catch (error) {
      console.error('Error updating quantity:', error);
    }
  };

  const handleCheckout = () => {
    document.body.classList.add('modal-open');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    document.body.classList.remove('modal-open');
    setShowModal(false);
  };

  const handleConfirmCheckout = async () => {
    document.body.classList.remove('modal-open');
    setShowModal(false);

    const token = localStorage.getItem('jwt');

    if (!token) {
      console.error('JWT token not found in localStorage');
      return;
    }

    const decoded_token = decodeToken(localStorage.getItem('jwt'));
    const userId = decoded_token._id;
    const currentDate = new Date();

    try {
      const response = await fetch("https://tobtf.onrender.com/api/orders/addOrder", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, currentDate }),
      });

      if (response.status === 200) {
        window.location.href = "/cos";
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add order');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const subtotal = cartItems.reduce((acc, item) => {
      return acc + (parseFloat(item.price?.$numberDecimal ?? 0) * item.quantity);
    }, 0);
    
    setSubtotal(subtotal);
  }, [cartItems]);

  const shippingCost = 50;
  const total = parseFloat(subtotal) + parseFloat(shippingCost);

  return (
    <div className="grid-container">
      <div className="elements-container">
        <div className="grid-item">
          <div className="cart-container">
            <div className="flex-container">
              <div className="items-container">
                {cartItems.map((item, index) => {
                  const product = products.find(product => product._id === item.productId);
                  const imageUrl = product ? product.image : " "; // Default image if product not found
                  return (
                    <div key={index} className="item">
                      <img src={`https://tobtf.onrender.com/${imageUrl}`} alt={item.name} />
                      <div className="item-details">
                        <p> {item.name} [{item.selectedPackage}]</p>
                        <div className="price-quantity-container">
                          <div className="price-container">
                            <p> {parseFloat(item.price.$numberDecimal).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
                          </div>
                          <div className="quantity-container">
                            <button className="quantity-btn" onClick={() => handleQuantityChange(item._id, -1)}>
                              <img src={minusIcon} alt="minus" />
                            </button>
                            <div className="quantity-value">{item.quantity}</div>
                            <button className="quantity-btn" onClick={() => handleQuantityChange(item._id, 1)}>
                              <img src={addIcon} alt="add" />
                            </button>
                          </div>
                          <button className="delete-btn" onClick={() => handleDelete(item._id)}>
                            <img src={deleteIcon} alt="delete" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
                <Link to={'/products'}>
                  <button className="btn add-btn">Add Item</button>
                </Link>
              </div>
              <div className="checkout-container">
                <h2>Order Summary</h2>
                <h3>In cart:</h3>
                <div className="cart-items">
                  {cartItems.map((item, index) => (
                    <p key={index}>
                      {item.name} {item.selectedPackage} ({item.quantity} * {parseFloat(item.price.$numberDecimal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' }))}) - {parseFloat(item.price.$numberDecimal * item.quantity).toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}
                    </p>
                  ))}
                </div>
                <div className="totals">
                  <p><strong>Subtotal:</strong> {subtotal.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
                  <p><strong>Shipping Cost:</strong> {shippingCost.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
                  <p><strong>Total:</strong> {total.toLocaleString('en-PH', { style: 'currency', currency: 'PHP' })}</p>
                </div>
                <button className="btn checkout-btn" onClick={handleCheckout}>Checkout</button>
              </div>
            </div>
          </div>
        </div>
      </div>
            
      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header>
          <Modal.Title className="cart-modal-title-center">
            <h2>Confirm Checkout</h2>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="cart-modal-body-center">
          <p>Are you sure you want to proceed to the checkout page?</p>
        </Modal.Body>
        <Modal.Footer className="cart-modal-footer-center">
          <button className="modal-save-inventory-btn" onClick={handleCloseModal}>Cancel</button>
          <button className="modal-cancel-inventory-btn" onClick={handleConfirmCheckout}>Confirm</button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CartItems;
