// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

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

        if (!formData.username || !formData.password) {
            setError('Пожалуйста, заполните все поля');
            setLoading(false);
            return;
        }

        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const response = await fetch(`${apiUrl}/accounts/login/`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json' 
                },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password
                }),
            });

            if (!response.headers.get('content-type')?.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Ошибка сервера. Проверьте URL: ${apiUrl}/accounts/login/`);
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Неверное имя пользователя или пароль');
            }

            if (data.auth_token) {
                // Сохраняем токен и данные пользователя
                localStorage.setItem('token', data.auth_token);
                localStorage.setItem('user', JSON.stringify({
                    id: data.user_id,
                    username: data.username,
                    email: data.email,
                    is_admin: data.is_admin
                }));
                
                alert('Вход выполнен успешно!');
                navigate('/');
                window.location.reload(); // Обновляем страницу для обновления Navbar
            } else {
                throw new Error('Ошибка авторизации');
            }
        } catch (error) {
            setError(error.message);
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
                </Col>
            </Row>
        </Container>
    );
}

export default Login;