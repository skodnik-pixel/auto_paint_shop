// frontend/src/components/Pickup.js
import React from 'react';
import { Container, Row, Col, Card, Alert } from 'react-bootstrap';
import { FaMapMarkerAlt, FaClock, FaPhone, FaEnvelope, FaRoute } from 'react-icons/fa';
import './Pickup.css';

function Pickup() {
    return (
        <Container className="my-5">
            <h2 className="mb-4">📍 Пункты самовывоза</h2>
            
            <Row>
                {/* Основная информация */}
                <Col lg={8} className="mb-4">
                    <Card className="h-100">
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🏪 Наш магазин-склад</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="contact-info-pickup mb-3">
                                <p className="mb-2">
                                    <FaMapMarkerAlt className="text-danger me-2" />
                                    <strong>Адрес:</strong> г. Минск, ул. Промышленная, 15А
                                </p>
                                <p className="mb-2">
                                    <FaClock className="text-info me-2" />
                                    <strong>Часы работы:</strong> пн-пт: 08:00 - 19:00, сб: 09:00 - 15:00, вс: выходной
                                </p>
                                <p className="mb-2">
                                    <FaPhone className="text-success me-2" />
                                    <strong>Телефон:</strong> <a href="tel:+375291234567">+375 (29) 123-45-67</a>
                                </p>
                                <p className="mb-3">
                                    <FaEnvelope className="text-warning me-2" />
                                    <strong>Email:</strong> <a href="mailto:info@bodyrepair.by">info@bodyrepair.by</a>
                                </p>
                            </div>
                            
                            <Alert variant="info">
                                <FaRoute className="me-2" />
                                <strong>Как добраться:</strong> От метро "Партизанская" автобусом №42 до остановки "Промышленная". 
                                Магазин находится в промышленной зоне, есть парковка для легковых автомобилей.
                            </Alert>
                            
                            {/* Карта Антарктиды как фон с иконкой местоположения */}
                            <div className="map-container mt-4" style={{
                                backgroundImage: 'url(/images/antarctica-map.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                height: '300px',
                                position: 'relative',
                                borderRadius: '10px',
                                border: '3px solid #2196f3',
                                overflow: 'hidden',
                                marginBottom: '50px'
                            }}>
                                {/* Полупрозрачный оверлей для лучшей читаемости */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(227, 242, 253, 0.3)',
                                    backdropFilter: 'blur(1px)'
                                }}></div>
                                
                                {/* Заголовок */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 2
                                }}>
                                    <h6 className="mb-0" style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '8px 15px',
                                        borderRadius: '20px',
                                        border: '2px solid #2196f3'
                                    }}>
                                        🗺️ Наше местоположение на карте
                                    </h6>
                                </div>
                                
                                {/* ИКОНКА МЕСТОПОЛОЖЕНИЯ С ВСПЛЫВАЮЩИМ ОКОШКОМ */}
                                <div style={{
                                    position: 'absolute',
                                    top: '45%',
                                    left: '60%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 3
                                }}>
                                    {/* Пульсирующая иконка местоположения */}
                                    <div className="location-pin" style={{
                                        fontSize: '40px',
                                        color: '#E31E24',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                    }}>
                                        📍
                                    </div>
                                    
                                    {/* Всплывающее окошко */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-60px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'white',
                                        padding: '10px 15px',
                                        borderRadius: '15px',
                                        border: '2px solid #E31E24',
                                        boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                                        whiteSpace: 'nowrap',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        📍 Где-то тут в Антарктиде
                                        {/* Стрелочка вниз */}
                                        <div style={{
                                            position: 'absolute',
                                            bottom: '-8px',
                                            left: '50%',
                                            transform: 'translateX(-50%)',
                                            width: 0,
                                            height: 0,
                                            borderLeft: '8px solid transparent',
                                            borderRight: '8px solid transparent',
                                            borderTop: '8px solid #E31E24'
                                        }}></div>
                                    </div>
                                </div>
                                
                                {/* Эмодзи пингвинов в углу */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    left: '15px',
                                    fontSize: '30px',
                                    zIndex: 2,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
                                }}>
                                    🐧 ❄️ 🏔️
                                </div>
                                
                                {/* Бейджи с погодой */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '15px',
                                    right: '15px',
                                    zIndex: 2
                                }}>
                                    <span className="badge bg-info me-1" style={{fontSize: '11px'}}>🌡️ -40°C</span>
                                    <span className="badge bg-warning me-1" style={{fontSize: '11px'}}>🌨️ Снежно</span>
                                    <span className="badge bg-success" style={{fontSize: '11px'}}>🐧 В наличии</span>
                                </div>
                                
                                {/* Подпись внизу */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: '-35px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 2
                                }}>
                                    <small className="text-muted" style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '5px 10px',
                                        borderRadius: '10px'
                                    }}>
                                        *Карта приблизительная, но очень точная 😉
                                    </small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Дополнительная информация */}
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-success text-white">
                            <h6 className="mb-0">✅ Преимущества самовывоза</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="list-unstyled mb-0">
                                <li className="mb-2">💰 Экономия на доставке</li>
                                <li className="mb-2">👀 Осмотр товара перед покупкой</li>
                                <li className="mb-2">🚀 Быстрое получение заказа</li>
                                <li className="mb-2">💬 Консультация специалиста</li>
                                <li>🎁 Возможные бонусы и скидки</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Card>
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">⚠️ Важная информация</h6>
                        </Card.Header>
                        <Card.Body>
                            <p className="small mb-2">
                                📞 Обязательно звоните перед приездом для подтверждения наличия товара
                            </p>
                            <p className="small mb-2">
                                🆔 При получении заказа имейте при себе документ, удостоверяющий личность
                            </p>
                            <p className="small mb-0">
                                🚗 Парковка бесплатная, но места ограничены
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Pickup;