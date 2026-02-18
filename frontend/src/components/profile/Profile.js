import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button, Alert, Spinner, Modal, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaCog, FaSignOutAlt, FaBox, FaClock, FaCheckCircle, FaTimes, FaTruck, FaBell, FaBuilding, FaPlus, FaTrash, FaEye } from 'react-icons/fa';

function Profile() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);
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
        const token = localStorage.getItem('access');
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

        // Загружаем заказы с сервера и переключаем на вкладку заказов если есть параметры в url, 
        // или если просто хотим по умолчанию открыть заказы можно добавить логику здесь.
        fetchOrders(token);
    }, [navigate]);

    // Функция загрузки заказов
    const fetchOrders = async (token) => {
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${apiUrl}/orders/orders/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.ok) {
                const data = await response.json();
                let fetchedOrders = data.results || data;
                // Сортируем: новые сверху
                fetchedOrders.sort((a, b) => new Date(b.created_at || b.id) - new Date(a.created_at || a.id));
                setOrders(fetchedOrders);
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

    // Просмотр подробностей товара
    const viewProductDetails = (productSlug) => {
        if (productSlug) {
            navigate(`/product/${productSlug}`);
        } else {
            console.warn('Product slug is missing');
        }
    };

    // Выход из системы
    const handleLogout = async () => {
        const token = localStorage.getItem('access');

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
        localStorage.removeItem('access');
        localStorage.removeItem('user');
        navigate('/');
        window.location.reload();
    };

    // Получение статуса заказа
    const getOrderStatus = (status) => {
        const statuses = {
            'pending': { text: 'Ожидает', variant: 'warning', icon: <FaClock /> },
            'processing': { text: 'В обработке', variant: 'info', icon: <FaBox /> },
            'shipped': { text: 'Отправлен', variant: 'primary', icon: <FaBox /> },
            'delivered': { text: 'Доставлен', variant: 'success', icon: <FaCheckCircle /> },
            'cancelled': { text: 'Отменён', variant: 'danger', icon: <FaTimes /> }
        };
        return statuses[status] || statuses['pending'];
    };

    // Форматирование даты
    const formatDate = (dateString) => {
        if (!dateString) return 'Неизвестно';
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
                        <Card className="profile-sidebar border-0 shadow-sm">
                            <Card.Body>
                                {/* Информация о пользователе */}
                                <div className="profile-user-info text-center mb-4">
                                    <div className="profile-avatar mb-3">
                                        <FaUser size={40} className="text-primary" />
                                    </div>
                                    <h5 className="profile-username mb-1">{user.username}</h5>
                                    <p className="profile-email text-muted small">{user.email}</p>
                                </div>

                                {/* Навигация */}
                                <Nav className="flex-column profile-nav pills-vertical">
                                    <Nav.Link
                                        className={`mb-2 ${activeTab === 'profile' ? 'active fw-bold' : ''}`}
                                        onClick={() => setActiveTab('profile')}
                                    >
                                        <FaUser className="me-2" />
                                        Мой профиль
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`mb-2 ${activeTab === 'orders' ? 'active fw-bold' : ''}`}
                                        onClick={() => setActiveTab('orders')}
                                    >
                                        <FaShoppingBag className="me-2" />
                                        Мои заказы
                                        {orders.length > 0 && (
                                            <Badge bg="danger" className="ms-2 rounded-pill">{orders.length}</Badge>
                                        )}
                                    </Nav.Link>
                                    <Nav.Link
                                        className={`mb-2 ${activeTab === 'settings' ? 'active fw-bold' : ''}`}
                                        onClick={() => setActiveTab('settings')}
                                    >
                                        <FaCog className="me-2" />
                                        Настройки
                                    </Nav.Link>
                                    <div className="border-top my-2"></div>
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
                            <Card className="profile-content-card border-0 shadow-sm">
                                <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
                                    <h4 className="mb-0">Личный кабинет</h4>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4">
                                    <Row>
                                        <Col md={6} className="mb-4">
                                            <div className="p-3 bg-light rounded h-100">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Имя пользователя</label>
                                                <p className="fs-5 mb-0 fw-medium">{user.username}</p>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <div className="p-3 bg-light rounded h-100">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Email</label>
                                                <p className="fs-5 mb-0 fw-medium">{user.email}</p>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <div className="p-3 bg-light rounded h-100">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Телефон</label>
                                                <p className="fs-5 mb-0 fw-medium">{user.phone || 'Не указан'}</p>
                                            </div>
                                        </Col>
                                        <Col md={6} className="mb-4">
                                            <div className="p-3 bg-light rounded h-100">
                                                <label className="text-muted small text-uppercase fw-bold mb-1">Статус аккаунта</label>
                                                <div>
                                                    <Badge bg={user.is_admin ? 'danger' : 'success'} className="fs-6 fw-normal px-3 py-2">
                                                        {user.is_admin ? 'Администратор' : 'Покупатель'}
                                                    </Badge>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>
                                </Card.Body>
                            </Card>
                        )}

                        {/* Вкладка "Мои заказы" (Новый дизайн) */}
                        {activeTab === 'orders' && (
                            <Card className="profile-content-card border-0 shadow-sm">
                                <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
                                    <h4 className="mb-0">История заказов</h4>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4">
                                    {error && <Alert variant="danger">{error}</Alert>}

                                    {orders.length === 0 ? (
                                        <div className="text-center py-5">
                                            <div className="mb-4">
                                                <FaShoppingBag size={60} className="text-muted opacity-50" />
                                            </div>
                                            <h5 className="mb-3">У вас пока нет заказов</h5>
                                            <p className="text-muted mb-4">Перейдите в каталог и выберите товары для вашего автомобиля</p>
                                            <Button variant="primary" size="lg" onClick={() => navigate('/catalog')} className="px-4 rounded-pill">
                                                Перейти в каталог
                                            </Button>
                                        </div>
                                    ) : (
                                        <div className="orders-list">
                                            {orders.map(order => {
                                                const status = getOrderStatus(order.status);
                                                // Раскрываем все товары заказа в виде карточек
                                                return (
                                                    <div key={order.id} className="mb-4 p-3 border rounded bg-white">
                                                        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2">
                                                            <div className="d-flex align-items-center gap-2">
                                                                <span className="fw-bold text-dark">Заказ №{order.id}</span>
                                                                <span className="text-muted small">от {formatDate(order.created_at || order.items?.[0]?.purchaseDate)}</span>
                                                            </div>
                                                            <div className="d-flex align-items-center gap-3">
                                                                <Badge bg={status.variant} text={status.variant === 'warning' || status.variant === 'info' ? 'dark' : 'white'} className="fw-normal px-2 py-1 d-flex align-items-center gap-1">
                                                                    {status.icon} {status.text}
                                                                </Badge>
                                                            </div>
                                                        </div>

                                                        {/* Список товаров в этом заказе */}
                                                        {order.items && order.items.map((item, idx) => (
                                                            <Row key={idx} className="align-items-center mb-3">
                                                                <Col xs={3} sm={2} style={{ maxWidth: '80px' }}>
                                                                    <div style={{ width: '60px', height: '60px', overflow: 'hidden', borderRadius: '8px', border: '1px solid #eee', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f9f9f9' }}>
                                                                        {item.product?.image || item.image ? (
                                                                            <img
                                                                                src={item.product?.image || item.image}
                                                                                alt={item.product?.name || item.name}
                                                                                style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                                                            />
                                                                        ) : (
                                                                            <FaBox className="text-secondary opacity-25" size={24} />
                                                                        )}
                                                                    </div>
                                                                </Col>
                                                                <Col xs={9} sm={6}>
                                                                    <h6 className="mb-1 text-truncate" style={{ maxWidth: '100%' }}>{item.product?.name || item.name || 'Товар без названия'}</h6>
                                                                    <div className="small text-muted mb-1">
                                                                        {item.quantity} шт. × {item.price} BYN
                                                                    </div>
                                                                    <Button
                                                                        variant="link"
                                                                        className="p-0 text-decoration-none small"
                                                                        onClick={() => viewProductDetails(item.product?.slug || item.slug)}
                                                                    >
                                                                        <FaEye className="me-1" /> Подробнее
                                                                    </Button>
                                                                </Col>
                                                                <Col xs={12} sm={4} className="text-sm-end mt-2 mt-sm-0">
                                                                    <div className="fw-bold fs-5">
                                                                        {(parseFloat(item.price) * item.quantity).toFixed(2)} BYN
                                                                    </div>
                                                                </Col>
                                                            </Row>
                                                        ))}

                                                        <div className="border-top pt-2 mt-2 d-flex justify-content-end align-items-center">
                                                            <span className="me-2 text-muted">Итого заказа:</span>
                                                            <span className="fw-bold fs-4 text-primary">{order.totalPrice || order.total_price} BYN</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        )}

                        {/* Вкладка "Настройки" */}
                        {activeTab === 'settings' && (
                            <Card className="profile-content-card border-0 shadow-sm">
                                <Card.Header className="bg-white border-bottom-0 pt-4 px-4">
                                    <h4 className="mb-0">Настройки аккаунта</h4>
                                </Card.Header>
                                <Card.Body className="px-4 pb-4">
                                    {/* Управление адресами доставки */}
                                    <Card className="settings-section mb-4 border shadow-sm">
                                        <Card.Header className="bg-light border-bottom">
                                            <h5 className="mb-0 fs-6 fw-bold text-dark">
                                                <FaTruck className="me-2 text-primary" />
                                                Адреса доставки
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <div className="saved-addresses">
                                                <p className="text-muted small mb-3">Сохранённые адреса для быстрого оформления заказов</p>

                                                <div className="address-list mb-3">
                                                    {savedAddresses.map(address => (
                                                        <div key={address.id} className="address-item p-3 border rounded mb-2 bg-white position-relative">
                                                            <div className="d-flex justify-content-between align-items-start">
                                                                <div>
                                                                    <strong className="d-block text-dark mb-1">{address.name} {address.isDefault && <Badge bg="success" className="ms-1 small">По умолчанию</Badge>}</strong>
                                                                    <div className="text-muted small">
                                                                        {address.city}, {address.address}
                                                                        {address.postalCode && <span className="d-block text-muted small mt-1">Индекс: {address.postalCode}</span>}
                                                                    </div>
                                                                </div>
                                                                <Button
                                                                    variant="outline-danger"
                                                                    size="sm"
                                                                    className="border-0"
                                                                    onClick={() => handleDeleteAddress(address.id)}
                                                                >
                                                                    <FaTrash />
                                                                </Button>
                                                            </div>
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
                                    <Card className="settings-section mb-4 border shadow-sm">
                                        <Card.Header className="bg-light border-bottom">
                                            <h5 className="mb-0 fs-6 fw-bold text-dark">
                                                <FaBell className="me-2 text-primary" />
                                                Уведомления
                                            </h5>
                                        </Card.Header>
                                        <Card.Body>
                                            <Form>
                                                <Form.Check
                                                    type="switch"
                                                    id="email-orders"
                                                    label="Email уведомления о статусе заказа"
                                                    defaultChecked
                                                    className="mb-3"
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="email-promotions"
                                                    label="Акции и специальные предложения"
                                                    defaultChecked
                                                    className="mb-3"
                                                />
                                                <Form.Check
                                                    type="switch"
                                                    id="sms-orders"
                                                    label="SMS уведомления о доставке"
                                                    className="mb-3"
                                                />
                                                <Button variant="success" size="sm" className="mt-2">
                                                    Сохранить настройки
                                                </Button>
                                            </Form>
                                        </Card.Body>
                                    </Card>
                                </Card.Body>
                            </Card>
                        )}
                    </Col>
                </Row>

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
