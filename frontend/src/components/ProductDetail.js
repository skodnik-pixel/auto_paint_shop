// frontend/src/components/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

function ProductDetail() {
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/catalog/products/?slug=${slug}`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
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

    const addToCart = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Необходимо войти в систему');
            return;
        }
        
        fetch(`${process.env.REACT_APP_API_URL}/cart/add_item/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ product_id: product.id, quantity: 1 })
        })
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then(data => alert('Товар добавлен в корзину!'))
            .catch(error => {
                console.error('Error adding to cart:', error);
                alert('Ошибка при добавлении товара в корзину');
            });
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