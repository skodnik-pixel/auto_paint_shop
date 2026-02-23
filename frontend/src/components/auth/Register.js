// frontend/src/components/Register.js
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Container, Form, Button, Alert, Row, Col, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate, Link } from 'react-router-dom';
import { formatEditablePart, getFullPhoneFromEditablePart, validatePhone, EDITABLE_PLACEHOLDER, countDigitsBeforePosition, digitIndexToFormattedPos } from '../../utils/phoneBelarus';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import './Register.css';

function Register() {
    const [formData, setFormData] = useState({
        username: 'user',
        email: '',
        password: '',
        re_password: '',
        phone: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showRePassword, setShowRePassword] = useState(false);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    // Модальное окно об успешной регистрации (стиль GTA)
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    // Модальное окно «Пароли не совпадают» в стиле GTA (MISSION FAILED)
    const [showPasswordMismatchModal, setShowPasswordMismatchModal] = useState(false);
    // Согласие с условиями и политикой конфиденциальности
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [termsError, setTermsError] = useState(false);
    const phoneInputRef = React.useRef(null);
    const phoneNextCursorRef = React.useRef(null);
    const navigate = useNavigate();
    const { register } = useAuth();

    // Восстановление позиции курсора в поле телефона после форматирования (как в личном кабинете)
    useEffect(() => {
        if (phoneNextCursorRef.current !== null && phoneInputRef.current) {
            const pos = phoneNextCursorRef.current;
            phoneInputRef.current.setSelectionRange(pos, pos);
            phoneNextCursorRef.current = null;
        }
    }, [formData.phone]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'phone') {
            const input = e.target;
            const newValue = input.value;
            const selectionStart = input.selectionStart ?? newValue.length;
            const digits = newValue.replace(/\D/g, '').slice(0, 9);
            const formatted = formatEditablePart(digits);
            const digitIndex = countDigitsBeforePosition(newValue, selectionStart);
            const newPos = digitIndexToFormattedPos(Math.min(digitIndex, digits.length));
            phoneNextCursorRef.current = newPos;
            setFormData((prev) => ({ ...prev, phone: formatted }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setTermsError(false);

        if (!agreeToTerms) {
            setTermsError(true);
            setLoading(false);
            return;
        }

        // Проверка паролей
        if (formData.password !== formData.re_password) {
            setShowPasswordMismatchModal(true);
            setLoading(false);
            return;
        }

        // Проверка минимальной длины пароля
        if (formData.password.length < 8) {
            setError('Пароль должен содержать минимум 8 символов');
            setLoading(false);
            return;
        }

        // Валидация телефона (белорусский формат), если указан
        let phoneToSend = '';
        if (formData.phone && formData.phone.trim()) {
            const full = getFullPhoneFromEditablePart(formData.phone);
            const phoneResult = validatePhone(full);
            if (!phoneResult.valid) {
                setError(phoneResult.error || 'Неверный формат телефона');
                setLoading(false);
                return;
            }
            phoneToSend = phoneResult.formatted || '';
        }

        try {
            const result = await register({
                username: formData.username,
                email: formData.email,
                password: formData.password,
                re_password: formData.re_password,
                phone: phoneToSend,
            });

            if (!result.success) {
                setError(result.error || 'Ошибка при регистрации');
                setLoading(false);
                return;
            }

            setShowSuccessModal(true);
            return;
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
                            <InputGroup className="register-password-input-wrapper">
                                <Form.Control
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Введите пароль"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setShowPassword((p) => !p)}
                                    aria-label={showPassword ? 'Скрыть пароль' : 'Показать пароль'}
                                    className="register-password-toggle"
                                >
                                    {showPassword ? <FaEye /> : <FaEyeSlash />}
                                </Button>
                            </InputGroup>
                            <Form.Text className="text-muted">
                                Минимум 8 символов
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Подтвердите пароль *</Form.Label>
                            <InputGroup className="register-password-input-wrapper">
                                <Form.Control
                                    type={showRePassword ? 'text' : 'password'}
                                    name="re_password"
                                    value={formData.re_password}
                                    onChange={handleChange}
                                    placeholder="Повторите пароль"
                                    required
                                    minLength={8}
                                    autoComplete="new-password"
                                />
                                <Button
                                    type="button"
                                    variant="outline-secondary"
                                    onClick={() => setShowRePassword((p) => !p)}
                                    aria-label={showRePassword ? 'Скрыть пароль' : 'Показать пароль'}
                                    className="register-password-toggle"
                                >
                                    {showRePassword ? <FaEye /> : <FaEyeSlash />}
                                </Button>
                            </InputGroup>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Телефон</Form.Label>
                            <div className="register-phone-wrapper">
                                <span className="register-phone-prefix">+375 </span>
                                <Form.Control
                                    ref={phoneInputRef}
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder={EDITABLE_PLACEHOLDER}
                                    autoComplete="off"
                                    className="register-phone-input"
                                    aria-label="Код оператора и номер телефона"
                                />
                            </div>
                            <Form.Text className="text-muted">
                                Необязательно. Код оператора: 25, 29, 33 или 44 и 7 цифр номера
                            </Form.Text>
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Check
                                type="checkbox"
                                id="register-agree-terms"
                                checked={agreeToTerms}
                                onChange={(e) => {
                                    setAgreeToTerms(e.target.checked);
                                    if (termsError) setTermsError(false);
                                }}
                                className={termsError ? 'register-terms-checkbox is-invalid' : 'register-terms-checkbox'}
                                label={
                                    <span className="register-terms-label">
                                        Я согласен с{' '}
                                        <Link to="/terms" className="register-terms-link" onClick={(e) => e.stopPropagation()}>
                                            условиями пользования
                                        </Link>
                                        {' '}и{' '}
                                        <Link to="/privacy" className="register-terms-link" onClick={(e) => e.stopPropagation()}>
                                            политикой конфиденциальности
                                        </Link>
                                    </span>
                                }
                            />
                            {termsError && (
                                <div className="invalid-feedback d-block">
                                    Необходимо согласие с условиями и политикой конфиденциальности
                                </div>
                            )}
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

                    {/* Модальное окно об успешной регистрации в стиле GTA */}
                    <Modal
                        show={showSuccessModal}
                        onHide={() => setShowSuccessModal(false)}
                        centered
                        className="register-success-modal"
                    >
                        <Modal.Header closeButton className="register-success-modal-header">
                            <Modal.Title className="register-success-modal-title">MISSION PASSED</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="mb-0">
                                Регистрация прошла успешно. Теперь войдите в аккаунт, чтобы продолжить.
                            </p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="primary"
                                className="register-success-btn-login"
                                onClick={() => {
                                    setShowSuccessModal(false);
                                    // Пользователь уже авторизован по JWT после регистрации.
                                    // Перекидываем сразу на главную и перезагружаем страницу,
                                    // чтобы Navbar и остальное приложение подхватили состояние.
                                    navigate('/');
                                    window.location.reload();
                                }}
                            >
                                Войти
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Модальное окно: пароли не совпадают (стиль GTA — MISSION FAILED) */}
                    <Modal
                        show={showPasswordMismatchModal}
                        onHide={() => setShowPasswordMismatchModal(false)}
                        centered
                        className="register-failed-modal"
                    >
                        <Modal.Header closeButton className="register-failed-modal-header">
                            <Modal.Title className="register-failed-modal-title">MISSION FAILED</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <p className="mb-0">Пароли не совпадают</p>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowPasswordMismatchModal(false)}>
                                Закрыть
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Col>
            </Row>
        </Container>
    );
}

export default Register;
