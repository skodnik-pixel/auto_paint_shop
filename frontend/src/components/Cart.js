
// frontend/src/components/Cart.js
import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Spinner, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [itemToRemove, setItemToRemove] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        // ВАЖНО: Правильный URL - /api/cart/ (без двойного cart)
        fetch(`${apiUrl}/cart/`, {
            headers: {
                'Authorization': `Token ${token}`,
            },
        })
            .then(async response => {
                if (!response.ok) throw new Error('Failed to fetch cart');
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/cart/`);
                }
                return response.json();
            })
            .then(data => {
                // API возвращает объект с пагинацией: {results: [...]}
                // Или массив: [...]
                let cartData = null;
                
                if (data.results && Array.isArray(data.results)) {
                    cartData = data.results[0]; // Пагинированный ответ
                } else if (Array.isArray(data)) {
                    cartData = data[0]; // Массив корзин
                } else {
                    cartData = data; // Один объект корзины
                }
                
                setCart(cartData || null);
                setLoading(false);
            })
            .catch(error => {
                console.error('✗ Ошибка загрузки корзины:', error);
                setLoading(false);
            });
    }, []);

    const updateQuantity = (itemId, quantity) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        // ВАЖНО: Правильный URL - /api/cart/{id}/ (без двойного cart)
        fetch(`${apiUrl}/cart/${cart.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ items: [{ id: itemId, quantity }] }),
        })
            .then(async response => {
                if (!response.ok) throw new Error('Failed to update quantity');
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/cart/`);
                }
                return response.json();
            })
            .then(data => setCart(data))
            .catch(error => console.error('Error updating quantity:', error));
    };

    const removeItem = (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) return;
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        // ВАЖНО: Правильный URL - /api/cart/{id}/ (без двойного cart)
        fetch(`${apiUrl}/cart/${cart.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Token ${token}`,
            },
            body: JSON.stringify({ items: [{ id: itemId, quantity: 0 }] }), // Удаляем, устанавливая quantity=0
        })
            .then(async response => {
                if (!response.ok) throw new Error('Failed to remove item');
                if (!response.headers.get('content-type')?.includes('application/json')) {
                    const text = await response.text();
                    throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/cart/`);
                }
                return response.json();
            })
            .then(data => setCart(data))
            .catch(error => console.error('Error removing item:', error));
    };

    const confirmRemove = (itemId) => {
        setItemToRemove(itemId);
        setShowModal(true);
    };

    const handleRemove = () => {
        removeItem(itemToRemove);
        setShowModal(false);
        setItemToRemove(null);
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" />
            </Container>
        );
    }

    if (!localStorage.getItem('token')) {
        return (
            <Container className="my-5">
                <h2 className="mb-4">Корзина</h2>
                <p>Пожалуйста, войдите в аккаунт, чтобы просмотреть корзину.</p>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h2 className="mb-4">Корзина</h2>
            {!cart || !cart.items || cart.items.length === 0 ? (
                <p>Корзина пуста</p>
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Товар</th>
                            <th>Цена</th>
                            <th>Количество</th>
                            <th>Итого</th>
                            <th>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {cart.items.map(item => (
                            <tr key={item.id}>
                                <td>{item.product.name}</td>
                                <td>{item.product.price} BYN</td>
                                <td>
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                        disabled={item.quantity <= 1}
                                    >
                                        -
                                    </Button>{' '}
                                    {item.quantity}{' '}
                                    <Button
                                        variant="outline-secondary"
                                        size="sm"
                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                    >
                                        +
                                    </Button>
                                </td>
                                <td>{(item.product.price * item.quantity).toFixed(2)} BYN</td>
                                <td>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        onClick={() => confirmRemove(item.id)}
                                    >
                                        <FaTrash /> Удалить
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Подтверждение</Modal.Title>
                </Modal.Header>
                <Modal.Body>Удалить товар из корзины?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Отмена
                    </Button>
                    <Button variant="danger" onClick={handleRemove}>
                        Удалить
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default Cart;