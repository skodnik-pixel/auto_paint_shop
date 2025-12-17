// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Table, Badge, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHeart, FaCog, FaSignOutAlt, FaBox, FaClock, FaCheckCircle, FaTimes } from 'react-icons/fa';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);

    // Загрузка данных пользователя и заказов
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');

        // Проверяем авторизацию
        if (!token || !userData) {
            navigate('/login');
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch (e) {
            console.error('Error parsing user data:', e);
            navigate('/login');
            return;
        }

        // Загружаем заказы
        fetchOrders(token);
    }, [navigate]);

    // Функция загрузки заказов
    const fetchOrders = async (token) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${apiUrl}/orders/orders/`, {
                headers: {
                    'Authorization': `Token ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                setOrders(data.results || data);
            } else {
                console.error('Failed to fetch orders');
            }
        } catch (error) {
            console.error('Error fetching orders:', error);
            setError('Не удалось загрузить заказы');
        } finally {
            setLoading(false);
        }
    };

    // Выход из системы
    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
                await fetch(`${apiUrl}/accounts/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    // Получение статуса заказа
    const getOrderStatus = (status) => {
        const statuses = {
            'pending': { text: 'Ожидает обработки', variant: 'warning', icon: <FaClock /> },
            'processing': { text: 'В обработке', variant: 'info', icon: <FaBox /> },
            'shipped': { text: 'Отправлен', variant: 'primary', icon: <FaBox /> },
            'delivered': { text: 'Доставлен', variant: 'success', icon: <FaCheckCircle /> },
            'cancelled': { text: 'Отменён', variant: 'danger', icon: <FaTimes /> }
        };
        return statuses[status] || statuses['pending'];
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Загрузка...</p>
            </Container>
        );
    }

    if (!user) {
        return null;
    }

    return (
        <div className="profile-page">
            <Container className="my-5">
                <Row>
                    {/* Боковое меню */}
                    <Col lg={3} className="mb-4">
                        <Card className="profile-sidebar">
                            <Card.Body>
                                {/* Информация о пользователе */}
                                <div className="profile-user-info text-center mb-4">
                                    <div className="profile-avatar">
                                        <FaUser />
                                    </div>
                                    <h5 className="profile-username mt-3">{user.username}</h5>
                                    <p className="profile-email text-muted">{user.email}</p>
                                </div>

                                {/* Навигация */}
                                <Nav className="flex-column profile-nav">
                                    <Nav.Link 
                                        className={activeTab === 'profile' ? 'active' : ''}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        <FaUser className="me-2" />
                                        Мой профиль
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={activeTab === 'orders' ? 'active' : ''}
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        <FaShoppingBag className="me-2" />
                                        Мои заказы
                                        {orders.length > 0 && (
                                            <Badge bg="primary" className="ms-2">{orders.length}</Badge>
                                        )}
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={activeTab === 'favorites' ? 'active' : ''}
                                        onClick={() => setActiveTab('favorites')}
                                    >
                                        <FaHeart className="me-2" />
                                        Избранное
                                    </Nav.Link>
                                    <Nav.Link 
                                        className={activeTab === 'settings' ? 'active' : ''}
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        <FaCog className="me-2" />
                                        Настройки
                                    </Nav.Link>
                                    <Nav.Link onClick={handleLogout} className="text-danger">
                                        <FaSignOutAlt className="me-2" />
                                        Выйти
                                    </Nav.Link>
                                </Nav>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Основной контент */}
                    <Col lg={9}>
                        {/* Вкладка "Мой профиль" */}
                        {activeTab === 'profile' && (
                            <Card className="profile-content-card">
                                <Card.Header>
                                    <h4 className="mb-0">Личный кабинет</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Row>
                                        <Col md={6} className="mb-3">
                                            <label className="form-label text-muted">Имя пользователя</label>
                                            <p className="profile-info-value">{user.username}</p>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <label className="form-label text-muted">Email</label>
                                            <p className="profile-info-value">{user.email}</p>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <label className="form-label text-muted">Телефон</label>
                                            <p className="profile-info-value">{user.phone || 'Не указан'}</p>
                                        </Col>
                                        <Col md={6} className="mb-3">
                                            <label className="form-label text-muted">Статус</label>
                                            <p className="profile-info-value">
                                                <Badge bg={user.is_admin ? 'danger' : 'success'}>
                                                    {user.is_admin ? 'Администратор' : 'Покупатель'}
                                                </Badge>
                                            </p>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Вкладка "Мои заказы" */}
                        {activeTab === 'orders' && (
                            <Card className="profile-content-card">
                                <Card.Header>
                                    <h4 className="mb-0">История заказов</h4>
                                </Card.Header>
                                <Card.Body>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    
                                    {orders.length === 0 ? (
                                        <div className="text-center py-5">
                                            <FaShoppingBag size={60} className="text-muted mb-3" />
                                            <h5>У вас пока нет заказов</h5>
                                            <p className="text-muted">Перейдите в каталог и сделайте первый заказ</p>
                                            <Button variant="primary" onClick={() => navigate('/catalog')}>
                                                Перейти в каталог
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="orders-list">
                                            {orders.map(order => {
                                                const status = getOrderStatus(order.status);
                                                return (
                                                    <Card key={order.id} className="order-card mb-3">
                                                        <Card.Body>
                                                            <Row className="align-items-center">
                                                                <Col md={2}>
                                                                    <div className="order-number">
                                                                        <small className="text-muted">Заказ №</small>
                                                                        <h6 className="mb-0">{order.id}</h6>
                                                                    </div>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <small className="text-muted">Дата заказа</small>
                                                                    <p className="mb-0">{formatDate(order.created_at)}</p>
                                                                </Col>
                                                                <Col md={2}>
                                                                    <small className="text-muted">Сумма</small>
                                                                    <h6 className="mb-0 text-primary">{order.total_price} BYN</h6>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <small className="text-muted">Статус</small>
                                                                    <div>
                                                                        <Badge bg={status.variant} className="status-badge">
                                                                            {status.icon} {status.text}
                                                                        </Badge>
                                                                    </div>
                                                                </Col>
                                                                <Col md={2} className="text-end">
                                                                    <Button 
                                                                        variant="outline-primary" 
                                                                        size="sm"
                                                                        onClick={() => {/* Открыть детали заказа */}}
                                                                    >
                                                                        Подробнее
                                                                    </Button>
                                                                </Col>
                                                            </Row>
                                                            
                                                            {/* Товары в заказе */}
                                                            {order.items && order.items.length > 0 && (
                                                                <div className="order-items mt-3 pt-3 border-top">
                                                                    <small className="text-muted">Товары:</small>
                                                                    <div className="mt-2">
                                                                        {order.items.map((item, index) => (
                                                                            <div key={index} className="order-item-row">
                                                                                <span>{item.product?.name || 'Товар'}</span>
                                                                                <span className="text-muted">
                                                                                    {item.quantity} шт. × {item.price} BYN
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </Card.Body>
                                                    </Card>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Вкладка "Избранное" */}
                        {activeTab === 'favorites' && (
                            <Card className="profile-content-card">
                                <Card.Header>
                                    <h4 className="mb-0">Избранные товары</h4>
                                </Card.Header>
                                <Card.Body>
                                    <div className="text-center py-5">
                                        <FaHeart size={60} className="text-muted mb-3" />
                                        <h5>У вас пока нет избранных товаров</h5>
                                        <p className="text-muted">Добавляйте товары в избранное, чтобы не потерять их</p>
                                    </div>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Вкладка "Настройки" */}
                        {activeTab === 'settings' && (
                            <Card className="profile-content-card">
                                <Card.Header>
                                    <h4 className="mb-0">Настройки аккаунта</h4>
                                </Card.Header>
                                <Card.Body>
                                    <Alert variant="info">
                                        <strong>Скоро здесь появится:</strong>
                                        <ul className="mb-0 mt-2">
                                            <li>Изменение пароля</li>
                                            <li>Редактирование профиля</li>
                                            <li>Настройки уведомлений</li>
                                            <li>Управление адресами доставки</li>
                                        </ul>
                                    </Alert>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
}

export default Profile;
