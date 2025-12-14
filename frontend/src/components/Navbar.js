// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Badge, Container, Row, Col, Form, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaHeart, FaShoppingCart, FaSearch, FaBars, FaUser } from 'react-icons/fa';

function CustomNavbar() {
    const [cartCount, setCartCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();



    useEffect(() => {
        // Загружаем данные пользователя из localStorage
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        
        if (token && userData) {
            try {
                setUser(JSON.parse(userData));
                setIsAuthenticated(true);
            } catch (e) {
                console.error('Error parsing user data:', e);
            }
        }
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const token = localStorage.getItem('token');
            fetch(`${apiUrl}/cart/`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(async response => {
                    if (!response.headers.get('content-type')?.includes('application/json')) {
                        const text = await response.text();
                        console.error('Ожидался JSON, получен HTML:', text.substring(0, 100));
                        return null;
                    }
                    return response.json();
                })
                .then(data => {
                    if (data) {
                        const cart = data[0];
                        const count = cart ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
                        setCartCount(count);
                    }
                })
                .catch(error => console.error('Error fetching cart:', error));
        }
    }, [isAuthenticated]);




    const handleLogout = async () => {
        const token = localStorage.getItem('token');
        
        if (token) {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
                await fetch(`${apiUrl}/accounts/logout/`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Token ${token}`
                    }
                });
            } catch (error) {
                console.error('Error during logout:', error);
            }
        }
        
        // Очищаем localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsAuthenticated(false);
        setUser(null);
        setCartCount(0);
        
        window.location.href = '/';
    };

    return (
        <>
            {/* Верхняя панель с контактами */}
            <div className="top-info-bar">
                <Container fluid>
                    <Row className="align-items-center">
                        <Col md={6} className="d-flex align-items-center">
                            <span className="phone-number">+375 (33) 355-02-03</span>
                            <span className="working-hours ms-3">
                                пн-пт: 09:00 - 18:00, сб: 09:00 - 13:00, вс: выходной
                            </span>
                        </Col>
                        <Col md={6} className="text-end">
                            <div className="top-nav-links">
                                <a href="#pickup" className="nav-link">Пункты самовывоза</a>
                                <a href="#delivery" className="nav-link">Доставка и оплата</a>
                                <a href="#paint-selection" className="nav-link">Компьютерный подбор краски</a>
                                <a href="#discount" className="nav-link">Дисконтная программа</a>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Основная навигационная панель */}
            <Navbar expand="lg" className="main-navbar">
                <Container fluid>
            <Link to="/" className="navbar-brand navbar-logo">
                <img 
                    src="/images/logo(3).jpg" 
                    alt="Логотип сайта" 
                    className="navbar-logo-image"
                />
            </Link>
                    
                    <Navbar.Toggle aria-controls="basic-navbar-nav" className="navbar-toggle">
                        <FaBars />
                    </Navbar.Toggle>
                    
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavDropdown title="Каталог" id="catalog-dropdown" className="nav-dropdown-custom">
                                <NavDropdown.Item href="/catalog">Все товары</NavDropdown.Item>
                                <NavDropdown.Divider />
                                
                                {/* Краски с подменю фильтров */}
                                <div className="dropdown-submenu">
                                    <NavDropdown.Item href="/catalog?category=paints">Краски</NavDropdown.Item>
                                    <div className="dropdown-menu">
                                        <div className="filter-submenu">
                                            
                                            <div className="form-group">
                                                <label>Бренд</label>
                                                <select className="form-select">
                                                    <option>Все бренды</option>
                                                    <option>NOVOL</option>
                                                    <option>BODY</option>
                                                    <option>SPECTRAL</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Цена от</label>
                                                <input type="number" className="form-control" placeholder="Мин" />
                                            </div>
                                            <div className="form-group">
                                                <label>Цена до</label>
                                                <input type="number" className="form-control" placeholder="Макс" />
                                            </div>
                                            <button className="btn btn-primary btn-sm w-100">Применить</button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Грунты с подменю фильтров */}
                                <div className="dropdown-submenu">
                                    <NavDropdown.Item href="/catalog?category=primers">Грунты</NavDropdown.Item>
                                    <div className="dropdown-menu">
                                        <div className="filter-submenu">
                                            
                                            <div className="form-group">
                                                <label>Бренд</label>
                                                <select className="form-select">
                                                    <option>Все бренды</option>
                                                    <option>NOVOL</option>
                                                    <option>BODY</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Цена от</label>
                                                <input type="number" className="form-control" placeholder="Мин" />
                                            </div>
                                            <div className="form-group">
                                                <label>Цена до</label>
                                                <input type="number" className="form-control" placeholder="Макс" />
                                            </div>
                                            <button className="btn btn-primary btn-sm w-100">Применить</button>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Шпатлевки с подменю фильтров */}
                                <div className="dropdown-submenu">
                                    <NavDropdown.Item href="/catalog?category=putties">Шпатлевки</NavDropdown.Item>
                                    <div className="dropdown-menu">
                                        <div className="filter-submenu">
                                            
                                            <div className="form-group">
                                                <label>Бренд</label>
                                                <select className="form-select">
                                                    <option>Все бренды</option>
                                                    <option>NOVOL</option>
                                                    <option>BODY</option>
                                                    <option>SPECTRAL</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Цена от</label>
                                                <input type="number" className="form-control" placeholder="Мин" />
                                            </div>
                                            <div className="form-group">
                                                <label>Цена до</label>
                                                <input type="number" className="form-control" placeholder="Макс" />
                                            </div>
                                            <button className="btn btn-primary btn-sm w-100">Применить</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Инструменты с подменю фильтров */}
                                <div className="dropdown-submenu">
                                    <NavDropdown.Item href="/catalog?category=tools">Инструменты</NavDropdown.Item>
                                    <div className="dropdown-menu">
                                        <div className="filter-submenu">
                                            
                                            <div className="form-group">
                                                <label>Бренд</label>
                                                <select className="form-select">
                                                    <option>Все бренды</option>
                                                    <option>SATA</option>
                                                    <option>DeVilbiss</option>
                                                    <option>3M</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Цена от</label>
                                                <input type="number" className="form-control" placeholder="Мин" />
                                            </div>
                                            <div className="form-group">
                                                <label>Цена до</label>
                                                <input type="number" className="form-control" placeholder="Макс" />
                                            </div>
                                            <button className="btn btn-primary btn-sm w-100">Применить</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Абразивы с подменю фильтров */}
                                <div className="dropdown-submenu">
                                    <NavDropdown.Item href="/catalog?category=abrasives">Абразивы</NavDropdown.Item>
                                    <div className="dropdown-menu">
                                        <div className="filter-submenu">
                                            
                                            <div className="form-group">
                                                <label>Бренд</label>
                                                <select className="form-select">
                                                    <option>Все бренды</option>
                                                    <option>3M</option>
                                                    <option>Mirka</option>
                                                    <option>NORTON</option>
                                                </select>
                                            </div>
                                            <div className="form-group">
                                                <label>Цена от</label>
                                                <input type="number" className="form-control" placeholder="Мин" />
                                            </div>
                                            <div className="form-group">
                                                <label>Цена до</label>
                                                <input type="number" className="form-control" placeholder="Макс" />
                                            </div>
                                            <button className="btn btn-primary btn-sm w-100">Применить</button>
                                        </div>
                                    </div>
                                </div>
                            </NavDropdown>

                        </Nav>
                        
                        {/* Поиск */}
                        <Form className="search-form me-3">
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск по товарам"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                <InputGroup.Text className="search-icon-wrapper">
                                    <FaSearch />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>

                        <Nav className="nav-icons">
                            <Link to="#favorites" className="nav-link nav-icon-link">
                                <FaHeart /> Избранное
                            </Link>
                            {isAuthenticated && user ? (
                                <>
                                    <Link to="/profile" className="nav-link nav-icon-link">
                                        <FaUser /> {user.username}
                                    </Link>
                                    <a 
                                        href="#" 
                                        onClick={(e) => { e.preventDefault(); handleLogout(); }} 
                                        className="nav-link nav-icon-link"
                                    >
                                        Выйти
                                    </a>
                                </>
                            ) : (
                                <>
                                    <Link to="/login" className="nav-link nav-icon-link">
                                        <FaUser /> Войти
                                    </Link>
                                    <Link to="/register" className="nav-link nav-icon-link">
                                        Регистрация
                                    </Link>
                                </>
                            )}
                            <Link to="/cart" className="nav-link nav-icon-link cart-link">
                                <FaShoppingCart /> Корзина
                                {cartCount > 0 && <Badge bg="danger" className="cart-badge">{cartCount}</Badge>}
                            </Link>
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
                        

        </>
    );
}


export default CustomNavbar;

