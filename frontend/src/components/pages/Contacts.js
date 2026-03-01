// frontend/src/components/Contacts.js
import React from 'react';
import { Container, Row, Col, Card, Alert, Form, Button } from 'react-bootstrap';
import { 
    FaPhone, 
    FaEnvelope, 
    FaMapMarkerAlt, 
    FaClock, 
    FaFacebookF, 
    FaInstagram, 
    FaTelegramPlane, 
    FaViber,
    FaCar,
    FaBus,
    FaRoute
} from 'react-icons/fa';
import './Contacts.css';

function Contacts() {
    return (
        <Container className="my-5">
            <h2 className="mb-4">📞 Контакты</h2>
            
            <Row>
                {/* Основная контактная информация */}
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🏢 Наши контакты</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-4">
                                    <h6><FaPhone className="text-success me-2" />Телефоны:</h6>
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Основной:</strong> 
                                            <a href="tel:+375291234567" className="ms-2">+375 (29) 123-45-67</a>
                                        </p>
                                        <small className="text-muted">Звонки, заказы, консультации</small>
                                    </div>
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Viber/Telegram:</strong> 
                                            <a href="tel:+375331234567" className="ms-2">+375 (33) 123-45-67</a>
                                        </p>
                                        <small className="text-muted">Быстрые вопросы и заказы</small>
                                    </div>
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Техподдержка:</strong> 
                                            <a href="tel:+375441234567" className="ms-2">+375 (44) 123-45-67</a>
                                        </p>
                                        <small className="text-muted">Консультации по материалам</small>
                                    </div>
                                </Col>
                                
                                <Col md={6} className="mb-4">
                                    <h6><FaEnvelope className="text-primary me-2" />Email адреса:</h6>
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Общие вопросы:</strong><br />
                                            <a href="mailto:info@bodyrepair.by">info@bodyrepair.by</a>
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Заказы:</strong><br />
                                            <a href="mailto:orders@bodyrepair.by">orders@bodyrepair.by</a>
                                        </p>
                                    </div>
                                    <div className="mb-3">
                                        <p className="mb-1">
                                            <strong>Оптовые продажи:</strong><br />
                                            <a href="mailto:wholesale@bodyrepair.by">wholesale@bodyrepair.by</a>
                                        </p>
                                    </div>
                                </Col>
                            </Row>
                            
                            <Row className="mt-4">
                                <Col md={6}>
                                    <h6><FaMapMarkerAlt className="text-danger me-2" />Адрес:</h6>
                                    <p className="mb-2">
                                        <strong>г. Минск, ул. Промышленная, 15А</strong><br />
                                        Промышленная зона, склад-магазин
                                    </p>
                                    <p className="small text-muted">
                                        Есть парковка для легковых автомобилей и грузового транспорта
                                    </p>
                                </Col>
                                
                                <Col md={6}>
                                    <h6><FaClock className="text-info me-2" />Режим работы:</h6>
                                    <div className="mb-2">
                                        <strong>Понедельник - Пятница:</strong> 08:00 - 19:00<br />
                                        <strong>Суббота:</strong> 09:00 - 15:00<br />
                                        <strong>Воскресенье:</strong> выходной
                                    </div>
                                    <p className="small text-muted">
                                        Обед: 13:00 - 14:00 (работает один менеджер)
                                    </p>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                    
                    {/* Как добраться */}
                    <Card className="mt-4">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0"><FaRoute className="me-2" />Как добраться</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h6><FaCar className="text-primary me-2" />На автомобиле:</h6>
                                    <ul className="small">
                                        <li>По МКАД до съезда на ул. Промышленную</li>
                                        <li>Проехать 2 км от МКАД</li>
                                        <li>Здание справа, большая вывеска</li>
                                        <li>Парковка перед зданием</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <h6><FaBus className="text-warning me-2" />Общественным транспортом:</h6>
                                    <ul className="small">
                                        <li>Метро "Партизанская"</li>
                                        <li>Автобус №42 до остановки "Промышленная"</li>
                                        <li>Пешком 300 метров</li>
                                        <li>Маршрутка №1234 (прямо до магазина)</li>
                                    </ul>
                                </Col>
                            </Row>
                            
                            <Alert variant="info" className="mt-3">
                                <strong>📍 Ориентиры:</strong> Рядом с заправкой "Белоруснефть", 
                                напротив автосервиса "Мастер", большая синяя вывеска "КУЗОВНОЙ РЕМОНТ"
                            </Alert>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Форма обратной связи и дополнительная информация */}
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">✉️ Написать нам</h6>
                        </Card.Header>
                        <Card.Body>
                            <Form>
                                <Form.Group className="mb-3">
                                    <Form.Label>Ваше имя:</Form.Label>
                                    <Form.Control type="text" placeholder="Введите имя" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Телефон:</Form.Label>
                                    <Form.Control type="tel" placeholder="+375 (__) ___-__-__" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Email:</Form.Label>
                                    <Form.Control type="email" placeholder="your@email.com" />
                                </Form.Group>
                                <Form.Group className="mb-3">
                                    <Form.Label>Сообщение:</Form.Label>
                                    <Form.Control as="textarea" rows={3} placeholder="Ваш вопрос или комментарий" />
                                </Form.Group>
                                <Button variant="primary" className="w-100">
                                    📧 Отправить сообщение
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0">📱 Мы в социальных сетях</h6>
                        </Card.Header>
                        <Card.Body className="text-center">
                            <div className="social-links-large">
                                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn btn-primary me-2 mb-2">
                                    <FaFacebookF /> Facebook
                                </a>
                                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn btn-danger me-2 mb-2">
                                    <FaInstagram /> Instagram
                                </a>
                                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="btn btn-info me-2 mb-2">
                                    <FaTelegramPlane /> Telegram
                                </a>
                                <a href="https://viber.com" target="_blank" rel="noopener noreferrer" className="btn btn-success mb-2">
                                    <FaViber /> Viber
                                </a>
                            </div>
                        </Card.Body>
                    </Card>
                    
                    <Alert variant="success">
                        <h6>🚀 Быстрый заказ</h6>
                        <p className="small mb-2">
                            Знаете что нужно? Звоните прямо сейчас:
                        </p>
                        <div className="text-center">
                            <a href="tel:+375291234567" className="btn btn-success btn-lg">
                                📞 +375 (29) 123-45-67
                            </a>
                        </div>
                    </Alert>
                    
                    <Alert variant="warning">
                        <h6>⏰ Режим работы в праздники</h6>
                        <p className="small mb-0">
                            В праздничные дни работаем по сокращенному графику. 
                            Уточняйте по телефону.
                        </p>
                    </Alert>
                </Col>
            </Row>
            
            {/* Карта (заглушка) */}
            <Row className="mt-4">
                <Col>
                    <Card>
                        <Card.Header>
                            <h5 className="mb-0">🗺️ Мы на карте</h5>
                        </Card.Header>
                        <Card.Body>
                            <div style={{
                                backgroundImage: 'url(/images/antarctica-map.jpg)',
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                height: '300px',
                                position: 'relative',
                                borderRadius: '8px',
                                border: '2px dashed #2196f3',
                                overflow: 'hidden',
                                marginBottom: '40px'
                            }}>
                                {/* Полупрозрачный оверлей для лучшей читаемости */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    bottom: 0,
                                    background: 'rgba(227, 242, 253, 0.2)'
                                }}></div>
                                
                                {/* Заголовок карты */}
                                <div style={{
                                    position: 'absolute',
                                    top: '15px',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    zIndex: 2
                                }}>
                                    <div style={{
                                        background: 'rgba(255,255,255,0.9)',
                                        padding: '8px 15px',
                                        borderRadius: '15px',
                                        border: '2px solid #2196f3',
                                        fontSize: '14px',
                                        fontWeight: 'bold'
                                    }}>
                                        🗺️ Наше местоположение на карте
                                    </div>
                                </div>
                                
                                {/* ИКОНКА МЕСТОПОЛОЖЕНИЯ С ВСПЛЫВАЮЩИМ ОКОШКОМ */}
                                <div style={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    transform: 'translate(-50%, -50%)',
                                    zIndex: 3
                                }}>
                                    {/* Пульсирующая иконка местоположения */}
                                    <div className="location-pin" style={{
                                        fontSize: '50px',
                                        color: '#E31E24',
                                        textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
                                    }}>
                                        📍
                                    </div>
                                    
                                    {/* Всплывающее окошко */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '-70px',
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: 'white',
                                        padding: '12px 18px',
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
                                    fontSize: '35px',
                                    zIndex: 2,
                                    textShadow: '2px 2px 4px rgba(0,0,0,0.7)'
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
                                        *Наш офис точно где-то здесь 😉
                                    </small>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default Contacts;