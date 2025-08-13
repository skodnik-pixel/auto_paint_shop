// frontend/src/components/CreateProduct.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/catalog/categories/`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then(data => setCategories(data.results || data))
            .catch(error => console.error('Error fetching categories:', error));
            
        fetch(`${process.env.REACT_APP_API_URL}/catalog/brands/`)
            .then(response => {
                if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                return response.json();
            })
            .then(data => setBrands(data.results || data))
            .catch(error => console.error('Error fetching brands:', error));
    }, []);

    const handleSubmit = () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setError('Пожалуйста, войдите в аккаунт');
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/catalog/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                slug,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category,
                brand,
            }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Ошибка создания продукта');
                return response.json();
            })
            .then(data => {
                alert('Продукт создан!');
                navigate('/');
            })
            .catch(error => {
                setError(error.message);
            });
    };

    return (
        <Container className="my-5">
            <h2 className="mb-4">Создать продукт</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form>
                <Form.Group className="mb-3">
                    <Form.Label>Название</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Слаг</Form.Label>
                    <Form.Control
                        type="text"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Описание</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Цена</Form.Label>
                    <Form.Control
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>В наличии</Form.Label>
                    <Form.Control
                        type="number"
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Категория</Form.Label>
                    <Form.Select
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Выберите категорию</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Бренд</Form.Label>
                    <Form.Select
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
                    >
                        <option value="">Выберите бренд</option>
                        {brands.map(br => (
                            <option key={br.id} value={br.id}>
                                {br.name}
                            </option>
                        ))}
                    </Form.Select>
                </Form.Group>
                <Button variant="primary" onClick={handleSubmit}>
                    Создать
                </Button>
            </Form>
        </Container>
    );
}

export default CreateProduct;