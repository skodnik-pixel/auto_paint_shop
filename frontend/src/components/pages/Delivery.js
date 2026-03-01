// frontend/src/components/Delivery.js
import React from 'react';
import { Container, Row, Col, Card, Table, Alert, Badge } from 'react-bootstrap';
import { FaTruck, FaCreditCard, FaMoneyBillWave, FaClock, FaShieldAlt } from 'react-icons/fa';
import './Delivery.css';

function Delivery() {
    return (
        <Container className="my-5 delivery-page">
            <h2 className="mb-4 text-center">🚚 Доставка и оплата</h2>
            
            <Row>
                {/* Способы доставки */}
                <Col lg={6} className="mb-4">
                    <Card style={{ minHeight: '500px' }}>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0"><FaTruck className="me-2" />Способы доставки</h5>
                        </Card.Header>
                        <Card.Body>
                            <Table striped hover responsive>
                                <thead>
                                    <tr>
                                        <th>Способ доставки</th>
                                        <th>Стоимость</th>
                                        <th>Срок</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>
                                            🚗 Курьер по Минску
                                            <br />
                                            <small className="text-muted">в пределах МКАД</small>
                                        </td>
                                        <td>
                                            <Badge bg="success">10 BYN</Badge>
                                            <br />
                                            <small className="text-muted">от 100 BYN - бесплатно</small>
                                        </td>
                                        <td>1-2 дня</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            📦 Почта Беларуси
                                            <br />
                                            <small className="text-muted">по всей Беларуси</small>
                                        </td>
                                        <td>
                                            <Badge bg="info">от 5 BYN</Badge>
                                            <br />
                                            <small className="text-muted">зависит от веса</small>
                                        </td>
                                        <td>3-7 дней</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            🏪 Самовывоз
                                            <br />
                                            <small className="text-muted">ул. Промышленная, 15А</small>
                                        </td>
                                        <td>
                                            <Badge bg="success">Бесплатно</Badge>
                                        </td>
                                        <td>Сразу</td>
                                    </tr>
                                    <tr>
                                        <td>
                                            🚛 Транспортная компания
                                            <br />
                                            <small className="text-muted">крупные заказы</small>
                                        </td>
                                        <td>
                                            <Badge bg="warning">По тарифам ТК</Badge>
                                        </td>
                                        <td>2-5 дней</td>
                                    </tr>
                                </tbody>
                            </Table>
                            
                            <Alert variant="info" className="mt-3">
                                <FaClock className="me-2" />
                                <strong>Время доставки курьером:</strong> с 9:00 до 18:00 в рабочие дни
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Способы оплаты */}
                <Col lg={6} className="mb-4 delivery-payment-col">
                    <Card style={{ minHeight: '500px' }} className="delivery-payment-card">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0"><FaCreditCard className="me-2" />Способы оплаты</h5>
                        </Card.Header>
                        <Card.Body className="delivery-payment-body">
                            <div className="payment-methods">
                                <div className="payment-method mb-3 p-2 border rounded">
                                    <h6><FaMoneyBillWave className="text-success me-2" />Наличными</h6>
                                    <ul className="mb-0 small">
                                        <li>При получении товара курьером</li>
                                        <li>При самовывозе в магазине</li>
                                        <li>Возможна оплата в рублях, долларах, евро</li>
                                    </ul>
                                </div>
                                
                                <div className="payment-method mb-3 p-2 border rounded">
                                    <h6><FaCreditCard className="text-primary me-2" />Банковской картой</h6>
                                    <ul className="mb-0 small">
                                        <li>💳 Visa, MasterCard, Белкарт</li>
                                        <li>🏪 В магазине через терминал</li>
                                        <li>💻 Онлайн-оплата на сайте</li>
                                    </ul>
                                </div>
                                
                                <div className="payment-method mb-3 p-2 border rounded">
                                    <h6><FaShieldAlt className="text-info me-2" />Безналичный расчет</h6>
                                    <ul className="mb-0 small">
                                        <li>🏦 Банковский перевод</li>
                                        <li>📄 Выставление счета для юр. лиц</li>
                                        <li>📱 Электронные деньги (WebMoney, Яндекс.Деньги)</li>
                                    </ul>
                                </div>
                                
                                <div className="payment-method p-2 border rounded bg-light">
                                    <h6>🎁 Рассрочка и кредит</h6>
                                    <ul className="mb-0 small">
                                        <li>Рассрочка до 12 месяцев</li>
                                        <li>Кредит через банки-партнеры</li>
                                        <li>Для постоянных клиентов - отсрочка платежа</li>
                                    </ul>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Дополнительная информация */}
            <Row className="mt-4">
                <Col lg={4}>
                    <Alert variant="warning">
                        <h6>⚠️ Важно знать</h6>
                        <ul className="mb-0 small">
                            <li>Доставка хрупких товаров - дополнительно 5 BYN</li>
                            <li>Подъем на этаж (выше 2-го) - 2 BYN за этаж</li>
                            <li>Доставка в выходные - по согласованию</li>
                        </ul>
                    </Alert>
                </Col>
                <Col lg={4}>
                    <Alert variant="success">
                        <h6>✅ Гарантии</h6>
                        <ul className="mb-0 small">
                            <li>Проверка товара при получении</li>
                            <li>Возврат в течение 14 дней</li>
                            <li>Гарантия качества от производителя</li>
                        </ul>
                    </Alert>
                </Col>
                <Col lg={4}>
                    <Alert variant="info">
                        <h6>📞 Контакты службы доставки</h6>
                        <p className="mb-1 small">
                            <strong>Телефон:</strong> +375 (29) 123-45-67
                        </p>
                        <p className="mb-0 small">
                            <strong>Email:</strong> delivery@bodyrepair.by
                        </p>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default Delivery;