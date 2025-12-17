// frontend/src/components/HowToOrder.js
import React from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { FaShoppingCart, FaPhone, FaEnvelope, FaStore, FaCreditCard } from 'react-icons/fa';

function HowToOrder() {
    return (
        <Container className="my-5">
            <h2 className="mb-4"><FaShoppingCart className="me-2" />Как сделать заказ</h2>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🛒 Способы оформления заказа</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-4">
                                    <Card className="border-success h-100">
                                        <Card.Header className="bg-success text-white text-center">
                                            <h6 className="mb-0">💻 Онлайн заказ</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <ol className="small">
                                                <li>Выберите товары в каталоге</li>
                                                <li>Добавьте их в корзину</li>
                                                <li>Перейдите в корзину</li>
                                                <li>Заполните контактные данные</li>
                                                <li>Выберите способ доставки</li>
                                                <li>Подтвердите заказ</li>
                                            </ol>
                                            <Badge bg="success" className="w-100">Самый быстрый способ</Badge>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                <Col md={6} className="mb-4">
                                    <Card className="border-info h-100">
                                        <Card.Header className="bg-info text-white text-center">
                                            <h6 className="mb-0"><FaPhone className="me-1" />По телефону</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="small mb-2">
                                                <strong>+375 (29) 123-45-67</strong>
                                            </p>
                                            <p className="small mb-2">
                                                Время работы:<br />
                                                пн-пт: 08:00 - 19:00<br />
                                                сб: 09:00 - 15:00
                                            </p>
                                            <p className="small mb-3">
                                                Наш менеджер поможет подобрать товары и оформить заказ
                                            </p>
                                            <Badge bg="info" className="w-100">Персональная консультация</Badge>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                <Col md={6} className="mb-4">
                                    <Card className="border-warning h-100">
                                        <Card.Header className="bg-warning text-dark text-center">
                                            <h6 className="mb-0"><FaEnvelope className="me-1" />По email</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="small mb-2">
                                                <strong>orders@bodyrepair.by</strong>
                                            </p>
                                            <p className="small mb-3">
                                                Отправьте список нужных товаров с указанием:
                                            </p>
                                            <ul className="small mb-3">
                                                <li>Наименование и артикул</li>
                                                <li>Количество</li>
                                                <li>Ваши контакты</li>
                                            </ul>
                                            <Badge bg="warning" className="w-100">Удобно для больших заказов</Badge>
                                        </Card.Body>
                                    </Card>
                                </Col>
                                
                                <Col md={6} className="mb-4">
                                    <Card className="border-danger h-100">
                                        <Card.Header className="bg-danger text-white text-center">
                                            <h6 className="mb-0"><FaStore className="me-1" />В магазине</h6>
                                        </Card.Header>
                                        <Card.Body>
                                            <p className="small mb-2">
                                                <strong>г. Минск, ул. Промышленная, 15А</strong>
                                            </p>
                                            <p className="small mb-2">
                                                Время работы:<br />
                                                пн-пт: 08:00 - 19:00<br />
                                                сб: 09:00 - 15:00
                                            </p>
                                            <p className="small mb-3">
                                                Можете посмотреть товары вживую и получить консультацию
                                            </p>
                                            <Badge bg="danger" className="w-100">Осмотр товара перед покупкой</Badge>
                                        </Card.Body>
                                    </Card>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mt-4">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">📋 Пошаговая инструкция онлайн-заказа</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={4} className="text-center mb-3">
                                    <div className="step-number bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold'}}>
                                        1
                                    </div>
                                    <h6>Выбор товаров</h6>
                                    <p className="small">Найдите нужные материалы в каталоге, используйте фильтры по категориям и брендам</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <div className="step-number bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold'}}>
                                        2
                                    </div>
                                    <h6>Добавление в корзину</h6>
                                    <p className="small">Нажмите "В корзину" у нужных товаров, проверьте количество и характеристики</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <div className="step-number bg-warning text-dark rounded-circle d-inline-flex align-items-center justify-content-center mb-2" style={{width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold'}}>
                                        3
                                    </div>
                                    <h6>Оформление</h6>
                                    <p className="small">Заполните контакты, выберите доставку и способ оплаты, подтвердите заказ</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0"><FaCreditCard className="me-2" />Способы оплаты</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li className="mb-2">💰 Наличными при получении</li>
                                <li className="mb-2">💳 Банковской картой</li>
                                <li className="mb-2">🏦 Банковский перевод</li>
                                <li className="mb-2">📱 Электронные деньги</li>
                                <li>💼 Безналичный расчет для юр. лиц</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">⏰ Время обработки заказов</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li className="mb-2">📞 Телефонные заказы: сразу</li>
                                <li className="mb-2">💻 Онлайн заказы: в течение 1 часа</li>
                                <li className="mb-2">📧 Email заказы: в течение 2 часов</li>
                                <li>🏪 В магазине: сразу</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Alert variant="success">
                        <h6>✅ Подтверждение заказа</h6>
                        <p className="small mb-2">
                            После оформления заказа вы получите:
                        </p>
                        <ul className="small mb-0">
                            <li>SMS с номером заказа</li>
                            <li>Звонок менеджера для подтверждения</li>
                            <li>Email с деталями заказа</li>
                        </ul>
                    </Alert>
                    
                    <Alert variant="warning">
                        <h6>⚠️ Важно знать</h6>
                        <ul className="small mb-0">
                            <li>Минимальная сумма заказа: 20 BYN</li>
                            <li>Резерв товара: 24 часа</li>
                            <li>Проверяйте наличие по телефону</li>
                            <li>Цены могут изменяться</li>
                        </ul>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default HowToOrder;