// frontend/src/components/TechnicalSupport.js
import React from 'react';
import { Container, Row, Col, Card, Alert, Badge } from 'react-bootstrap';
import { FaTools, FaPhoneAlt, FaQuestionCircle, FaBook } from 'react-icons/fa';

function TechnicalSupport() {
    return (
        <Container className="my-5">
            <h2 className="mb-4"><FaTools className="me-2" />Техническая поддержка</h2>
            
            <Row>
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🔧 Наши услуги технической поддержки</h5>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6} className="mb-3">
                                    <h6>🎨 Консультации по материалам:</h6>
                                    <ul className="small">
                                        <li>Подбор совместимых материалов</li>
                                        <li>Рекомендации по технологии нанесения</li>
                                        <li>Расчет расхода материалов</li>
                                        <li>Советы по подготовке поверхности</li>
                                        <li>Решение проблем с адгезией</li>
                                    </ul>
                                </Col>
                                <Col md={6} className="mb-3">
                                    <h6>⚙️ Помощь с оборудованием:</h6>
                                    <ul className="small">
                                        <li>Настройка краскопультов</li>
                                        <li>Подбор сопел и игл</li>
                                        <li>Регулировка давления</li>
                                        <li>Обслуживание инструмента</li>
                                        <li>Устранение неисправностей</li>
                                    </ul>
                                </Col>
                            </Row>
                            
                            <Alert variant="info" className="mt-3">
                                <h6><FaBook className="me-2" />Обучающие материалы</h6>
                                <p className="mb-2">Мы предоставляем:</p>
                                <Row>
                                    <Col md={6}>
                                        <ul className="small mb-0">
                                            <li>📖 Технические карты материалов</li>
                                            <li>🎥 Видеоинструкции по применению</li>
                                            <li>📋 Пошаговые руководства</li>
                                        </ul>
                                    </Col>
                                    <Col md={6}>
                                        <ul className="small mb-0">
                                            <li>🔬 Таблицы совместимости</li>
                                            <li>📊 Калькуляторы расхода</li>
                                            <li>⚠️ Рекомендации по безопасности</li>
                                        </ul>
                                    </Col>
                                </Row>
                            </Alert>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mt-4">
                        <Card.Header className="bg-success text-white">
                            <h5 className="mb-0">❓ Часто задаваемые вопросы</h5>
                        </Card.Header>
                        <Card.Body>
                            <div className="accordion" id="faqAccordion">
                                <div className="mb-3 border rounded">
                                    <h6 className="p-3 mb-0 bg-light">
                                        <FaQuestionCircle className="me-2 text-primary" />
                                        Как правильно разбавить краску?
                                    </h6>
                                    <div className="p-3">
                                        <p className="small mb-0">
                                            Соотношение краски и растворителя зависит от типа материала и способа нанесения. 
                                            Обычно для краскопульта используется соотношение 2:1 (краска:растворитель). 
                                            Всегда следуйте инструкциям производителя.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mb-3 border rounded">
                                    <h6 className="p-3 mb-0 bg-light">
                                        <FaQuestionCircle className="me-2 text-primary" />
                                        Почему краска плохо ложится?
                                    </h6>
                                    <div className="p-3">
                                        <p className="small mb-0">
                                            Основные причины: плохая подготовка поверхности, загрязнения, несовместимость материалов, 
                                            неправильная температура или влажность. Проверьте чистоту поверхности и совместимость грунта с краской.
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="mb-3 border rounded">
                                    <h6 className="p-3 mb-0 bg-light">
                                        <FaQuestionCircle className="me-2 text-primary" />
                                        Как рассчитать расход материала?
                                    </h6>
                                    <div className="p-3">
                                        <p className="small mb-0">
                                            Средний расход краски: 150-200 г/м². Для расчета умножьте площадь поверхности на расход 
                                            и добавьте 10-15% запаса. Учитывайте количество слоев и тип поверхности.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-danger text-white">
                            <h6 className="mb-0"><FaPhoneAlt className="me-2" />Контакты поддержки</h6>
                        </Card.Header>
                        <Card.Body>
                            <div className="mb-3">
                                <strong>Горячая линия:</strong><br />
                                <span className="h5 text-danger">+375 (29) 123-45-67</span>
                            </div>
                            <div className="mb-3">
                                <strong>Email:</strong><br />
                                <a href="mailto:support@bodyrepair.by">support@bodyrepair.by</a>
                            </div>
                            <div className="mb-3">
                                <strong>Время работы:</strong><br />
                                пн-пт: 08:00 - 19:00<br />
                                сб: 09:00 - 15:00<br />
                                вс: выходной
                            </div>
                            <Badge bg="success" className="w-100">Бесплатные консультации</Badge>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">⚡ Экстренная помощь</h6>
                        </Card.Header>
                        <Card.Body>
                            <p className="small mb-2">
                                Если у вас возникла критическая проблема в процессе работы:
                            </p>
                            <ul className="small mb-3">
                                <li>Остановите работу</li>
                                <li>Сфотографируйте проблему</li>
                                <li>Позвоните нам немедленно</li>
                            </ul>
                            <Badge bg="warning" className="w-100">Ответ в течение 15 минут</Badge>
                        </Card.Body>
                    </Card>
                    
                    <Alert variant="info">
                        <h6>📚 Обучение</h6>
                        <p className="small mb-2">
                            Проводим бесплатные семинары для наших клиентов:
                        </p>
                        <ul className="small mb-0">
                            <li>Новые технологии покраски</li>
                            <li>Работа с современными материалами</li>
                            <li>Устранение дефектов покрытия</li>
                        </ul>
                    </Alert>
                    
                    <Alert variant="success">
                        <h6>🎯 Выездные консультации</h6>
                        <p className="small mb-0">
                            Для крупных клиентов организуем выезд технического специалиста 
                            на объект для решения сложных задач.
                        </p>
                    </Alert>
                </Col>
            </Row>
        </Container>
    );
}

export default TechnicalSupport;