// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button, Alert, Spinner, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHistory, FaCog, FaSignOutAlt, FaBox, FaClock, FaCheckCircle, FaTimes, FaEye, FaTrash } from 'react-icons/fa';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);

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

        // Загружаем заказы из localStorage вместо сервера
        loadOrdersFromStorage();
        
        // Загружаем историю покупок из localStorage
        loadPurchaseHistory();
    }, [navigate]);

    // Функция загрузки истории покупок из localStorage
    const loadPurchaseHistory = () => {
        try {
            const history = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
            
            // Сортировка по дате покупки (новые сверху)
            const sortedHistory = history.sort((a, b) => {
                const dateA = new Date(a.purchaseDate || 0);
                const dateB = new Date(b.purchaseDate || 0);
                return dateB - dateA; // Сортировка по убыванию (новые сверху)
            });
            
            setPurchaseHistory(sortedHistory);
        } catch (error) {
            console.error('Ошибка загрузки истории покупок:', error);
            setPurchaseHistory([]);
        }
    };

    // Функция загрузки заказов из localStorage
    const loadOrdersFromStorage = () => {
        try {
            const orders = JSON.parse(localStorage.getItem('orders') || '[]');
            
            // Сортировка заказов по дате (новые сверху)
            const sortedOrders = orders.sort((a, b) => {
                const dateA = new Date(a.createdAt || 0);
                const dateB = new Date(b.createdAt || 0);
                return dateB - dateA; // Новые заказы сверху
            });
            
            setOrders(sortedOrders);
            setLoading(false);
        } catch (error) {
            console.error('Ошибка загрузки заказов:', error);
            setOrders([]);
            setLoading(false);
        }
    };

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

    // Удаление товара из истории
    const removeFromHistory = (productId) => {
        const updatedHistory = purchaseHistory.filter(item => item.id !== productId);
        setPurchaseHistory(updatedHistory);
        localStorage.setItem('purchaseHistory', JSON.stringify(updatedHistory));
        setShowDeleteModal(false);
        setItemToDelete(null);
    };

    // Подтверждение удаления из истории
    const confirmDelete = (productId) => {
        setItemToDelete(productId);
        setShowDeleteModal(true);
    };

    // Просмотр подробностей товара
    const viewProductDetails = (productSlug) => {
        navigate(`/product/${productSlug}`);
    };

    // Форматирование даты покупки
    const formatPurchaseDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
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
                                        className={activeTab === 'history' ? 'active' : ''}
                                        onClick={() => setActiveTab('history')}
                                    >
                                        <FaHistory className="me-2" />
                                        История
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
DIR                                </Card.Header>
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
                                                                    <p className="mb-0">{formatDate(order.createdAt)}</p>
                                                                </Col>
                                                                <Col md={3}>
                                                                    <small className="text-muted">Статус</small>
                                                                    <div>
                                                                        <Badge bg={status.variant} className="status-badge">
                                                                            {status.icon} {status.text}
                                                                        </Badge>
                                                                    </div>
                                                                </Col>
                                                                <Col md={4} className="text-end">
                                                                    <small className="text-muted">Сумма заказа</small>
                                                                    <h4 className="mb-0 text-primary">{order.totalPrice} BYN</h4>
                                                                </Col>
                                                            </Row>
                                                            
                                                            {/* Товары в заказе */}
                                                            {order.items && order.items.length > 0 && (
                                                                <div className="order-items mt-3 pt-3 border-top">
                                                                    <small className="text-muted">Товары:</small>
                                                                    <div className="mt-2">
                                                                        {order.items.map((item, index) => (
                                                                            <div key={index} className="order-item-row">
                                                                                <span>{item.name}</span>
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

                        {/* Вкладка "История" */}
                        {activeTab === 'history' && (
                            <Card className="profile-content-card">
                                <Card.Header>
                                    <h4 className="mb-0">История покупок</h4>
                                </Card.Header>
                                <Card.Body>
                                    {purchaseHistory.length === 0 ? (
                                        <div className="text-center py-5">
                                            <FaHistory size={60} className="text-muted mb-3" />
                                            <h5>У вас пока нет истории покупок</h5>
                                            <p className="text-muted">История будет пополняться при совершении покупок</p>
                                            <Button variant="primary" onClick={() => navigate('/catalog')}>
                                                Перейти в каталог
                                            </Button>
                                        </div>
                                    ) : (
                                        <Row>
                                            {purchaseHistory.map(item => (
                                                <Col key={item.id} md={6} lg={4} className="mb-4">
                                                    <Card className="history-product-card">
                                                        {/* Изображение товара */}
                                                        {item.image && (
                                                            <div className="history-product-image-wrapper">
                                                                <Card.Img 
                                                                    variant="top" 
                                                                    src={item.image} 
                                                                    alt={item.name}
                                                                    className="history-product-image"
                                                                />
                                                            </div>
                                                        )}
                                                        
                                                        <Card.Body>
                                                            {/* Название товара */}
                                                            <Card.Title className="history-product-name">
                                                                {item.name}
                                                            </Card.Title>
                                                            
                                                            {/* Информация о покупке */}
                                                            <div className="history-product-info">
                                                                <div className="history-info-row">
                                                                    <span className="history-label">Цена:</span>
                                                                    <span className="history-value">{item.price} BYN</span>
                                                                </div>
                                                                {item.quantity && (
                                                                    <div className="history-info-row">
                                                                        <span className="history-label">Количество:</span>
                                                                        <span className="history-value">{item.quantity} шт.</span>
                                                                    </div>
                                                                )}
                                                                {item.purchaseDate && (
                                                                    <div className="history-info-row">
                                                                        <span className="history-label">Дата:</span>
                                                                        <span className="history-value text-muted">
                                                                            {formatPurchaseDate(item.purchaseDate)}
                                                                        </span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                            
                                                            {/* Кнопки действий */}
                                                            <div className="history-actions">
                                                                <Button
                                                                    variant="outline-primary"
                                                                    size="sm"
                                                                    onClick={() => viewProductDetails(item.slug)}
                                                                    className="history-btn"
                                                                >
                                                                    <FaEye className="me-1" />
                                                                    Подробнее
                                                                </Button>
                                                            </div>
                                                        </Card.Body>
                                                    </Card>
                                                </Col>
                                            ))}
                                        </Row>
                                    )}
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

                {/* Модальное окно подтверждения удаления из истории */}
                <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Подтверждение удаления</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Вы уверены, что хотите удалить этот товар из истории покупок?
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="danger" onClick={() => removeFromHistory(itemToDelete)}>
                            Удалить
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default Profile;
