// frontend/src/components/Register.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        re_password: '',
        phone: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { register } = useAuth();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Проверка паролей
        if (formData.password !== formData.re_password) {
            setError('Пароли не совпадают');
            setLoading(false);
            return;
        }

        // Проверка минимальной длины пароля
        if (formData.password.length < 8) {
            setError('Пароль должен содержать минимум 8 символов');
            setLoading(false);
            return;
        }

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                re_password: formData.re_password,
                phone: formData.phone,
            });

            if (result.success) {
                if (result.user) {
                    navigate('/');
                    window.location.reload();
                } else {
                    navigate('/login');
                }
                return;
            }
            setError(result.error || 'Ошибка при регистрации');
        } catch (error) {
            console.error('Error during registration:', error);
            setError(error.message || 'Ошибка соединения с сервером');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col md={6}>
                    <div className="text-center mb-4">
                        <h2>Регистрация</h2>
                        <p className="text-muted">Создайте новый аккаунт</p>
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
                                minLength={3}
                            />
                            <Form.Text className="text-muted">
                                Минимум 3 символа
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Введите email"
                                required
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
                                minLength={8}
                            />
                            <Form.Text className="text-muted">
                                Минимум 8 символов
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Подтвердите пароль *</Form.Label>
                            <Form.Control
                                type="password"
                                name="re_password"
                                value={formData.re_password}
                                onChange={handleChange}
                                placeholder="Повторите пароль"
                                required
                                minLength={8}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <Form.Control
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                placeholder="+375 (XX) XXX-XX-XX"
                            />
                            <Form.Text className="text-muted">
                                Необязательное поле
                            </Form.Text>
                        </Form.Group>

                        <Button 
                            variant="primary" 
                            type="submit" 
                            className="w-100 mb-3"
                            disabled={loading}
                        >
                            {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                        </Button>

                        <div className="text-center">
                            <p className="mb-0">
                                Уже есть аккаунт?{' '}
                                <Link to="/login" className="text-decoration-none">
                                    Войти
                                </Link>
                            </p>
                        </div>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
