
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
        fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to fetch cart');
                return response.json();
            })
            .then(data => {
                setCart(data[0] || null); // Первый элемент корзины
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching cart:', error);
                setLoading(false);
            });
    }, []);

    const updateQuantity = (itemId, quantity) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/cart/${cart.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ items: [{ id: itemId, quantity }] }),
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to update quantity');
                return response.json();
            })
            .then(data => setCart(data))
            .catch(error => console.error('Error updating quantity:', error));
    };

    const removeItem = (itemId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Пожалуйста, войдите в аккаунт');
            return;
        }
        fetch(`${process.env.REACT_APP_API_URL}/cart/${cart.id}/`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ items: [{ id: itemId, quantity: 0 }] }), // Удаляем, устанавливая quantity=0
        })
            .then(response => {
                if (!response.ok) throw new Error('Failed to remove item');
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