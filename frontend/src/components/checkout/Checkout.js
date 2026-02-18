// frontend/src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaTruck, FaCreditCard } from 'react-icons/fa';
import './Checkout.css';

function Checkout() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true); // Начинаем с true для начальной загрузки
    const [submitting, setSubmitting] = useState(false);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const navigate = useNavigate();

    // Данные формы заказа
    const [orderData, setOrderData] = useState({
        // Личные данные
        firstName: '',
        lastName: '',
        phone: '',
        email: '',

        // Адрес доставки
        deliveryMethod: 'courier', // courier, pickup, post
        city: '',
        address: '',
        apartment: '',
        postalCode: '',

        // Способ оплаты
        paymentMethod: 'cash', // cash, card, transfer

        // Комментарий
        comment: ''
    });

    // Загружаем корзину с сервера и данные пользователя для оформления
    useEffect(() => {
        const loadCart = async () => {
            const accessToken = localStorage.getItem('access');
            if (!accessToken) {
                // Если не авторизован, перенаправляем на логин
                navigate('/login');
                return;
            }

            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';

                // Загружаем корзину
                const cartResponse = await fetch(`${apiUrl}/cart/`, {
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });

                if (cartResponse.ok) {
                    const data = await cartResponse.json();

                    // Универсальная обработка ответа (список, пагинация, объект)
                    let cartData = null;
                    if (Array.isArray(data)) {
                        cartData = data.length > 0 ? data[0] : null;
                    } else if (data.results && Array.isArray(data.results)) {
                        cartData = data.results.length > 0 ? data.results[0] : null;
                    } else if (data.id) {
                        cartData = data;
                    }

                    if (cartData && cartData.items && cartData.items.length > 0) {
                        // Преобразуем формат корзины с сервера в формат для checkout
                        const cartItems = cartData.items.map(item => ({
                            id: item.product.id,
                            name: item.product.name,
                            price: item.product.price,
                            image: item.product.image,
                            slug: item.product.slug,
                            quantity: item.quantity
                        }));
                        setCart(cartItems);
                    } else {
                        // Если корзина пуста, перенаправляем в каталог
                        navigate('/catalog');
                        return;
                    }
                } else {
                    navigate('/catalog');
                    return;
                }

                // Загружаем данные пользователя для предзаполнения формы
                const userData = localStorage.getItem('user');
                if (userData) {
                    try {
                        const user = JSON.parse(userData);
                        setOrderData(prev => ({
                            ...prev,
                            email: user.email || prev.email,
                            phone: user.phone || prev.phone,
                            // Можно добавить firstName и lastName, если они есть в профиле
                        }));
                    } catch (e) {
                        console.error('Ошибка парсинга данных пользователя:', e);
                    }
                }
            } catch (error) {
                console.error('Ошибка загрузки корзины:', error);
                navigate('/catalog');
            } finally {
                setLoading(false);
            }
        };

        loadCart();
    }, [navigate]);

    // Обработка изменений в форме
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setOrderData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Подсчёт общей суммы
    const getTotalPrice = () => {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
    };

    // Подсчёт стоимости доставки
    const getDeliveryPrice = () => {
        switch (orderData.deliveryMethod) {
            case 'courier':
                return orderData.city.toLowerCase().includes('минск') ? 5.00 : 10.00;
            case 'post':
                return 8.00;
            case 'pickup':
                return 0.00;
            default:
                return 0.00;
        }
    };

    // Итоговая сумма с доставкой
    const getFinalPrice = () => {
        return (parseFloat(getTotalPrice()) + getDeliveryPrice()).toFixed(2);
    };

    // Оформление заказа
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const accessToken = localStorage.getItem('access');
            if (!accessToken) {
                alert('Необходимо войти в систему');
                navigate('/login');
                return;
            }
            // Формируем адрес одной строкой
            const fullAddress = `${orderData.city}, ${orderData.address}${orderData.apartment ? ', кв. ' + orderData.apartment : ''}`;

            // Создаём объект заказа (плоская структура для сервера)
            const orderPayload = {
                phone: orderData.phone,
                address: fullAddress,
                delivery_method: orderData.deliveryMethod,
                payment_method: orderData.paymentMethod,
                comment: orderData.comment
            };

            // Для локального хранения (если нужно) оставляем полную структуру
            const localOrder = {
                id: Date.now(),
                items: cart,
                customerInfo: {
                    firstName: orderData.firstName,
                    lastName: orderData.lastName,
                    phone: orderData.phone,
                    email: orderData.email
                },
                delivery: {
                    method: orderData.deliveryMethod,
                    address: fullAddress,
                    postalCode: orderData.postalCode,
                    cost: getDeliveryPrice()
                },
                payment: {
                    method: orderData.paymentMethod
                },
                comment: orderData.comment,
                totalPrice: getFinalPrice(),
                status: 'pending',
                createdAt: new Date().toISOString()
            };

            // Сохраняем заказ в localStorage (для совместимости, если нужно)
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.unshift(localOrder);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Отправка заказа на сервер
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            console.log('Sending order to:', `${apiUrl}/orders/orders/create_order/`);

            const response = await fetch(`${apiUrl}/orders/orders/create_order/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`
                },
                body: JSON.stringify(orderPayload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Server Error:', errorData);
                throw new Error(JSON.stringify(errorData) || 'Ошибка сервера при создании заказа');
            }

            const responseData = await response.json();
            console.log('Order created successfully:', responseData);

            // Очищаем корзину на сервере
            try {
                await fetch(`${apiUrl}/cart/clear/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
                window.dispatchEvent(new Event('cartUpdated'));
            } catch (error) {
                console.error('Ошибка очистки корзины:', error);
            }

            // Очищаем локальную корзину
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutCart');

            setOrderPlaced(true);
            setSubmitting(false);

            // Перенаправление
            setTimeout(() => {
                navigate('/profile');
            }, 3000);

        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            alert(`Ошибка при оформлении заказа: ${error.message}`);
            setSubmitting(false);
        }
    };

    // Показываем загрузку при начальной загрузке корзины
    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Загрузка корзины...</p>
            </Container>
        );
    }

    if (orderPlaced) {
        return (
            <Container className="my-5">
                <div className="text-center">
                    <div className="order-success">
                        <FaShoppingCart size={80} className="text-success mb-4" />
                        <h2 className="text-success">Заказ успешно оформлен!</h2>
                        <p className="lead">Спасибо за покупку! Мы свяжемся с вами в ближайшее время.</p>
                        <p>Перенаправление в личный кабинет...</p>
                        <Spinner animation="border" variant="success" />
                    </div>
                </div>
            </Container>
        );
    }

    return (
        <div className="checkout-page">
            <Container className="my-5">
                <Row>
                    <Col>
                        <h2 className="mb-4">
                            <FaShoppingCart className="me-2" />
                            Оформление заказа
                        </h2>
                    </Col>
                </Row>

                <Form onSubmit={handleSubmit}>
                    <Row>
                        {/* Левая колонка - форма заказа */}
                        <Col lg={8}>
                            {/* Личные данные */}
                            <Card className="checkout-card mb-4">
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <FaUser className="me-2" />
                                        Личные данные
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Имя *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="firstName"
                                                    value={orderData.firstName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Введите ваше имя"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Фамилия *</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    name="lastName"
                                                    value={orderData.lastName}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="Введите вашу фамилию"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Телефон *</Form.Label>
                                                <Form.Control
                                                    type="tel"
                                                    name="phone"
                                                    value={orderData.phone}
                                                    onChange={handleInputChange}
                                                    required
                                                    placeholder="+375 (29) 123-45-67"
                                                />
                                            </Form.Group>
                                        </Col>
                                        <Col md={6}>
                                            <Form.Group className="mb-3">
                                                <Form.Label>Email</Form.Label>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    value={orderData.email}
                                                    onChange={handleInputChange}
                                                    placeholder="example@mail.ru"
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>

                            {/* Доставка */}
                            <Card className="checkout-card mb-4">
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <FaTruck className="me-2" />
                                        Способ доставки
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            name="deliveryMethod"
                                            value="courier"
                                            checked={orderData.deliveryMethod === 'courier'}
                                            onChange={handleInputChange}
                                            label="Курьерская доставка (Минск - 5 BYN, другие города - 10 BYN)"
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="deliveryMethod"
                                            value="post"
                                            checked={orderData.deliveryMethod === 'post'}
                                            onChange={handleInputChange}
                                            label="Почтовая доставка (8 BYN)"
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="deliveryMethod"
                                            value="pickup"
                                            checked={orderData.deliveryMethod === 'pickup'}
                                            onChange={handleInputChange}
                                            label="Самовывоз (бесплатно)"
                                        />
                                    </Form.Group>

                                    {orderData.deliveryMethod !== 'pickup' && (
                                        <Row>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Город *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="city"
                                                        value={orderData.city}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="Минск"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={6}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Индекс</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="postalCode"
                                                        value={orderData.postalCode}
                                                        onChange={handleInputChange}
                                                        placeholder="220000"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={8}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Адрес *</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="address"
                                                        value={orderData.address}
                                                        onChange={handleInputChange}
                                                        required
                                                        placeholder="ул. Примерная, д. 1"
                                                    />
                                                </Form.Group>
                                            </Col>
                                            <Col md={4}>
                                                <Form.Group className="mb-3">
                                                    <Form.Label>Квартира</Form.Label>
                                                    <Form.Control
                                                        type="text"
                                                        name="apartment"
                                                        value={orderData.apartment}
                                                        onChange={handleInputChange}
                                                        placeholder="123"
                                                    />
                                                </Form.Group>
                                            </Col>
                                        </Row>
                                    )}
                                </Card.Body>
                            </Card>

                            {/* Оплата */}
                            <Card className="checkout-card mb-4">
                                <Card.Header>
                                    <h5 className="mb-0">
                                        <FaCreditCard className="me-2" />
                                        Способ оплаты
                                    </h5>
                                </Card.Header>
                                <Card.Body>
                                    <Form.Group className="mb-3">
                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            value="cash"
                                            checked={orderData.paymentMethod === 'cash'}
                                            onChange={handleInputChange}
                                            label="Наличными при получении"
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            value="card"
                                            checked={orderData.paymentMethod === 'card'}
                                            onChange={handleInputChange}
                                            label="Банковской картой онлайн"
                                            className="mb-2"
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="paymentMethod"
                                            value="transfer"
                                            checked={orderData.paymentMethod === 'transfer'}
                                            onChange={handleInputChange}
                                            label="Банковский перевод"
                                        />
                                    </Form.Group>

                                    <Form.Group className="mb-0">
                                        <Form.Label>Комментарий к заказу</Form.Label>
                                        <Form.Control
                                            as="textarea"
                                            rows={3}
                                            name="comment"
                                            value={orderData.comment}
                                            onChange={handleInputChange}
                                            placeholder="Дополнительная информация по заказу..."
                                        />
                                    </Form.Group>
                                </Card.Body>
                            </Card>
                        </Col>

                        {/* Правая колонка - сводка заказа */}
                        <Col lg={4}>
                            <Card className="checkout-summary">
                                <Card.Header>
                                    <h5 className="mb-0">Ваш заказ</h5>
                                </Card.Header>
                                <Card.Body>
                                    {/* Товары */}
                                    <div className="order-items mb-3">
                                        {cart.map(item => (
                                            <div key={item.id} className="order-item">
                                                <div className="item-info">
                                                    <h6 className="item-name">{item.name}</h6>
                                                    <div className="item-details">
                                                        {item.quantity} шт. × {item.price} BYN
                                                    </div>
                                                </div>
                                                <div className="item-total">
                                                    {(item.price * item.quantity).toFixed(2)} BYN
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Итоги */}
                                    <div className="order-totals">
                                        <div className="total-line">
                                            <span>Товары:</span>
                                            <span>{getTotalPrice()} BYN</span>
                                        </div>
                                        <div className="total-line">
                                            <span>Доставка:</span>
                                            <span>{getDeliveryPrice().toFixed(2)} BYN</span>
                                        </div>
                                        <div className="total-line final-total">
                                            <span>Итого:</span>
                                            <span>{getFinalPrice()} BYN</span>
                                        </div>
                                    </div>

                                    {/* Кнопка оформления */}
                                    <Button
                                        type="submit"
                                        variant="success"
                                        size="lg"
                                        className="w-100 mt-3 order-btn"
                                        disabled={submitting || loading}
                                    >
                                        {submitting ? (
                                            <>
                                                <Spinner
                                                    as="span"
                                                    animation="border"
                                                    size="sm"
                                                    role="status"
                                                    aria-hidden="true"
                                                    className="me-2"
                                                />
                                                Оформление...
                                            </>
                                        ) : (
                                            'Оформить заказ'
                                        )}
                                    </Button>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
}

export default Checkout;