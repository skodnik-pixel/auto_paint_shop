// frontend/src/components/Wholesale.js
import React from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge, Button } from 'react-bootstrap';
import { FaHandshake, FaPercentage, FaTruck, FaFileContract, FaPhoneAlt, FaEnvelope } from 'react-icons/fa';
import './Wholesale.css';

function Wholesale() {
    return (
        <Container className="my-5">
            <h2 className="mb-4"><FaHandshake className="me-2" />Оптовым покупателям</h2>
            
            <Row>
                {/* Условия сотрудничества */}
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🤝 Условия оптового сотрудничества</h5>
                        </Card.Header>
                        <Card.Body>
                            <Alert variant="success">
                                <h6><FaPercentage className="me-2" />Скидки от объема закупки:</h6>
                                <Table className="mb-0">
                                    <thead>
                                        <tr>
                                            <th>Сумма заказа</th>
                                            <th>Скидка</th>
                                            <th>Дополнительные условия</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>от 1 000 BYN</td>
                                            <td><Badge bg="success">5%</Badge></td>
                                            <td>Стандартные условия</td>
                                        </tr>
                                        <tr>
                                            <td>от 5 000 BYN</td>
                                            <td><Badge bg="success">10%</Badge></td>
                                            <td>Бесплатная доставка по Минску</td>
                                        </tr>
                                        <tr>
                                            <td>от 10 000 BYN</td>
                                            <td><Badge bg="success">15%</Badge></td>
                                            <td>Отсрочка платежа до 30 дней</td>
                                        </tr>
                                        <tr>
                                            <td>от 25 000 BYN</td>
                                            <td><Badge bg="warning">20%</Badge></td>
                                            <td>Индивидуальные условия</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            </Alert>
                            
                            <Row className="mt-4">
                                <Col md={6}>
                                    <Card className="border-success">
                                        <Card.Header className="bg-success text-white">
                                            <h6 className="mb-0"><FaTruck className="me-2" />Доставка</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <ul className="mb-0">
                                                <li>🚛 Собственный транспорт</li>
                                                <li>📦 Доставка по всей Беларуси</li>
                                                <li>⏰ Доставка в день заказа (Минск)</li>
                                                <li>🏗️ Доставка на объект</li>
                                                <li>📋 Разгрузка и подъем материалов</li>
                                            </ul>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                <Col md={6}>
                                    <Card className="border-info">
                                        <Card.Header className="bg-info text-white">
                                            <h6 className="mb-0"><FaFileContract className="me-2" />Документооборот</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <ul className="mb-0">
                                                <li>📄 Договор поставки</li>
                                                <li>🧾 Счета-фактуры</li>
                                                <li>📋 Товарные накладные</li>
                                                <li>🏦 Безналичный расчет</li>
                                                <li>📊 Ежемесячные отчеты</li>
                                            </ul>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    
                    {/* Преимущества работы с нами */}
                    <Card className="mt-4">
                        <Card.Header className="bg-warning text-dark">
                            <h5 className="mb-0">⭐ Преимущества работы с нами</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h6>🏆 Качество и надежность:</h6>
                                    <ul>
                                        <li>Только оригинальные материалы</li>
                                        <li>Сертификаты качества</li>
                                        <li>Гарантия на всю продукцию</li>
                                        <li>Контроль сроков годности</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <h6>🚀 Сервис и поддержка:</h6>
                                    <ul>
                                        <li>Персональный менеджер</li>
                                        <li>Техническая поддержка</li>
                                        <li>Обучение персонала</li>
                                        <li>Консультации по применению</li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Контакты и заявка */}
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-danger text-white">
                            <h6 className="mb-0">📞 Отдел оптовых продаж</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="contact-info">
                                <p className="mb-2">
                                    <FaPhoneAlt className="text-success me-2" />
                                    <strong>Телефон:</strong><br />
                                    <a href="tel:+375291234567">+375 (29) 123-45-67</a>
                                </p>
                                <p className="mb-2">
                                    <FaEnvelope className="text-primary me-2" />
                                    <strong>Email:</strong><br />
                                    <a href="mailto:wholesale@bodyrepair.by">wholesale@bodyrepair.by</a>
                                </p>
                                <p className="mb-3">
                                    <strong>Менеджер:</strong><br />
                                    Иванов Иван Иванович
                                </p>
                                <Button variant="success" className="w-100 mb-2">
                                    📞 Заказать звонок
                                </Button>
                                <Button variant="outline-primary" className="w-100">
                                    📧 Отправить заявку
                                </Button>
                            </div>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">📋 Для оформления заявки</h6>
                        </Card.Header>
                        <Card.Body>
                            <p className="small mb-2">Подготовьте следующие документы:</p>
                            <ul className="small mb-0">
                                <li>Справка о государственной регистрации</li>
                                <li>Справка о постановке на учет в налоговом органе</li>
                                <li>Банковские реквизиты</li>
                                <li>Контактные данные</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Alert variant="warning">
                        <h6>🎯 Специальные предложения</h6>
                        <p className="small mb-2">
                            Для новых оптовых клиентов действует акция: 
                            <strong> скидка 25% на первый заказ</strong> от 3000 BYN!
                        </p>
                        <p className="small mb-0">
                            Акция действует до конца месяца.
                        </p>
                    </Alert>
                </Col>
            </Row>
            
            {/* Популярные товары для оптовиков */}
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">🔥 Популярные товары для оптовых закупок</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={3}>
                                    <h6>🎨 Краски и лаки:</h6>
                                    <ul className="small">
                                        <li>Базовые краски DUXONE</li>
                                        <li>Лаки NOVOL</li>
                                        <li>Металлики SPECTRAL</li>
                                    </ul>
                                </Col>
                                <Col md={3}>
                                    <h6>🛠️ Грунты и шпатлевки:</h6>
                                    <ul className="small">
                                        <li>Грунты BODY</li>
                                        <li>Шпатлевки NOVOL</li>
                                        <li>Антикоррозийные составы</li>
                                    </ul>
                                </Col>
                                <Col md={3}>
                                    <h6>🪚 Абразивы:</h6>
                                    <ul className="small">
                                        <li>Наждачная бумага 3M</li>
                                        <li>Диски Mirka</li>
                                        <li>Полировальные круги</li>
                                    </ul>
                                </Col>
                                <Col md={3}>
                                    <h6>⚙️ Инструменты:</h6>
                                    <ul className="small">
                                        <li>Краскопульты SATA</li>
                                        <li>Компрессоры</li>
                                        <li>Пневмоинструмент</li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Wholesale;