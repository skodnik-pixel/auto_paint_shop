// frontend/src/components/cart/Cart.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Button, Spinner, Modal, Form, Alert } from 'react-bootstrap';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './Cart.css';

function Cart() {
    const [cart, setCart] = useState(null);
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);
    const [updating, setUpdating] = useState({});
    const navigate = useNavigate();

    // Загружаем корзину с сервера для авторизованных пользователей
    useEffect(() => {
        const loadCart = async () => {
            const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');
            if (!accessToken) {
                setLoading(false);
                return;
            }

            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
                const response = await fetch(`${apiUrl}/cart/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Cart data from API:', data); // Для отладки
                    
                    // API может вернуть список или объект с результатами
                    let cartData = null;
                    if (Array.isArray(data)) {
                        cartData = data.length > 0 ? data[0] : null;
                    } else if (data.results && Array.isArray(data.results)) {
                        cartData = data.results.length > 0 ? data.results[0] : null;
                    } else if (data.id) {
                        // Прямой объект корзины
                        cartData = data;
                    }
                    
                    if (cartData) {
                        setCart(cartData);
                        setCartItems(cartData.items || []);
                    } else {
                        setCart(null);
                        setCartItems([]);
                    }
                } else {
                    console.error('Error loading cart:', response.status, response.statusText);
                    setCart(null);
                    setCartItems([]);
                }
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
            } finally {
                setLoading(false);
            }
        };

        loadCart();

        // Слушаем событие обновления корзины
        const handleCartUpdate = () => {
            loadCart();
        };
        window.addEventListener('cartUpdated', handleCartUpdate);
        return () => window.removeEventListener('cartUpdated', handleCartUpdate);
    }, []);

    // Обновление количества товара на сервере
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1 || !cart) return;
        
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');
        if (!accessToken) return;

        setUpdating(prev => ({ ...prev, [itemId]: true }));

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            
            // Обновляем корзину через PATCH
            const response = await fetch(`${apiUrl}/cart/${cart.id}/`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    items: cartItems.map(item => 
                        item.id === itemId 
                            ? { id: item.id, quantity: newQuantity }
                            : { id: item.id, quantity: item.quantity }
                    )
                })
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                setCartItems(updatedCart.items || []);
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                const errorData = await response.json();
                console.error('Error updating quantity:', errorData);
                alert('Ошибка при обновлении количества товара');
            }
        } catch (error) {
            console.error('Ошибка обновления количества:', error);
            alert('Ошибка при обновлении количества товара');
        } finally {
            setUpdating(prev => ({ ...prev, [itemId]: false }));
        }
    };

    // Увеличить количество
    const increaseQuantity = (itemId, currentQuantity) => {
        updateQuantity(itemId, currentQuantity + 1);
    };

    // Уменьшить количество
    const decreaseQuantity = (itemId, currentQuantity) => {
        if (currentQuantity > 1) {
            updateQuantity(itemId, currentQuantity - 1);
        }
    };

    // Удаление товара из корзины
    const removeItem = async () => {
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');
        if (!accessToken || !itemToRemove || !cart) return;

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${apiUrl}/cart/remove_item/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify({
                    item_id: itemToRemove
                })
            });

            if (response.ok) {
                const updatedCart = await response.json();
                setCart(updatedCart);
                setCartItems(updatedCart.items || []);
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                const errorData = await response.json();
                console.error('Error removing item:', errorData);
                alert('Ошибка при удалении товара');
            }
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            alert('Ошибка при удалении товара');
        } finally {
            setShowModal(false);
            setItemToRemove(null);
        }
    };

    // Подтверждение удаления
    const confirmRemove = (itemId) => {
        setItemToRemove(itemId);
        setShowModal(true);
    };

    // Подсчёт общей суммы
    const getTotalPrice = () => {
        if (cart && cart.total_price !== undefined) {
            return parseFloat(cart.total_price).toFixed(2);
        }
        return cartItems.reduce((total, item) => {
            return total + (parseFloat(item.product.price) * item.quantity);
        }, 0).toFixed(2);
    };

    // Переход к оформлению заказа
    const proceedToCheckout = () => {
        if (cartItems.length === 0) return;
        // Просто переходим на checkout - там корзина загрузится с сервера
        navigate('/checkout');
    };

    // Проверка авторизации
    const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');
    if (!accessToken) {
        return (
            <Container className="my-5">
                <Alert variant="warning" className="text-center cart-auth-mission-failed">
                    <h4 className="cart-auth-mission-failed-title">MISSION FAILED</h4>
                    <p className="cart-auth-mission-failed-sub">Для просмотра корзины необходимо войти в систему</p>
                    <div className="mt-3">
                        <Button variant="primary" onClick={() => navigate('/login')} className="me-2">
                            Войти
                        </Button>
                        <Button variant="outline-primary" onClick={() => navigate('/register')}>
                            Зарегистрироваться
                        </Button>
                    </div>
                </Alert>
            </Container>
        );
    }

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
                                {cartItems.length === 0 ? (
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
                                                    {cartItems.map(item => (
                                                        <tr key={item.id}>
                                                            <td>
                                                                <div className="cart-product-info">
                                                                    {item.product?.image && (
                                                                        <img 
                                                                            src={item.product.image} 
                                                                            alt={item.product.name}
                                                                            className="cart-product-image"
                                                                        />
                                                                    )}
                                                                    <div className="cart-product-details">
                                                                        <h6 className="cart-product-name">{item.product?.name || 'Товар'}</h6>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="cart-price">{item.product?.price || 0} BYN</span>
                                                            </td>
                                                            <td>
                                                                <div className="cart-quantity-controls">
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        size="sm"
                                                                        onClick={() => decreaseQuantity(item.id, item.quantity)}
                                                                        disabled={item.quantity <= 1 || updating[item.id]}
                                                                        className="quantity-btn"
                                                                    >
                                                                        <FaMinus />
                                                                    </Button>
                                                                    <span className="quantity-display">{item.quantity}</span>
                                                                    <Button
                                                                        variant="outline-secondary"
                                                                        size="sm"
                                                                        onClick={() => increaseQuantity(item.id, item.quantity)}
                                                                        disabled={updating[item.id]}
                                                                        className="quantity-btn"
                                                                    >
                                                                        <FaPlus />
                                                                    </Button>
                                                                    {updating[item.id] && (
                                                                        <Spinner size="sm" className="ms-2" />
                                                                    )}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <span className="cart-total-price">
                                                                    {(parseFloat(item.product?.price || 0) * item.quantity).toFixed(2)} BYN
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
                        <Button variant="danger" onClick={removeItem}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default Cart;