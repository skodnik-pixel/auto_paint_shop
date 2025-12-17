// frontend/src/components/ColorMatching.js
import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaPalette, FaCamera, FaFlask } from 'react-icons/fa';

function ColorMatching() {
    return (
        <Container className="my-5">
            <h2 className="mb-4"><FaPalette className="me-2" />Компьютерный подбор цвета</h2>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🎨 Профессиональный подбор краски</h5>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                Наша лаборатория оснащена современным спектрофотометром, который позволяет 
                                с высочайшей точностью определить цвет и подобрать соответствующую краску.
                            </p>
                            
                            <Row className="mt-4">
                                <Col md={4} className="text-center mb-3">
                                    <div className="mb-3">
                                        <FaCamera size={50} className="text-primary" />
                                    </div>
                                    <h6>Сканирование</h6>
                                    <p className="small">Точное определение цвета с помощью спектрофотометра</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <div className="mb-3">
                                        <FaFlask size={50} className="text-success" />
                                    </div>
                                    <h6>Анализ</h6>
                                    <p className="small">Компьютерный анализ и подбор формулы краски</p>
                                </Col>
                                <Col md={4} className="text-center mb-3">
                                    <div className="mb-3">
                                        <FaPalette size={50} className="text-warning" />
                                    </div>
                                    <h6>Смешивание</h6>
                                    <p className="small">Точное смешивание краски по полученной формуле</p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <Alert variant="success">
                        <h6>✅ Преимущества</h6>
                        <ul className="small mb-0">
                            <li>Точность подбора 99.9%</li>
                            <li>Работа с любыми оттенками</li>
                            <li>Быстрый результат</li>
                            <li>Гарантия совпадения</li>
                        </ul>
                    </Alert>
                    
                    <Card>
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">💰 Стоимость услуг</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li>Подбор цвета: 15 BYN</li>
                                <li>Смешивание краски: от 25 BYN</li>
                                <li>Экспресс-подбор: 25 BYN</li>
                            </ul>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default ColorMatching;