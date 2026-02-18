// frontend/src/components/cart/Cart.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Modal } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const navigate = useNavigate();

    // Загружаем корзину из localStorage (так как кнопка "Купить" сохраняет туда)
    useEffect(() => {
        try {
            const cartData = JSON.parse(localStorage.getItem('cart') || '[]');
            setCart(cartData);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки корзины:', error);
            setCart([]);
            setLoading(false);
        }
    }, []);

    // Обновление количества товара
    const updateQuantity = (productId, newQuantity) => {
        if (newQuantity < 1) return;
        
        const updatedCart = cart.map(item => 
            item.id === productId 
                ? { ...item, quantity: newQuantity }
                : item
        );
        
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Увеличить количество
    const increaseQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        if (item) {
            updateQuantity(productId, item.quantity + 1);
        }
    };

    // Уменьшить количество
    const decreaseQuantity = (productId) => {
        const item = cart.find(item => item.id === productId);
        if (item && item.quantity > 1) {
            updateQuantity(productId, item.quantity - 1);
        }
    };

    // Удаление товара из корзины
    const removeItem = (productId) => {
        const updatedCart = cart.filter(item => item.id !== productId);
        setCart(updatedCart);
        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setShowModal(false);
        setItemToRemove(null);
        window.dispatchEvent(new Event('cartUpdated'));
    };

    // Подтверждение удаления
    const confirmRemove = (productId) => {
        setItemToRemove(productId);
        setShowModal(true);
    };

    // Подсчёт общей суммы
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Переход к оформлению заказа
    const proceedToCheckout = () => {
        if (cart.length === 0) return;
        
        // Сохраняем корзину для оформления заказа
        localStorage.setItem('checkoutCart', JSON.stringify(cart));
        navigate('/checkout');
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Загрузка корзины...</p>
            </Container>
        );
    }

    return (
        <div className="cart-page">
            <Container className="my-5">
                <Row>
                    <Col>
                        <Card className="cart-card">
                            <Card.Header>
                                <h2 className="mb-0">
                                    <FaShoppingCart className="me-2" />
                                    Корзина
                                </h2>
                            </Card.Header>
                            <Card.Body>
                                {cart.length === 0 ? (
                                    <div className="empty-cart text-center py-5">
                                        <FaShoppingCart size={60} className="text-muted mb-3" />
                                        <h4>Корзина пуста</h4>
                                        <p className="text-muted">Добавьте товары в корзину, чтобы оформить заказ</p>
                                        <Button 
                                            variant="primary" 
                                            onClick={() => navigate('/catalog')}
                                            className="mt-3"
                                        >
                                            Перейти в каталог
                                        </Button>
                                    </div>
                                ) : (
                                    <>
                                        {/* Таблица товаров */}
                                        <div className="cart-table-wrapper">
                                            <Table className="cart-table">
                                                <thead>
                                                    <tr>
                                                        <th>Товар</th>
                                                        <th>Цена</th>
                                                        <th>Количество</th>
                                                        <th>Итого</th>
                                                        <th>Действия</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {cart.map(item => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <div className="cart-product-info">
                                                                    {item.image && (
                                                                        <img 
                                                                            src={item.image} 
                                                                            alt={item.name}
                                                                            className="cart-product-image"
                                                                        />
                                                                    )}
                                                                    <div className="cart-product-details">
                                                                        <h6 className="cart-product-name">{item.name}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="cart-price">{item.price} BYN</span>
                                                            </td>
                                                            <td>
                                                                <div className="cart-quantity-controls">
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        size="sm"
                                                                        onClick={() => decreaseQuantity(item.id)}
                                                                        disabled={item.quantity <= 1}
                                                                        className="quantity-btn"
                                                                    >
                                                                        <FaMinus />
                                                                    </Button>
                                                                    <span className="quantity-display">{item.quantity}</span>
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        size="sm"
                                                                        onClick={() => increaseQuantity(item.id)}
                                                                        className="quantity-btn"
                                                                    >
                                                                        <FaPlus />
                                                                    </Button>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="cart-total-price">
                                                                    {(item.price * item.quantity).toFixed(2)} BYN
                                                                </span>
                                                            </td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    size="sm"
                                                                    onClick={() => confirmRemove(item.id)}
                                                                    className="remove-btn"
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>

                                        {/* Итоговая сумма и кнопка оформления */}
                                        <div className="cart-summary">
                                            <Row className="align-items-center">
                                                <Col md={6}>
                                                    <div className="cart-total">
                                                        <h4>
                                                            Общая сумма: <span className="total-amount">{getTotalPrice()} BYN</span>
                                                        </h4>
                                                    </div>
                                                </Col>
                                                <Col md={6} className="text-end">
                                                    <Button
                                                        variant="success"
                                                        size="lg"
                                                        onClick={proceedToCheckout}
                                                        className="checkout-btn"
                                                    >
                                                        Оформить заказ
                                                    </Button>
                                                </Col>
                                            </Row>
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Модальное окно подтверждения удаления */}
                <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтверждение удаления</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Вы уверены, что хотите удалить этот товар из корзины?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={() => removeItem(itemToRemove)}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default Cart;