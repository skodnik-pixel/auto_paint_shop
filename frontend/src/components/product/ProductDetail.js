// frontend/src/components/ProductDetail.js
import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge } from 'react-bootstrap';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
    FaShoppingCart, 
    FaHeart, 
    FaShare, 
    FaTruck, 
    FaShieldAlt, 
    FaUndo,
    FaCheck,
    FaMinus,
    FaPlus
} from 'react-icons/fa';

function ProductDetail() {
    const { slug } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1); // Количество товара
    const [addingToCart, setAddingToCart] = useState(false); // Состояние добавления в корзину
    const [isFavorite, setIsFavorite] = useState(false); // Избранное
    const [relatedProducts, setRelatedProducts] = useState([]); // Похожие товары
    const [activeTab, setActiveTab] = useState('description'); // Активная вкладка в описании

    // Загрузка данных товара
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
                
                // Загружаем товар по slug
                const response = await fetch(`${apiUrl}/catalog/products/`);
                if (!response.ok) {
                    throw new Error(`Ошибка ${response.status}`);
                }
                const data = await response.json();
                
                // Ищем товар с нужным slug
                const allProducts = data.results || data;
                const productData = allProducts.find(p => p.slug === slug);
                
                setProduct(productData);
                
                // Загружаем похожие товары (из той же категории)
                if (productData && productData.category) {
                    const relatedResponse = await fetch(
                        `${apiUrl}/catalog/products/?category=${productData.category.slug}&page_size=4`
                    );
                    if (relatedResponse.ok) {
                        const relatedData = await relatedResponse.json();
                        const related = (relatedData.results || relatedData)
                            .filter(p => p.slug !== slug) // Исключаем текущий товар
                            .slice(0, 4); // Берём только 4 товара
                        setRelatedProducts(related);
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [slug]);

    // Увеличить количество
    const increaseQuantity = () => {
        if (quantity < product.stock) {
            setQuantity(quantity + 1);
        }
    };

    // Уменьшить количество
    const decreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Добавить/убрать из избранного
    const toggleFavorite = () => {
        setIsFavorite(!isFavorite);
        // Здесь можно добавить сохранение в localStorage или на сервер
    };

    // Функция для добавления товара в корзину
    const addToCart = async () => {
        const token = localStorage.getItem('token');
        
        console.log('=== ДОБАВЛЕНИЕ В КОРЗИНУ ===');
        console.log('Token:', token ? 'Есть' : 'Нет');
        console.log('Product:', product?.name);
        console.log('Slug:', product?.slug);
        console.log('Quantity:', quantity);
        
        if (!token) {
            console.log('Нет токена - перенаправление на логин');
            navigate('/login');
            return;
        }
        
        setAddingToCart(true);
        
        try {
            const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
            const url = `${apiUrl}/cart/add_item/`;
            const body = { 
                product_slug: product.slug, 
                quantity: quantity 
            };
            
            console.log('URL:', url);
            console.log('Body:', body);
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`
                },
                body: JSON.stringify(body)
            });

            console.log('Response status:', response.status);
            
            if (response.ok) {
                const data = await response.json();
                console.log('✓ Успешно добавлено:', data);
                console.log(`✓ ${quantity} шт. добавлено в корзину`);
                setQuantity(1);
                // Синхронизируем с localStorage, чтобы счётчик в шапке обновился
                if (product) {
                    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
                    const existing = cart.find(item => item.id === product.id);
                    if (existing) existing.quantity += quantity;
                    else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug, quantity });
                    localStorage.setItem('cart', JSON.stringify(cart));
                }
                window.dispatchEvent(new Event('cartUpdated'));
            } else {
                const errorText = await response.text();
                console.error('✗ Ошибка:', response.status, errorText);
            }
        } catch (error) {
            console.error('✗ Ошибка сети:', error);
        } finally {
            setAddingToCart(false);
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
        <div className="product-detail-page">
            <Container className="my-5">
                {/* Хлебные крошки */}
                <nav className="breadcrumb-nav mb-4">
                    <Link to="/">Главная</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to="/catalog">Каталог</Link>
                    <span className="breadcrumb-separator">/</span>
                    <Link to={`/catalog?category=${product.category.slug}`}>
                        {product.category.name}
                    </Link>
                    <span className="breadcrumb-separator">/</span>
                    <span className="breadcrumb-current">{product.name}</span>
                </nav>

                <Row className="align-items-stretch">
                    {/* Левая колонка - Изображение + описание */}
                    <Col lg={6} className="mb-4 d-flex flex-column">
                        {/* Изображение товара */}
                        <div className="product-image-section mb-4">
                            <div className="product-main-image">
                                <img
                                    src={product.image || 'https://via.placeholder.com/600x600?text=Нет+фото'}
                                    alt={product.name}
                                    className="img-fluid"
                                />
                                {product.stock === 0 && (
                                    <div className="out-of-stock-badge">Нет в наличии</div>
                                )}
                            </div>
                        </div>
                        
                        {/* НОВЫЙ БЛОК - Описание товара под картинкой с кнопками */}
                        <div className="product-description-block flex-grow-1">
                            <Card>
                                {/* Заменяем табы на кнопки */}
                                <Card.Header className="p-3">
                                    <div className="description-buttons">
                                        <Button 
                                            variant={activeTab === 'description' ? 'primary' : 'outline-primary'}
                                            className="description-btn"
                                            onClick={() => setActiveTab('description')}
                                        >
                                            Описание
                                        </Button>
                                        <Button 
                                            variant={activeTab === 'specifications' ? 'primary' : 'outline-primary'}
                                            className="description-btn"
                                            onClick={() => setActiveTab('specifications')}
                                        >
                                            Характеристики
                                        </Button>
                                        <Button 
                                            variant={activeTab === 'delivery' ? 'primary' : 'outline-primary'}
                                            className="description-btn"
                                            onClick={() => setActiveTab('delivery')}
                                        >
                                            Доставка
                                        </Button>
                                    </div>
                                </Card.Header>
                                <Card.Body>
                                    {/* Контент в зависимости от активной кнопки */}
                                    {activeTab === 'description' && (
                                        <div>
                                            <p>{product.description}</p>
                                            <p>
                                                Этот товар от бренда <strong>{product.brand.name}</strong> относится к категории <strong>{product.category.name}</strong> и отличается высоким качеством и надёжностью.
                                            </p>
                                            
                                            <h6>Основные характеристики:</h6>
                                            <ul>
                                                <li><strong>Бренд:</strong> {product.brand.name}</li>
                                                <li><strong>Категория:</strong> {product.category.name}</li>
                                                <li><strong>Артикул:</strong> {product.slug}</li>
                                            </ul>
                                        </div>
                                    )}
                                    
                                    {activeTab === 'specifications' && (
                                        <div>
                                            <h6>Технические характеристики:</h6>
                                            <table className="table table-sm">
                                                <tbody>
                                                    <tr>
                                                        <td>Бренд</td>
                                                        <td><strong>{product.brand.name}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Категория</td>
                                                        <td><strong>{product.category.name}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Артикул</td>
                                                        <td><strong>{product.slug}</strong></td>
                                                    </tr>
                                                    <tr>
                                                        <td>Наличие</td>
                                                        <td>
                                                            <strong className={product.stock > 0 ? 'text-success' : 'text-danger'}>
                                                                {product.stock > 0 ? `В наличии (${product.stock} шт.)` : 'Нет в наличии'}
                                                            </strong>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                    )}
                                    
                                    {activeTab === 'delivery' && (
                                        <div>
                                            <h6>Способы доставки:</h6>
                                            <ul className="mb-3">
                                                <li><strong>Курьерская доставка по Минску</strong> - 1-2 дня, стоимость 5 BYN</li>
                                                <li><strong>Доставка по Беларуси</strong> - 2-5 дней, стоимость от 10 BYN</li>
                                                <li><strong>Самовывоз</strong> - бесплатно, в день заказа</li>
                                            </ul>
                                            <h6>Способы оплаты:</h6>
                                            <ul>
                                                <li>Наличными при получении</li>
                                                <li>Банковской картой онлайн</li>
                                                <li>Банковский перевод</li>
                                            </ul>
                                        </div>
                                    )}
                                </Card.Body>
                            </Card>
                        </div>
                    </Col>

                    {/* Правая колонка - Информация (как было изначально) */}
                    <Col lg={6} className="d-flex flex-column">
                        <div className="product-info-section flex-grow-1 d-flex flex-column">
                            {/* Заголовок и бренд */}
                            <div className="product-header mb-3">
                                <Badge bg="primary" className="mb-2">{product.brand.name}</Badge>
                                <h1 className="product-title">{product.name}</h1>
                            </div>

                            {/* Цена и наличие */}
                            <div className="product-price-block mb-4">
                                <div className="price-wrapper">
                                    <span className="current-price">{product.price} BYN</span>
                                </div>
                                <div className="stock-info">
                                    {product.stock > 0 ? (
                                        <Badge bg="success" className="stock-badge">
                                            <FaCheck /> В наличии: {product.stock} шт.
                                        </Badge>
                                    ) : (
                                        <Badge bg="danger" className="stock-badge">
                                            Нет в наличии
                                        </Badge>
                                    )}
                                </div>
                            </div>

                            {/* Описание только в левой колонке (вкладка «Описание»), здесь не дублируем */}

                            {/* Количество и кнопки */}
                            <div className="product-actions mb-4">
                                {/* Выбор количества */}
                                <div className="quantity-selector mb-3">
                                    <label className="quantity-label">Количество:</label>
                                    <div className="quantity-controls">
                                        <button 
                                            className="quantity-btn" 
                                            onClick={decreaseQuantity}
                                            disabled={quantity <= 1}
                                        >
                                            <FaMinus />
                                        </button>
                                        <input 
                                            type="number" 
                                            className="quantity-input" 
                                            value={quantity}
                                            readOnly
                                        />
                                        <button 
                                            className="quantity-btn" 
                                            onClick={increaseQuantity}
                                            disabled={quantity >= product.stock}
                                        >
                                            <FaPlus />
                                        </button>
                                    </div>
                                </div>

                                {/* Кнопки действий */}
                                <div className="action-buttons">
                                    <Button 
                                        variant="primary" 
                                        size="lg" 
                                        className="add-to-cart-btn"
                                        onClick={addToCart}
                                        disabled={product.stock === 0 || addingToCart}
                                    >
                                        <FaShoppingCart className="me-2" />
                                        {addingToCart ? 'Добавление...' : 'Добавить в корзину'}
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        size="lg"
                                        className="favorite-btn"
                                        onClick={toggleFavorite}
                                    >
                                        <FaHeart className={isFavorite ? 'text-danger' : ''} />
                                    </Button>
                                    
                                    <Button 
                                        variant="outline-secondary" 
                                        size="lg"
                                        className="share-btn"
                                    >
                                        <FaShare />
                                    </Button>
                                </div>
                            </div>

                            {/* Преимущества */}
                            <div className="product-features">
                                <div className="feature-item">
                                    <FaTruck className="feature-icon" />
                                    <div className="feature-text">
                                        <strong>Быстрая доставка</strong>
                                        <span>Доставка по Минску за 1-2 дня</span>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <FaShieldAlt className="feature-icon" />
                                    <div className="feature-text">
                                        <strong>Гарантия качества</strong>
                                        <span>Только оригинальная продукция</span>
                                    </div>
                                </div>
                                <div className="feature-item">
                                    <FaUndo className="feature-icon" />
                                    <div className="feature-text">
                                        <strong>Возврат товара</strong>
                                        <span>В течение 14 дней</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>



                {/* Похожие товары */}
                {relatedProducts.length > 0 && (
                    <Row className="mt-5">
                        <Col>
                            <h3 className="section-title mb-4">Похожие товары</h3>
                            <Row>
                                {relatedProducts.map(relatedProduct => (
                                    <Col key={relatedProduct.id} lg={3} md={6} className="mb-4">
                                        <Card className="product-card h-100">
                                            <Link to={`/product/${relatedProduct.slug}`}>
                                                <div className="text-center p-3">
                                                    <img
                                                        src={relatedProduct.image || 'https://via.placeholder.com/200'}
                                                        alt={relatedProduct.name}
                                                        className="img-fluid"
                                                        style={{ maxHeight: '150px', objectFit: 'contain' }}
                                                    />
                                                </div>
                                            </Link>
                                            <Card.Body>
                                                <Badge bg="primary" className="mb-2">{relatedProduct.brand.name}</Badge>
                                                <Card.Title className="h6">
                                                    <Link to={`/product/${relatedProduct.slug}`} className="text-decoration-none text-dark">
                                                        {relatedProduct.name}
                                                    </Link>
                                                </Card.Title>
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <span className="h5 text-primary mb-0">{relatedProduct.price} BYN</span>
                                                    <Badge bg={relatedProduct.stock > 0 ? 'success' : 'danger'}>
                                                        {relatedProduct.stock > 0 ? 'В наличии' : 'Нет'}
                                                    </Badge>
                                                </div>
                                            </Card.Body>
                                        </Card>
                                    </Col>
                                ))}
                            </Row>
                        </Col>
                    </Row>
                )}
            </Container>
        </div>
    );
}

export default ProductDetail;