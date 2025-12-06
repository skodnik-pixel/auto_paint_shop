// frontend/src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        fetch(`${apiUrl}/catalog/products/?slug=${slug}`)
            .then(async response => {
                if (!response.ok) {
                    const text = await response.text();
                    throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                }
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/catalog/products/`);
                }
                return response.json();
            })
            .then(data => {
                setProduct(data.results?.[0] || data[0] || null);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching product:', error);
                setLoading(false);
            });
    }, [slug]);

    // Функция для добавления товара в корзину
    const addToCart = async () => {
        // Шаг 1: Получаем токен из localStorage
        const token = localStorage.getItem('token');
        
        // Шаг 2: Проверяем авторизацию
        if (!token) {
            alert('Необходимо войти в систему');
            return;
        }
        
        try {
            // Шаг 3: Формируем URL API
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            
            // Логируем для отладки
            console.log('=== ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ ===');
            console.log('URL:', `${apiUrl}/cart/add_item/`);
            console.log('Product Slug:', product.slug);
            
            // Шаг 4: Отправляем запрос
            // ВАЖНО: Правильный URL - /api/cart/add_item/ (без двойного cart)
            const response = await fetch(`${apiUrl}/cart/add_item/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify({ 
                    product_slug: product.slug, 
                    quantity: 1 
                })
            });

            console.log('Статус ответа:', response.status);

            // Шаг 5: Читаем ответ как текст
            const responseText = await response.text();
            console.log('Тело ответа:', responseText);

            // Шаг 6: Обрабатываем ответ
            if (response.ok) {
                // Успешно добавлено
                alert('Товар добавлен в корзину!');
            } else {
                // Ошибка от сервера
                try {
                    const errorData = responseText ? JSON.parse(responseText) : {};
                    alert(`Ошибка: ${errorData.error || errorData.detail || 'Не удалось добавить товар в корзину'}`);
                } catch (parseError) {
                    alert(`Ошибка: ${response.status} ${response.statusText}`);
                }
            }
        } catch (error) {
            // Шаг 7: Обрабатываем исключения
            console.error('Исключение при добавлении в корзину:', error);
            alert('Ошибка при добавлении товара в корзину');
        }
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!product) {
        return (
            <Container className="my-5">
                <p>Товар не найден</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <Row>
                <Col md={6}>
                    <Card.Img
                        src={product.image || 'https://via.placeholder.com/300'}
                        style={{ maxHeight: '400px', objectFit: 'cover' }}
                    />
                </Col>
                <Col md={6}>
                    <h2>{product.name}</h2>
                    <p><strong>Бренд:</strong> {product.brand.name}</p>
                    <p><strong>Категория:</strong> {product.category.name}</p>
                    <p>{product.description}</p>
                    <p><strong>Цена:</strong> {product.price} BYN</p>
                    <p><strong>В наличии:</strong> {product.stock} шт.</p>
                    <Button variant="primary" onClick={addToCart}>
                        Добавить в корзину
                    </Button>
                </Col>
            </Row>
        </Container>
    );
}

export default ProductDetail;