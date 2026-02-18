// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Alert, Row, Col, Spinner, Modal } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
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

    const { login } = useAuth();

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
            const result = await login(formData.username, formData.password);
            if (result.success) {
                navigate('/');
                window.location.reload();
                return;
            }
            const errMsg = result.error || 'Неверное имя пользователя или пароль';
            setError(errMsg);
            // Показываем модалку с предложением регистрации, если аккаунт не найден
            const isAccountNotFound =
                typeof errMsg === 'string' &&
                (errMsg.toLowerCase().includes('no active account') ||
                    errMsg.toLowerCase().includes('credentials') ||
                    errMsg.includes('не найден') ||
                    errMsg.includes('Неверное имя'));
            if (isAccountNotFound) setShowRegisterModal(true);
        } catch (err) {
            const errMsg = err.message || 'Ошибка входа';
            setError(errMsg);
            setShowRegisterModal(true);
            console.error('Error logging in:', err);
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
                            <Form.Control
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Введите пароль"
                                required
                                autoComplete="current-password"
                            />
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