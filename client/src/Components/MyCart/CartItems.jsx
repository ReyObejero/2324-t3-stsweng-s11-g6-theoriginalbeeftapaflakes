import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import './CartItems.css';
import addIcon from '../../Assets/add.png';
import minusIcon from '../../Assets/minus.png';
import deleteIcon from '../../Assets/delete.png';
import { Link } from 'react-router-dom';
import { CARTS_URL, PRODUCT_URL, ORDERS_URL } from '../../API/constants';
import axiosInstance from '../../API/axiosInstance.js';

const CartItems = () => {
	const [cart, setCart] = useState(null);
	const [loading, setLoading] = useState(true);
	const [products, setProducts] = useState([]);
	const [subtotal, setSubtotal] = useState(0);

	useEffect(() => {
		const fetchCartItems = async () => {
			try {
				const response = await axiosInstance.get(`${CARTS_URL}/me`, {
					headers: {
						'Content-Type': 'application/json',
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
				const responses = await Promise.all(
					productIds.map(productId =>
						axiosInstance.get(`${PRODUCT_URL}/${productId}`, {
							headers: {
								'Content-Type': 'application/json',
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
			const response = await axiosInstance.delete(`${CARTS_URL}/remove/${id}`, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status !== 200) {
				throw new Error('Failed to remove item from cart');
			}

			const updatedCart = cartItems.filter(item => item._id !== id);
			setCart({ ...cart, cartItems: updatedCart });
		} catch (error) {
			console.error('Error removing item from cart:', error);
		}
	};

	const handleQuantityChange = async (id, change) => {
		try {
			const cartItem = cartItems.find(item => item._id === id);
			if (!cartItem) return;

			const newQuantity = cartItem.quantity + change;

			if (newQuantity <= 0) {
				await handleDelete(id);
				return;
			}

			const response = await axiosInstance.put(`${CARTS_URL}/update/${id}`, {
				newQuantity,
			}, {
				headers: {
					'Content-Type': 'application/json',
				},
			});

			if (response.status !== 200) {
				throw new Error('Failed to update quantity');
			}

			const updatedCartItems = cartItems.map(item =>
				item._id === id ? { ...item, quantity: newQuantity } : item
			);
			setCart({ ...cart, cartItems: updatedCartItems });
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

		try {
			const response = await fetch("https://tobtf.onrender.com/api/orders/addOrder", {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId: "someUserId", currentDate: new Date() }),
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
									const imageUrl = product ? product.image : " ";
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
