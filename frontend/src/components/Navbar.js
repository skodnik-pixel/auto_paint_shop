
// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Badge } from 'react-bootstrap';

function CustomNavbar() {
    const [cartCount, setCartCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    useEffect(() => {
        if (isAuthenticated) {
            const token = localStorage.getItem('token');
            fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => response.json())
                .then(data => {
                    const cart = data[0];
                    const count = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                    setCartCount(count);
                })
                .catch(error => console.error('Error fetching cart:', error));
        }
    }, [isAuthenticated]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setCartCount(0);
    };

    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
            <Navbar.Brand href="/">Auto Paint Shop</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto">
                    <Nav.Link href="/">Главная</Nav.Link>
                    <Nav.Link href="/catalog">Каталог</Nav.Link>
                    <Nav.Link href="/cart">
                        Корзина {cartCount > 0 && <Badge bg="success">{cartCount}</Badge>}
                    </Nav.Link>
                </Nav>
                <Nav>
                    {isAuthenticated ? (
                        <Nav.Link onClick={handleLogout}>Выйти</Nav.Link>
                    ) : (
                        <>
                            <Nav.Link href="/login">Войти</Nav.Link>
                            <Nav.Link href="/register">Регистрация</Nav.Link>
                        </>
                    )}
                </Nav>
            </Navbar.Collapse>
        </Navbar>
    );
}

export default CustomNavbar;

