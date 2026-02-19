import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Badge, Button, Alert, Spinner, Modal, Form, Table } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaShoppingBag, FaCog, FaSignOutAlt, FaBox, FaClock, FaCheckCircle, FaTimes, FaEye, FaTrash, FaTruck, FaBell, FaBuilding, FaPlus, FaShoppingCart } from 'react-icons/fa';
import api from '../../utils/api';
import { formatEditablePart, getEditablePartFromFull, getFullPhoneFromEditablePart, validatePhone, EDITABLE_PLACEHOLDER, countDigitsBeforePosition, digitIndexToFormattedPos } from '../../utils/phoneBelarus';
import './Profile.css';
import './Orders.css';

function Profile() {
    const navigate = useNavigate();
    const location = useLocation();
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('profile');
    const [error, setError] = useState(null);
    // Форма смены пароля в личном кабинете
    const [passwordForm, setPasswordForm] = useState({ current_password: '', new_password: '', re_new_password: '' });
    const [passwordError, setPasswordError] = useState(null);
    const [passwordSuccess, setPasswordSuccess] = useState(null);
    const [passwordLoading, setPasswordLoading] = useState(false);
    // Редактирование телефона в личном кабинете
    const [editPhone, setEditPhone] = useState('');
    const [phoneSaving, setPhoneSaving] = useState(false);
    const [phoneMessage, setPhoneMessage] = useState(null); // success или error текст
    const phoneInputRef = React.useRef(null);
    const phoneNextCursorRef = React.useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const [purchaseHistory, setPurchaseHistory] = useState([]);
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
            const u = JSON.parse(userData);
            setUser(u);
            setEditPhone(u.phone ? getEditablePartFromFull(u.phone) : '');
        } catch (e) {
            console.error('Error parsing user data:', e);
            navigate('/login');
            return;
        }

        // Подтягиваем профиль с сервера (телефон с регистрации и актуальные данные)
        api.get('accounts/profile/')
            .then(({ data }) => {
                const profileUser = {
                    id: data.id,
                    username: data.username,
                    email: data.email,
                    phone: data.phone,
                    is_admin: data.is_admin,
                };
                setUser(profileUser);
                setEditPhone(profileUser.phone ? getEditablePartFromFull(profileUser.phone) : '');
                localStorage.setItem('user', JSON.stringify(profileUser));
            })
            .catch(() => {});

        // Загружаем заказы из localStorage вместо сервера
        loadOrdersFromStorage();
        
        // Загружаем историю покупок из localStorage
        loadPurchaseHistory();
    }, [navigate]);

    // Открыть вкладку "Мои заказы" при переходе из Navbar по кнопке "Мои заказы"
    useEffect(() => {
        if (location.state?.activeTab === 'orders') {
            setActiveTab('orders');
            // Очищаем state, чтобы при повторном заходе не залипала вкладка
            window.history.replaceState({}, document.title, location.pathname);
        }
    }, [location.state, location.pathname]);

    // Восстановление позиции курсора в поле телефона после форматирования (стрелки, delete, мышь)
    useEffect(() => {
        if (phoneNextCursorRef.current !== null && phoneInputRef.current) {
            const pos = phoneNextCursorRef.current;
            phoneInputRef.current.setSelectionRange(pos, pos);
            phoneNextCursorRef.current = null;
        }
    }, [editPhone]);

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
        const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');

        if (accessToken) {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
                await fetch(`${apiUrl}/accounts/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${accessToken}`
                    }
                });
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }

        localStorage.removeItem('token');
        localStorage.removeItem('access');
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
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
                                    <h5 className="profile-username mt-3">{user.username}</h5>
                                    <p className="profile-email text-muted">{user.email}</p>
                                    {user.phone && <p className="profile-phone text-muted small mb-1">{user.phone}</p>}
                                    <Badge bg={user.is_admin ? 'danger' : 'success'} className="mt-1">
                                        {user.is_admin ? 'Администратор' : 'Покупатель'}
                                    </Badge>
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
                                        <Col md={6} className="mb-3">
                                            <label className="form-label text-muted">Телефон</label>
                                            <div className="d-flex flex-wrap align-items-center gap-2">
                                                <div className="profile-phone-wrapper">
                                                    <span className="profile-phone-prefix">+375 </span>
                                                    <Form.Control
                                                    ref={phoneInputRef}
                                                    type="tel"
                                                    placeholder={EDITABLE_PLACEHOLDER}
                                                    value={editPhone}
                                                    onChange={(e) => {
                                                        const input = e.target;
                                                        const newValue = input.value;
                                                        const selectionStart = input.selectionStart ?? newValue.length;
                                                        const digits = newValue.replace(/\D/g, '').slice(0, 9);
                                                        const formatted = formatEditablePart(digits);
                                                        const digitIndex = countDigitsBeforePosition(newValue, selectionStart);
                                                        const newPos = digitIndexToFormattedPos(Math.min(digitIndex, digits.length));
                                                        phoneNextCursorRef.current = newPos;
                                                        setEditPhone(formatted);
                                                        setPhoneMessage(null);
                                                    }}
                                                    className="profile-phone-input"
                                                    style={{ maxWidth: 160 }}
                                                    aria-label="Код оператора и номер телефона"
                                                    />
                                                </div>
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    disabled={phoneSaving}
                                                    onClick={async () => {
                                                        setPhoneMessage(null);
                                                        const full = getFullPhoneFromEditablePart(editPhone);
                                                        const result = validatePhone(full);
                                                        if (!result.valid) {
                                                            setPhoneMessage(result.error || 'Неверный формат телефона');
                                                            return;
                                                        }
                                                        setPhoneSaving(true);
                                                        try {
                                                            const { data } = await api.patch('accounts/profile/', { phone: result.formatted || '' });
                                                            const updated = { ...user, phone: data.phone };
                                                            setUser(updated);
                                                            setEditPhone(data.phone ? getEditablePartFromFull(data.phone) : '');
                                                            localStorage.setItem('user', JSON.stringify(updated));
                                                            setPhoneMessage('Телефон сохранён');
                                                            setTimeout(() => setPhoneMessage(null), 3000);
                                                        } catch (err) {
                                                            const msg = err.response?.data?.phone?.[0] || err.response?.data?.detail || 'Не удалось сохранить телефон';
                                                            setPhoneMessage(typeof msg === 'string' ? msg : JSON.stringify(msg));
                                                        } finally {
                                                            setPhoneSaving(false);
                                                        }
                                                    }}
                                                >
                                                    {phoneSaving ? 'Сохранение...' : 'Сохранить'}
                                                </Button>
                                            </div>
                                            {phoneMessage && (
                                                <p className={`small mt-1 mb-0 ${phoneMessage === 'Телефон сохранён' ? 'text-success' : 'text-danger'}`}>
                                                    {phoneMessage}
                                                </p>
                                            )}
                                        </Col>
                                        <Col md={12} className="mb-3">
                                            <label className="form-label text-muted">Смена пароля</label>
                                            <Form
                                                onSubmit={async (e) => {
                                                    e.preventDefault();
                                                    setPasswordError(null);
                                                    setPasswordSuccess(null);
                                                    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.re_new_password) {
                                                        setPasswordError('Заполните все поля');
                                                        return;
                                                    }
                                                    if (passwordForm.new_password !== passwordForm.re_new_password) {
                                                        setPasswordError('Новый пароль и подтверждение не совпадают');
                                                        return;
                                                    }
                                                    setPasswordLoading(true);
                                                    try {
                                                        const res = await api.post('accounts/change-password/', passwordForm);
                                                        setPasswordSuccess(res.data.message || 'Пароль успешно изменён.');
                                                        setPasswordForm({ current_password: '', new_password: '', re_new_password: '' });
                                                    } catch (err) {
                                                        const msg = err.response?.data?.error || err.response?.data?.detail || 'Ошибка смены пароля';
                                                        setPasswordError(typeof msg === 'string' ? msg : JSON.stringify(msg));
                                                    } finally {
                                                        setPasswordLoading(false);
                                                    }
                                                }}
                                            >
                                                <Form.Group className="mb-2">
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Текущий пароль"
                                                        value={passwordForm.current_password}
                                                        onChange={(e) => setPasswordForm(f => ({ ...f, current_password: e.target.value }))}
                                                        autoComplete="current-password"
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Новый пароль"
                                                        value={passwordForm.new_password}
                                                        onChange={(e) => setPasswordForm(f => ({ ...f, new_password: e.target.value }))}
                                                        autoComplete="new-password"
                                                    />
                                                </Form.Group>
                                                <Form.Group className="mb-2">
                                                    <Form.Control
                                                        type="password"
                                                        placeholder="Повторите новый пароль"
                                                        value={passwordForm.re_new_password}
                                                        onChange={(e) => setPasswordForm(f => ({ ...f, re_new_password: e.target.value }))}
                                                        autoComplete="new-password"
                                                    />
                                                </Form.Group>
                                                {passwordError && <Alert variant="danger" className="py-2 mb-2">{passwordError}</Alert>}
                                                {passwordSuccess && <Alert variant="success" className="py-2 mb-2">{passwordSuccess}</Alert>}
                                                <Button type="submit" variant="primary" disabled={passwordLoading}>
                                                    {passwordLoading ? 'Сохранение...' : 'Изменить пароль'}
                                                </Button>
                                            </Form>
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
                                                const orderDate = order.createdAt || order.created_at || order.items?.[0]?.purchaseDate;
                                                const orderTotal = order.totalPrice ?? order.total_price;
                                                return (
                                                    <div key={order.id} className="order-block">
                                                        <div className="order-block-header">
                                                            <div className="order-block-meta">
                                                                <span className="order-block-number">Заказ № {order.id}</span>
                                                                <span className="order-block-date">{formatDate(orderDate)}</span>
                                                                <Badge bg={status.variant} className="status-badge">{status.icon} {status.text}</Badge>
                                                            </div>
                                                            <div className="order-block-total">Сумма заказа: <strong className="order-total-amount">{orderTotal} BYN</strong></div>
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
                                                                            const name = item.product?.name ?? item.name ?? 'Товар без названия';
                                                                            const image = item.product?.image ?? item.image;
                                                                            const price = item.price;
                                                                            const qty = item.quantity ?? 1;
                                                                            const itemTotal = (parseFloat(price) * qty).toFixed(2);
                                                                            return (
                                                                                <tr key={index}>
                                                                                    <td>
                                                                                        <div className="orders-product-info">
                                                                                            {image ? (
                                                                                                <img
                                                                                                    src={image}
                                                                                                    alt={name}
                                                                                                    className="orders-product-image"
                                                                                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/200x200?text=Нет+фото'; }}
                                                                                                />
                                                                                            ) : (
                                                                                                <div className="orders-product-image orders-product-image-placeholder">
                                                                                                    <FaBox className="text-secondary opacity-25" size={24} />
                                                                                                </div>
                                                                                            )}
                                                                                            <span className="orders-product-name">{name}</span>
                                                                                        </div>
                                                                                    </td>
                                                                                    <td className="orders-price">{price} BYN</td>
                                                                                    <td className="orders-quantity">{qty}</td>
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
