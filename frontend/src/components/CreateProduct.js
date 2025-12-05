// frontend/src/components/CreateProduct.js
import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

function CreateProduct() {
    const [name, setName] = useState('');
    const [slug, setSlug] = useState('');
    const [description, setDescription] = useState('');

    // Функция для преобразования текста в slug формат
    const convertToSlug = (text) => {
        if (!text) return '';
        
        return text
            .toLowerCase()
            .trim()
            // Заменяем кириллицу на латиницу (включая заглавные)
            .replace(/[А-ЯЁа-яё]/g, (char) => {
                const map = {
                    'а': 'a', 'А': 'a', 'б': 'b', 'Б': 'b', 'в': 'v', 'В': 'v',
                    'г': 'g', 'Г': 'g', 'д': 'd', 'Д': 'd', 'е': 'e', 'Е': 'e',
                    'ё': 'yo', 'Ё': 'yo', 'ж': 'zh', 'Ж': 'zh', 'з': 'z', 'З': 'z',
                    'и': 'i', 'И': 'i', 'й': 'y', 'Й': 'y', 'к': 'k', 'К': 'k',
                    'л': 'l', 'Л': 'l', 'м': 'm', 'М': 'm', 'н': 'n', 'Н': 'n',
                    'о': 'o', 'О': 'o', 'п': 'p', 'П': 'p', 'р': 'r', 'Р': 'r',
                    'с': 's', 'С': 's', 'т': 't', 'Т': 't', 'у': 'u', 'У': 'u',
                    'ф': 'f', 'Ф': 'f', 'х': 'h', 'Х': 'h', 'ц': 'ts', 'Ц': 'ts',
                    'ч': 'ch', 'Ч': 'ch', 'ш': 'sh', 'Ш': 'sh', 'щ': 'sch', 'Щ': 'sch',
                    'ъ': '', 'Ъ': '', 'ы': 'y', 'Ы': 'y', 'ь': '', 'Ь': '',
                    'э': 'e', 'Э': 'e', 'ю': 'yu', 'Ю': 'yu', 'я': 'ya', 'Я': 'ya'
                };
                return map[char] || char;
            })
            // Заменяем точки на дефисы (для весов типа 1.8кг)
            .replace(/\./g, '-')
            // Удаляем все символы кроме букв, цифр, пробелов, дефисов и подчеркиваний
            .replace(/[^a-z0-9\s_-]/g, '')
            // Заменяем пробелы на дефисы
            .replace(/\s+/g, '-')
            // Заменяем множественные дефисы на один
            .replace(/-+/g, '-')
            // Удаляем дефисы в начале и конце
            .replace(/^-+|-+$/g, '');
    };

    // Обработка изменения названия
    const handleNameChange = (e) => {
        setName(e.target.value);
    };

    // Обработка изменения slug - можно вводить название, оно преобразуется автоматически
    const handleSlugChange = (e) => {
        const inputValue = e.target.value;
        setSlug(inputValue);
    };

    // Преобразование slug в правильный формат при потере фокуса
    const handleSlugBlur = (e) => {
        const inputValue = e.target.value.trim();
        if (inputValue) {
            // Если slug пустой или пользователь ввел название, преобразуем его
            const formattedSlug = convertToSlug(inputValue);
            setSlug(formattedSlug);
        }
    };
    const [price, setPrice] = useState('');
    const [stock, setStock] = useState('');
    const [category, setCategory] = useState('');
    const [brand, setBrand] = useState('');
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        fetch(`${apiUrl}/catalog/categories/`)
            .then(async response => {
                if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/catalog/categories/`);
                }
                return response.json();
            })
            .then(data => setCategories(data.results || data))
            .catch(error => console.error('Error fetching categories:', error));
            
        fetch(`${apiUrl}/catalog/brands/`)
            .then(async response => {
                if (!response.ok) throw new Error(`Ошибка ${response.status}: ${response.statusText}`);
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/catalog/brands/`);
                }
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
        
        // Преобразуем slug в правильный формат перед отправкой
        const formattedSlug = convertToSlug(slug || name);
        
        if (!formattedSlug) {
            setError('Пожалуйста, заполните поле Slug (можно ввести название продукта)');
            return;
        }
        
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        fetch(`${apiUrl}/catalog/products/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                name,
                slug: formattedSlug,
                description,
                price: parseFloat(price),
                stock: parseInt(stock),
                category,
                brand,
            }),
        })
            .then(async response => {
                if (!response.ok) throw new Error('Ошибка создания продукта');
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/catalog/products/`);
                }
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
                    <Form.Label>Название *</Form.Label>
                    <Form.Control
                        type="text"
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Например: Краска для автомобиля"
                        required
                    />
                </Form.Group>
                <Form.Group className="mb-3">
                    <Form.Label>Slug (URL) *</Form.Label>
                    <Form.Control
                        type="text"
                        value={slug}
                        onChange={handleSlugChange}
                        onBlur={handleSlugBlur}
                        placeholder="Введите название продукта (например: Краска для автомобиля)"
                        required
                    />
                    <Form.Text className="text-muted">
                        Можно ввести название продукта на русском или английском языке.
                        <br />
                        При сохранении оно автоматически преобразуется в URL-формат.
                        <br />
                        <strong>Пример:</strong> "Краска для автомобиля" → "kraska-dlya-avtomobilya"
                    </Form.Text>
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