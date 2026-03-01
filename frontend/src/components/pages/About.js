// frontend/src/components/About.js
import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaAward, FaUsers, FaTruck, FaTools } from 'react-icons/fa';
import './About.css';

function About() {
    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center">🏢 О компании</h2>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">Наша история</h5>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                <strong>Кузовной Ремонт</strong> — это ведущий поставщик профессиональных материалов 
                                для кузовного ремонта и покраски автомобилей в Беларуси. Мы работаем на рынке уже более 
                                <strong> 15 лет</strong> и за это время завоевали доверие тысяч клиентов.
                            </p>
                            <p>
                                Наша компания специализируется на поставке высококачественных материалов от ведущих 
                                мировых производителей: <strong>NOVOL, BODY, SPECTRAL, DUXONE, SATA, DeVilbiss, 3M, Mirka</strong> и других.
                            </p>
                            <p>
                                Мы понимаем, что качественный кузовной ремонт требует не только профессиональных навыков, 
                                но и надежных материалов. Поэтому мы тщательно отбираем продукцию, которую предлагаем 
                                нашим клиентам.
                            </p>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mt-4">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">Наша миссия</h5>
                        </Card.Header>
                        <Card.Body>
                            <Alert variant="success">
                                <h6>🎯 Наша цель</h6>
                                <p className="mb-0">
                                    Обеспечить профессионалов кузовного ремонта качественными материалами и инструментами, 
                                    которые помогают создавать идеальный результат и удовлетворять потребности самых 
                                    требовательных клиентов.
                                </p>
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0"><FaAward className="me-2" />Наши достижения</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">🏆 15+ лет на рынке</li>
                                <li className="mb-2">👥 5000+ довольных клиентов</li>
                                <li className="mb-2">📦 50000+ выполненных заказов</li>
                                <li className="mb-2">🌟 4.8/5 средний рейтинг</li>
                                <li>🚚 Доставка по всей Беларуси</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0"><FaUsers className="me-2" />Наша команда</h6>
                        </Card.Header>
                        <Card.Body>
                            <p className="small mb-2">
                                В нашей команде работают опытные специалисты с глубокими знаниями в области кузовного ремонта.
                            </p>
                            <ul className="small mb-0">
                                <li>Технические консультанты</li>
                                <li>Специалисты по подбору красок</li>
                                <li>Менеджеры по работе с клиентами</li>
                                <li>Логисты и водители</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Card>
                        <Card.Header className="bg-danger text-white">
                            <h6 className="mb-0"><FaTools className="me-2" />Наши услуги</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li>🎨 Подбор краски по коду</li>
                                <li>📞 Техническая поддержка</li>
                                <li>🚛 Доставка материалов</li>
                                <li>💼 Работа с оптовыми клиентами</li>
                                <li>📚 Обучение и консультации</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            <Row className="mt-4">
                <Col>
                    <Alert variant="primary">
                        <h5><FaTruck className="me-2" />Почему выбирают нас?</h5>
                        <Row>
                            <Col md={6}>
                                <ul className="mb-0">
                                    <li>✅ Только оригинальная продукция</li>
                                    <li>✅ Конкурентные цены</li>
                                    <li>✅ Быстрая доставка</li>
                                    <li>✅ Профессиональные консультации</li>
                                </ul>
                            </Col>
                            <Col md={6}>
                                <ul className="mb-0">
                                    <li>✅ Гибкая система скидок</li>
                                    <li>✅ Техническая поддержка</li>
                                    <li>✅ Индивидуальный подход</li>
                                    <li>✅ Гарантия качества</li>
                                </ul>
                            </Col>
                        </Row>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default About;