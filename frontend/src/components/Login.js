// frontend/src/components/Login.js
import React, { useState } from 'react';
import { Container, Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleLogin = () => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        fetch(`${apiUrl}/accounts/login/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password }),
        })
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error('Неверное имя пользователя или пароль');
                }
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/accounts/login/`);
                }
                return response.json();
            })
            .then(data => {
                if (data.auth_token) {
                    localStorage.setItem('token', data.auth_token);
                    alert('Вход выполнен!');
                    navigate('/');
                } else {
                    throw new Error('Ошибка авторизации');
                }
            })
            .catch(error => {
                setError(error.message);
                console.error('Error logging in:', error);
            });
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
                    
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Имя пользователя</Form.Label>
                            <Form.Control
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Введите имя пользователя"
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Пароль</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Введите пароль"
                            />
                        </Form.Group>
                        <Button 
                            variant="primary" 
                            onClick={handleLogin}
                            className="w-100 mb-3"
                        >
                            Войти
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