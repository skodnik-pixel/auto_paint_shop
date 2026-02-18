// frontend/src/components/Profile.js
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button, Alert, Spinner, Modal, Form, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaHistory, FaCog, FaSignOutAlt, FaBox, FaClock, FaCheckCircle, FaTimes, FaEye, FaTrash, FaTruck, FaBell, FaBuilding, FaPlus, FaShoppingCart } from 'react-icons/fa';
import './Profile.css';
import './Orders.css';

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
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [savedAddresses, setSavedAddresses] = useState([
        {
            id: 1,
            name: 'Основной адрес',
            city: 'Минск',
            address: 'ул. Примерная, д. 1, кв. 10',
            postalCode: '220000',
            isDefault: true
        }
    ]);
    const [newAddress, setNewAddress] = useState({
        name: '',
        city: '',
        address: '',
        apartment: '',
        postalCode: '',
        isDefault: false
    });

    // Загрузка данных пользователя и заказов
    useEffect(() => {
        // Поддержка и DRF Token, и JWT (access_token)
        const token = localStorage.getItem('token');
        const accessToken = localStorage.getItem('access_token');
        const userData = localStorage.getItem('user');
        const isAuth = (token || accessToken) && userData;

        if (!isAuth) {
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

    // Функции для работы с адресами
    const handleAddAddress = () => {
        if (newAddress.name && newAddress.city && newAddress.address) {
            const address = {
                id: Date.now(),
                ...newAddress,
                address: newAddress.apartment 
                    ? `${newAddress.address}, кв. ${newAddress.apartment}`
                    : newAddress.address
            };
            
            setSavedAddresses([...savedAddresses, address]);
            setNewAddress({
                name: '',
                city: '',
                address: '',
                apartment: '',
                postalCode: '',
                isDefault: false
            });
            setShowAddressModal(false);
        }
    };

    const handleDeleteAddress = (addressId) => {
        setSavedAddresses(savedAddresses.filter(addr => addr.id !== addressId));
    };

    const handleAddressInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewAddress(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
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

                        {/* Вкладка "Мои заказы" — в формате как корзина: карточка, таблица товаров */}
                        {activeTab === 'orders' && (
                            <Card className="profile-content-card orders-history-card">
                                <Card.Header>
                                    <h2 className="mb-0 orders-history-title">
                                        <FaShoppingCart className="me-2" />
                                        История заказов
                                    </h2>
                                </Card.Header>
                                <Card.Body>
                                    {error && <Alert variant="danger">{error}</Alert>}
                                    {orders.length === 0 ? (
                                        <div className="orders-empty text-center py-5">
                                            <FaShoppingCart size={60} className="text-muted mb-3" />
                                            <h4>У вас пока нет заказов</h4>
                                            <p className="text-muted">Перейдите в каталог и сделайте первый заказ</p>
                                            <Button variant="primary" onClick={() => navigate('/catalog')} className="mt-3">
                                                Перейти в каталог
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="orders-list">
                                            {orders.map(order => {
                                                const status = getOrderStatus(order.status);
                                                return (
                                                    <div key={order.id} className="order-block">
                                                        <div className="order-block-header">
                                                            <div className="order-block-meta">
                                                                <span className="order-block-number">Заказ № {order.id}</span>
                                                                <span className="order-block-date">{formatDate(order.createdAt)}</span>
                                                                <Badge bg={status.variant} className="status-badge">{status.icon} {status.text}</Badge>
                                                            </div>
                                                            <div className="order-block-total">Сумма заказа: <strong className="order-total-amount">{order.totalPrice} BYN</strong></div>
                                                        </div>
                                                        {order.items && order.items.length > 0 && (
                                                            <div className="order-table-wrapper">
                                                                <Table className="orders-table" responsive>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Товар</th>
                                                                            <th>Цена</th>
                                                                            <th>Количество</th>
                                                                            <th>Итого</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        {order.items.map((item, index) => {
                                                                            const itemTotal = (parseFloat(item.price) * (item.quantity || 1)).toFixed(2);
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <div className="orders-product-info">
                                                                                            <img
                                                                                                src={item.image || 'https://via.placeholder.com/200x200?text=Нет+фото'}
                                                                                                alt={item.name}
                                                                                                className="orders-product-image"
                                                                                                onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Нет+фото'; }}
                                                                                            />
                                                                                            <span className="orders-product-name">{item.name}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="orders-price">{item.price} BYN</td>
                                                                                    <td className="orders-quantity">{item.quantity || 1}</td>
                                                                                    <td className="orders-total-price">{itemTotal} BYN</td>
                                                                                </tr>
                                                                            );
                                                                        })}
                                                                    </tbody>
                                                                </Table>
                                                            </div>
                                                        )}
                                                    </div>
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
                                    {/* Управление адресами доставки */}
                                    <Card className="settings-section mb-4">
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                <FaTruck className="me-2" />
                                                Адреса доставки
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="saved-addresses">
                                                <p className="text-muted mb-3">Сохранённые адреса для быстрого оформления заказов</p>
                                                
                                                {/* Список сохранённых адресов */}
                                                <div className="address-list mb-3">
                                                    {savedAddresses.map(address => (
                                                        <div key={address.id} className="address-item">
                                                            <div className="address-header">
                                                                <strong>{address.name}</strong>
                                                                {address.isDefault && (
                                                                    <Badge bg="success" className="ms-2">По умолчанию</Badge>
                                                                )}
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="address-delete-btn"
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
                                                            <p className="mb-1">{address.city}, {address.address}</p>
                                                            {address.postalCode && (
                                                                <small className="text-muted">Индекс: {address.postalCode}</small>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                                
                                                <Button 
                                                    variant="outline-primary" 
                                                    size="sm" 
                                                    className="settings-btn"
                                                    onClick={() => setShowAddressModal(true)}
                                                >
                                                    <FaPlus className="me-1" />
                                                    Добавить адрес
                                                </Button>
                                            </div>
                                        </Card.Body>
                                    </Card>

                                    {/* Настройки уведомлений */}
                                    <Card className="settings-section mb-4">
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                <FaBell className="me-2" />
                                                Уведомления
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Form.Check 
                                                    type="checkbox"
                                                    id="email-orders"
                                                    label="Email уведомления о статусе заказа"
                                                    defaultChecked
                                                    className="mb-2"
                                                />
                                                <Form.Check 
                                                    type="checkbox"
                                                    id="email-promotions"
                                                    label="Акции и специальные предложения"
                                                    defaultChecked
                                                    className="mb-2"
                                                />
                                                <Form.Check 
                                                    type="checkbox"
                                                    id="sms-orders"
                                                    label="SMS уведомления о доставке"
                                                    className="mb-3"
                                                />
                                                <Button variant="success" size="sm" className="settings-btn">
                                                    Сохранить настройки
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>

                                    {/* Профиль компании (B2B) */}
                                    <Card className="settings-section">
                                        <Card.Header>
                                            <h5 className="mb-0">
                                                <FaBuilding className="me-2" />
                                                Профиль компании
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Row>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Название организации</Form.Label>
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder="ООО 'Автосервис'"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>УНП</Form.Label>
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder="123456789"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={12}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Юридический адрес</Form.Label>
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder="г. Минск, ул. Деловая, д. 5"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Контактное лицо</Form.Label>
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder="Иванов Иван Иванович"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                    <Col md={6}>
                                                        <Form.Group className="mb-3">
                                                            <Form.Label>Должность</Form.Label>
                                                            <Form.Control 
                                                                type="text" 
                                                                placeholder="Директор"
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </Row>
                                                <Button variant="success" size="sm" className="settings-btn">
                                                    Сохранить данные компании
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
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

                {/* Модальное окно добавления адреса */}
                <Modal show={showAddressModal} onHide={() => setShowAddressModal(false)} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Добавить новый адрес</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group className="mb-3">
                                <Form.Label>Название адреса *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={newAddress.name}
                                    onChange={handleAddressInputChange}
                                    placeholder="Дом, Работа, Склад..."
                                />
                            </Form.Group>
                            
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Город *</Form.Label>
                                        <Form.Control
                                            type="text"
                                            name="city"
                                            value={newAddress.city}
                                            onChange={handleAddressInputChange}
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
                                            value={newAddress.postalCode}
                                            onChange={handleAddressInputChange}
                                            placeholder="220000"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Адрес *</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="address"
                                    value={newAddress.address}
                                    onChange={handleAddressInputChange}
                                    placeholder="ул. Примерная, д. 1"
                                />
                            </Form.Group>
                            
                            <Form.Group className="mb-3">
                                <Form.Label>Квартира/Офис</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="apartment"
                                    value={newAddress.apartment}
                                    onChange={handleAddressInputChange}
                                    placeholder="10"
                                />
                            </Form.Group>
                            
                            <Form.Check
                                type="checkbox"
                                name="isDefault"
                                checked={newAddress.isDefault}
                                onChange={handleAddressInputChange}
                                label="Сделать адресом по умолчанию"
                                className="mb-3"
                            />
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowAddressModal(false)}>
                            Отмена
                        </Button>
                        <Button variant="success" onClick={handleAddAddress}>
                            Сохранить адрес
                        </Button>
                    </Modal.Footer>
                </Modal>
            </Container>
        </div>
    );
}

export default Profile;
