// frontend/src/components/Login.js
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Alert, Row, Col, Spinner } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

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
            setError(result.error || 'Неверное имя пользователя или пароль');
        } catch (error) {
            setError(error.message || 'Ошибка входа');
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