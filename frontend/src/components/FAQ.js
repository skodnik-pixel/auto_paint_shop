// frontend/src/components/FAQ.js
import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';

function FAQ() {
    const faqs = [
        {
            question: "Как долго хранится краска?",
            answer: "В закрытой упаковке при температуре +5...+25°C краска хранится 12-24 месяца в зависимости от типа."
        },
        {
            question: "Можно ли смешивать краски разных производителей?",
            answer: "Не рекомендуется. Лучше использовать материалы одного производителя для гарантии совместимости."
        },
        {
            question: "Какое давление нужно для краскопульта?",
            answer: "Обычно 2-3 атмосферы для базовых красок и 1.5-2 атмосферы для лаков. Точные параметры указаны в инструкции."
        }
    ];

    return (
        <Container className="my-5">
            <h2 className="mb-4"><FaQuestionCircle className="me-2" />Вопросы и ответы</h2>
            
            <Row>
                <Col>
                    {faqs.map((faq, index) => (
                        <Card key={index} className="mb-3">
                            <Card.Header>
                                <h6 className="mb-0">❓ {faq.question}</h6>
                            </Card.Header>
                            <Card.Body>
                                <p className="mb-0">✅ {faq.answer}</p>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
            </Row>
        </Container>
    );
}

export default FAQ;