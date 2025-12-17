// frontend/src/components/Navbar.js
import React, { useEffect, useState } from 'react';
import { Navbar, Nav, Badge, Container, Row, Col, Form, InputGroup, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
// FaStar - иконка звездочки для избранного
// FaShoppingCart - иконка корзины
// FaSearch - иконка поиска (лупа)
// FaBars - иконка меню (три полоски)
// FaUser - иконка пользователя
// Добавляем иконки соцсетей для хедера
import { 
    FaStar, 
    FaShoppingCart, 
    FaSearch, 
    FaBars, 
    FaUser,
    FaFacebookF,
    FaInstagram,
    FaTelegramPlane,
    FaViber
} from 'react-icons/fa';

function CustomNavbar() {
    const [cartCount, setCartCount] = useState(0);
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // Состояние для количества товаров в избранном
    const [favoritesCount, setFavoritesCount] = useState(0);
    
    // Состояние для фильтров в подменю
    const [submenuFilters, setSubmenuFilters] = useState({
        category: '',    // Текущая категория (kraski, grunty, etc.)
        brand: '',       // Выбранный бренд
        priceMin: '',    // Минимальная цена
        priceMax: ''     // Максимальная цена
    });

    // Динамическая загрузка категорий и брендов из API
    const [categories, setCategories] = useState([]); // Все категории из API
    const [brands, setBrands] = useState([]); // Все бренды из API
    const [categoryBrands, setCategoryBrands] = useState({}); // Бренды для каждой категории

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

    // Загружаем количество товаров в избранном из localStorage
    useEffect(() => {
        // Получаем список избранных товаров из localStorage
        const savedFavorites = localStorage.getItem('favorites');
        if (savedFavorites) {
            try {
                // Парсим JSON и считаем количество товаров
                const favoritesArray = JSON.parse(savedFavorites);
                setFavoritesCount(favoritesArray.length);
            } catch (error) {
                // Если ошибка парсинга - сбрасываем счетчик
                console.error('Error parsing favorites:', error);
                setFavoritesCount(0);
            }
        }
    }, []);

    // Слушаем события обновления избранного из других компонентов
    useEffect(() => {
        // Функция обработки события обновления избранного
        const handleFavoritesUpdate = (event) => {
            // event.detail.count - количество товаров в избранном, переданное из Home.js
            setFavoritesCount(event.detail.count);
        };

        // Добавляем слушатель события 'favoritesUpdated'
        window.addEventListener('favoritesUpdated', handleFavoritesUpdate);

        // Очищаем слушатель при размонтировании компонента (cleanup function)
        return () => {
            window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
        };
    }, []);

    // Загрузка категорий и брендов из API
    useEffect(() => {
        const fetchCategoriesAndBrands = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
                
                console.log('=== ЗАГРУЗКА КАТЕГОРИЙ И БРЕНДОВ ===');
                
                // Загружаем категории
                const categoriesRes = await fetch(`${apiUrl}/catalog/categories/?page_size=100`);
                const categoriesData = await categoriesRes.json();
                const categoriesList = categoriesData.results || categoriesData;
                setCategories(categoriesList);
                console.log('Категорий загружено:', categoriesList.length);
                
                // Загружаем бренды
                const brandsRes = await fetch(`${apiUrl}/catalog/brands/?page_size=100`);
                const brandsData = await brandsRes.json();
                const brandsList = brandsData.results || brandsData;
                setBrands(brandsList);
                console.log('Брендов загружено:', brandsList.length);
                
                // Загружаем товары чтобы узнать какие бренды есть в каждой категории
                const productsRes = await fetch(`${apiUrl}/catalog/products/?page_size=100`);
                const productsData = await productsRes.json();
                const products = productsData.results || productsData;
                
                // Группируем бренды по категориям
                const brandsByCategory = {};
                products.forEach(product => {
                    const catSlug = product.category?.slug;
                    const brandSlug = product.brand?.slug;
                    const brandName = product.brand?.name;
                    
                    if (catSlug && brandSlug && brandName) {
                        if (!brandsByCategory[catSlug]) {
                            brandsByCategory[catSlug] = [];
                        }
                        // Добавляем бренд если его еще нет в списке для этой категории
                        if (!brandsByCategory[catSlug].find(b => b.slug === brandSlug)) {
                            brandsByCategory[catSlug].push({
                                slug: brandSlug,
                                name: brandName
                            });
                        }
                    }
                });
                
                setCategoryBrands(brandsByCategory);
                console.log('Бренды по категориям:', brandsByCategory);
                
            } catch (error) {
                console.error('Ошибка загрузки категорий и брендов:', error);
            }
        };
        
        fetchCategoriesAndBrands();
    }, []);

    // Функция обработки поиска
    const handleSearch = (e) => {
        // Предотвращаем перезагрузку страницы при отправке формы
        e.preventDefault();
        
        // Проверяем что поисковый запрос не пустой
        if (searchQuery.trim()) {
            // Перенаправляем на страницу каталога с параметром поиска
            // navigate - функция React Router для навигации
            navigate(`/catalog?search=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    // Функция обработки изменений в подменю
    const handleSubmenuChange = (filterType, value) => {
        setSubmenuFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Функция применения фильтров подменю
    const applySubmenuFilters = (category) => {
        // Формируем URL с параметрами
        const params = new URLSearchParams();
        params.set('category', category);
        
        if (submenuFilters.brand) {
            params.set('brand', submenuFilters.brand);
        }
        if (submenuFilters.priceMin) {
            params.set('price_min', submenuFilters.priceMin);
        }
        if (submenuFilters.priceMax) {
            params.set('price_max', submenuFilters.priceMax);
        }
        
        // Переходим на каталог с фильтрами
        navigate(`/catalog?${params.toString()}`);
        
        // Сбрасываем фильтры после применения
        setSubmenuFilters({
            category: '',
            brand: '',
            priceMin: '',
            priceMax: ''
        });
    };

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
                            {/* Основной телефон магазина кузовного ремонта */}
                            <span className="phone-number">+375 (29) 123-45-67</span>
                            {/* Расширенные часы работы для профессионального магазина */}
                            <span className="working-hours ms-3">
                                пн-пт: 08:00 - 19:00, сб: 09:00 - 15:00, вс: выходной
                            </span>
                        </Col>
                        <Col md={6} className="text-end">
                            {/* Обновленные ссылки для магазина кузовного ремонта */}
                            <div className="top-nav-links d-flex align-items-center justify-content-end">
                                {/* ССЫЛКИ В РЯД КАК БЫЛО - с отступами между ними */}
                                <Link to="/pickup" className="nav-link me-3">Пункты самовывоза</Link>
                                <Link to="/delivery" className="nav-link me-3">Доставка и оплата</Link>
                                <Link to="/paint-selection" className="nav-link me-3">Подбор краски по коду</Link>
                                <Link to="/wholesale" className="nav-link me-3">Оптовым покупателям</Link>
                                
                                {/* СОЦСЕТИ СПРАВА */}
                                <div className="header-social ms-3">
                                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link-header me-2">
                                        <FaFacebookF />
                                    </a>
                                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link-header me-2">
                                        <FaInstagram />
                                    </a>
                                    <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link-header me-2">
                                        <FaTelegramPlane />
                                    </a>
                                    <a href="viber://chat" className="social-link-header">
                                        <FaViber />
                                    </a>
                                </div>
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
                                
                                {/* Динамические категории с подменю */}
                                {categories.map(category => (
                                    <div key={category.id} className="dropdown-submenu">
                                        <NavDropdown.Item href={`/catalog?category=${category.slug}`}>
                                            {category.name}
                                        </NavDropdown.Item>
                                        <div className="dropdown-menu">
                                            <div className="filter-submenu">
                                                {/* Динамические бренды для каждой категории */}
                                                <div className="form-group">
                                                    <label>Бренд</label>
                                                    <select 
                                                        className="form-select"
                                                        value={submenuFilters.brand}
                                                        onChange={(e) => handleSubmenuChange('brand', e.target.value)}
                                                    >
                                                        <option value="">Все бренды</option>
                                                        {categoryBrands[category.slug]?.map(brand => (
                                                            <option key={brand.slug} value={brand.slug}>
                                                                {brand.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                                <div className="form-group">
                                                    <label>Цена от</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        placeholder="Мин"
                                                        value={submenuFilters.priceMin}
                                                        onChange={(e) => handleSubmenuChange('priceMin', e.target.value)}
                                                    />
                                                </div>
                                                <div className="form-group">
                                                    <label>Цена до</label>
                                                    <input 
                                                        type="number" 
                                                        className="form-control" 
                                                        placeholder="Макс"
                                                        value={submenuFilters.priceMax}
                                                        onChange={(e) => handleSubmenuChange('priceMax', e.target.value)}
                                                    />
                                                </div>
                                                <button 
                                                    className="btn btn-primary btn-sm w-100"
                                                    onClick={() => applySubmenuFilters(category.slug)}
                                                >
                                                    Применить
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </NavDropdown>

                        </Nav>
                        
                        {/* Поиск */}
                        {/* Добавляем onSubmit для обработки Enter */}
                        <Form className="search-form me-3" onSubmit={handleSearch}>
                            <InputGroup>
                                <Form.Control
                                    type="text"
                                    placeholder="Поиск по товарам"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="search-input"
                                />
                                {/* Делаем лупу кликабельной */}
                                <InputGroup.Text 
                                    className="search-icon-wrapper" 
                                    onClick={handleSearch}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <FaSearch />
                                </InputGroup.Text>
                            </InputGroup>
                        </Form>

                        <Nav className="nav-icons">
                            {/* Кнопка избранного с звездочкой и счетчиком */}
                            <Link to="/favorites" className="nav-link nav-icon-link favorites-link">
                                {/* FaStar - иконка звездочки для избранного */}
                                <FaStar /> Избранное
                                {/* Показываем количество товаров в избранном, если есть */}
                                {favoritesCount > 0 && <Badge bg="warning" className="favorites-badge">{favoritesCount}</Badge>}
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

