// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Alert, Row, Col, Spinner, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({
        username: 'user',
        password: 'password'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Модальное окно «Аккаунт не найден» — показываем при ошибке входа, предлагаем регистрацию
    const [showRegisterModal, setShowRegisterModal] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    // Получение профиля пользователя с access-токеном (эндпоинт профиля в accounts)
    async function fetchUserProfile(token) {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        const res = await fetch(`${apiUrl}/accounts/profile/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) throw new Error('Ошибка при получении профиля');
        return await res.json();
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!formData.username || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            setLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${apiUrl}/auth/jwt/create/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error('Сервер вернул не JSON. Проверьте, что backend запущен на ' + (apiUrl.replace('/api', '')) + ' и эндпоинт /api/auth/jwt/create/ доступен.');
            }
            const data = await response.json();

            if (!response.ok) {
                const errMsg = data.detail || 'Неверное имя пользователя или пароль';
                setError(errMsg);
                const isAccountNotFound =
                    typeof errMsg === 'string' &&
                    (errMsg.toLowerCase().includes('no active account') ||
                        errMsg.toLowerCase().includes('credentials') ||
                        errMsg.includes('не найден') ||
                        errMsg.includes('Неверное имя'));
                if (isAccountNotFound) setShowRegisterModal(true);
                setLoading(false);
                return;
            }

            if (data.access && data.refresh) {
                // Сохраняем токены (ключи access_token/refresh_token для совместимости с api.js и authService)
                localStorage.setItem('access_token', data.access);
                localStorage.setItem('refresh_token', data.refresh);

                // Получаем и сохраняем профиль пользователя
                try {
                    const profile = await fetchUserProfile(data.access);
                    localStorage.setItem('user', JSON.stringify(profile));
                    
                    // Уведомляем другие компоненты об изменении авторизации
                    window.dispatchEvent(new Event('authUpdated'));
                } catch (profileError) {
                    console.error(profileError);
                }

                navigate('/');
                window.location.reload();
            } else {
                throw new Error('Ошибка авторизации');
            }
        } catch (error) {
            setError(error.message || 'Ошибка входа');
            setShowRegisterModal(true);
            console.error('Error logging in:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <div className="text-center mb-4">
                        <h2>Вход</h2>
                        <p className="text-muted">Войдите в свой аккаунт</p>
                    </div>
                    
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя пользователя *</Form.Label>
                            <Form.Control
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleChange}
                                placeholder="Введите имя пользователя"
                                required
                                autoComplete="username"
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль *</Form.Label>
                            <InputGroup className="login-password-input-wrapper">
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="password"
                                    required
                                    autoComplete="current-password"
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword((p) => !p)}
                                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                                    className="login-password-toggle"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </Button>
                            </InputGroup>
                        </Form.Group>
                        
                        <Button 
                            variant="primary" 
                            type="submit"
                            className="w-100 mb-3"
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
                                    Вход...
                                </>
                            ) : (
                                'Войти'
                            )}
                        </Button>
                        
                        <div className="text-center">
                            <p className="mb-0">
                                Нет аккаунта?{' '}
                                <Link to="/register" className="text-decoration-none">
                                    Зарегистрироваться
                                </Link>
                            </p>
                        </div>
                    </Form>

                    {/* Модальное окно: аккаунт не найден — предложение зарегистрироваться */}
                    <Modal
                        show={showRegisterModal}
                        onHide={() => setShowRegisterModal(false)}
                        centered
                        className="login-register-modal"
                    >
                        <Modal.Header closeButton className="login-register-modal-header">
                            <Modal.Title className="login-register-modal-title">MISSION FAILED</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="mb-0">
                                По указанным данным не найден активный аккаунт. Возможно, вы ещё не регистрировались — создайте аккаунт, чтобы войти.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowRegisterModal(false)}>
                                Закрыть
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() => {
                                    setShowRegisterModal(false);
                                    navigate('/register');
                                }}
                            >
                                Зарегистрироваться
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
}

export default Login;