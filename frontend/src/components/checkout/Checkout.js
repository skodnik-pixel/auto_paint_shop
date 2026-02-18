// frontend/src/components/Checkout.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaTruck, FaCreditCard } from 'react-icons/fa';
import './Checkout.css';

function Checkout() {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(false);
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

    // Загружаем корзину для оформления
    useEffect(() => {
        const checkoutCart = JSON.parse(localStorage.getItem('checkoutCart') || '[]');
        if (checkoutCart.length === 0) {
            // Если корзина пуста, перенаправляем в каталог
            navigate('/catalog');
            return;
        }
        setCart(checkoutCart);
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
        setLoading(true);

        try {
            // Создаём объект заказа
            const order = {
                id: Date.now(), // Временный ID
                items: cart,
                customerInfo: {
                    firstName: orderData.firstName,
                    lastName: orderData.lastName,
                    phone: orderData.phone,
                    email: orderData.email
                },
                delivery: {
                    method: orderData.deliveryMethod,
                    address: `${orderData.city}, ${orderData.address}${orderData.apartment ? ', кв. ' + orderData.apartment : ''}`,
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

            // Сохраняем заказ в localStorage (в реальном проекте отправляем на сервер)
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            orders.unshift(order);
            localStorage.setItem('orders', JSON.stringify(orders));

            // Добавляем товары в историю покупок
            const history = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
            cart.forEach(item => {
                const historyItem = {
                    ...item,
                    purchaseDate: new Date().toISOString(),
                    orderId: order.id
                };
                
                // Проверяем есть ли уже такой товар в истории
                const existingIndex = history.findIndex(h => h.id === item.id);
                if (existingIndex >= 0) {
                    history[existingIndex] = historyItem;
                } else {
                    history.unshift(historyItem);
                }
            });
            localStorage.setItem('purchaseHistory', JSON.stringify(history));

            // Очищаем корзину
            localStorage.removeItem('cart');
            localStorage.removeItem('checkoutCart');

            setOrderPlaced(true);
            setLoading(false);

            // Через 3 секунды перенаправляем в профиль
            setTimeout(() => {
                navigate('/profile');
            }, 3000);

        } catch (error) {
            console.error('Ошибка оформления заказа:', error);
            setLoading(false);
        }
    };

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
                                        disabled={loading}
                                    >
                                        {loading ? (
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