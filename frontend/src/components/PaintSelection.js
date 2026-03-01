// frontend/src/components/PaintSelection.js
import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Badge } from 'react-bootstrap';
import { FaPalette, FaSearch, FaCar, FaCheckCircle, FaInfoCircle } from 'react-icons/fa';
import './PaintSelection.css';

function PaintSelection() {
    const [searchCode, setSearchCode] = useState('');
    const [searchResult, setSearchResult] = useState(null);
    
    // Имитация поиска краски по коду
    const handleSearch = (e) => {
        e.preventDefault();
        if (searchCode.trim()) {
            // Имитация результата поиска
            setSearchResult({
                code: searchCode,
                name: 'Металлик Серебристый',
                brand: 'DUXONE',
                price: '45.90',
                available: true
            });
        }
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4 text-center"><FaPalette className="me-2" />Подбор краски по коду</h2>
            
            <Row>
                {/* Форма поиска */}
                <Col lg={8} className="mb-4">
                    <Card>
                        <Card.Header className="bg-primary text-white">
                            <h5 className="mb-0">🔍 Поиск краски по коду</h5>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={handleSearch}>
                                <Row>
                                    <Col md={8}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Введите код краски:</Form.Label>
                                            <Form.Control
                                                type="text"
                                                placeholder="Например: 040, 1K0, L90E, etc."
                                                value={searchCode}
                                                onChange={(e) => setSearchCode(e.target.value)}
                                                size="lg"
                                            />
                                            <Form.Text className="text-muted">
                                                Код краски обычно указан на табличке в моторном отсеке или в документах на автомобиль
                                            </Form.Text>
                                        </Form.Group>
                                    </Col>
                                    <Col md={4} className="d-flex align-items-end">
                                        <Button 
                                            type="submit" 
                                            variant="success" 
                                            size="lg" 
                                            className="w-100 mb-3"
                                        >
                                            <FaSearch className="me-2" />Найти краску
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                            
                            {/* Результат поиска */}
                            {searchResult && (
                                <Alert variant="success" className="mt-4">
                                    <h6><FaCheckCircle className="me-2" />Краска найдена!</h6>
                                    <Table className="mb-0">
                                        <tbody>
                                            <tr>
                                                <td><strong>Код:</strong></td>
                                                <td>{searchResult.code}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Название:</strong></td>
                                                <td>{searchResult.name}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Бренд:</strong></td>
                                                <td>{searchResult.brand}</td>
                                            </tr>
                                            <tr>
                                                <td><strong>Цена:</strong></td>
                                                <td>
                                                    <Badge bg="success">{searchResult.price} BYN</Badge>
                                                    {searchResult.available && (
                                                        <Badge bg="info" className="ms-2">В наличии</Badge>
                                                    )}
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                    <Button variant="primary" className="mt-3">
                                        <FaCar className="me-2" />Заказать краску
                                    </Button>
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                    
                    {/* Популярные коды */}
                    <Card className="mt-4">
                        <Card.Header>
                            <h6 className="mb-0">🔥 Популярные коды красок</h6>
                        </Card.Header>
                        <Card.Body>
                            <Row>
                                <Col md={6}>
                                    <h6>Volkswagen/Audi/Skoda:</h6>
                                    <ul className="list-unstyled">
                                        <li><Badge bg="secondary" className="me-2">L90E</Badge>Белый</li>
                                        <li><Badge bg="secondary" className="me-2">LY9B</Badge>Черный</li>
                                        <li><Badge bg="secondary" className="me-2">LY7W</Badge>Серый</li>
                                        <li><Badge bg="secondary" className="me-2">LC9A</Badge>Красный</li>
                                    </ul>
                                </Col>
                                <Col md={6}>
                                    <h6>BMW/Mercedes:</h6>
                                    <ul className="list-unstyled">
                                        <li><Badge bg="secondary" className="me-2">300</Badge>Альпийский белый</li>
                                        <li><Badge bg="secondary" className="me-2">668</Badge>Черный сапфир</li>
                                        <li><Badge bg="secondary" className="me-2">A96</Badge>Серый металлик</li>
                                        <li><Badge bg="secondary" className="me-2">B66</Badge>Синий металлик</li>
                                    </ul>
                                </Col>
                            </Row>
                        </Card.Body>
                    </Card>
                </Col>
                
                {/* Информация о услуге */}
                <Col lg={4}>
                    <Card className="mb-3">
                        <Card.Header className="bg-info text-white">
                            <h6 className="mb-0"><FaInfoCircle className="me-2" />Как это работает?</h6>
                        </Card.Header>
                        <Card.Body>
                            <ol className="small">
                                <li className="mb-2">Найдите код краски на табличке в моторном отсеке</li>
                                <li className="mb-2">Введите код в форму поиска</li>
                                <li className="mb-2">Получите точное название и цену</li>
                                <li className="mb-2">Оформите заказ онлайн или по телефону</li>
                                <li>Получите краску с доставкой или самовывозом</li>
                            </ol>
                        </Card.Body>
                    </Card>
                    
                    <Card className="mb-3">
                        <Card.Header className="bg-warning text-dark">
                            <h6 className="mb-0">⚠️ Важно знать</h6>
                        </Card.Header>
                        <Card.Body>
                            <ul className="small mb-0">
                                <li className="mb-2">Код краски может отличаться в зависимости от года выпуска</li>
                                <li className="mb-2">Для точного подбора лучше привезти образец</li>
                                <li className="mb-2">Металлик и перламутр требуют специальной технологии</li>
                                <li>Мы гарантируем 100% совпадение цвета</li>
                            </ul>
                        </Card.Body>
                    </Card>
                    
                    <Card>
                        <Card.Header className="bg-success text-white">
                            <h6 className="mb-0">📞 Нужна помощь?</h6>
                        </Card.Header>
                        <Card.Body>
                            <p className="small mb-2">
                                Наши специалисты помогут подобрать краску по фото или образцу
                            </p>
                            <p className="small mb-2">
                                <strong>Телефон:</strong> +375 (29) 123-45-67
                            </p>
                            <p className="small mb-0">
                                <strong>Email:</strong> paint@bodyrepair.by
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}

export default PaintSelection;