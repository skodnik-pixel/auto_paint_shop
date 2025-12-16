
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, Button } from 'react-bootstrap';
// Добавляем useSearchParams для чтения URL параметров
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [addingToCart, setAddingToCart] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Новые фильтры
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(''); // price-asc, price-desc, name

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        const [categoriesRes, brandsRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/catalog/categories/?page_size=100`),
          fetch(`${apiUrl}/catalog/brands/?page_size=100`),
          fetch(`${apiUrl}/catalog/products/?page_size=100`)
        ]);

        // Проверяем, что ответы являются JSON
        if (!categoriesRes.headers.get('content-type')?.includes('application/json')) {
          const text = await categoriesRes.text();
          throw new Error(`Ожидался JSON, получен: ${text.substring(0, 100)}`);
        }
        if (!brandsRes.headers.get('content-type')?.includes('application/json')) {
          const text = await brandsRes.text();
          throw new Error(`Ожидался JSON, получен: ${text.substring(0, 100)}`);
        }
        if (!productsRes.headers.get('content-type')?.includes('application/json')) {
          const text = await productsRes.text();
          throw new Error(`Ожидался JSON, получен: ${text.substring(0, 100)}`);
        }

        const categoriesData = await categoriesRes.json();
        const brandsData = await brandsRes.json();
        const productsData = await productsRes.json();

        // Логирование для отладки
        console.log('=== ЗАГРУЗКА ДАННЫХ ===');
        console.log('Категорий загружено:', categoriesData.results?.length || categoriesData.length);
        console.log('Брендов загружено:', brandsData.results?.length || brandsData.length);
        console.log('Товаров загружено:', productsData.results?.length || productsData.length);
        console.log('Категории:', categoriesData.results || categoriesData);
        console.log('Бренды:', brandsData.results || brandsData);

        setCategories(categoriesData.results || categoriesData);
        setBrands(brandsData.results || brandsData);
        setProducts(productsData.results || productsData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // useEffect для обработки URL параметров поиска, категорий и фильтров подменю
  useEffect(() => {
      // Получаем параметр search из URL (?search=краска)
      const searchFromUrl = searchParams.get('search');
      if (searchFromUrl) {
          // Устанавливаем поисковый запрос из URL
          setSearchTerm(searchFromUrl);
      }
      
      // Получаем параметр category из URL (?category=kraski)
      const categoryFromUrl = searchParams.get('category');
      if (categoryFromUrl) {
          // Устанавливаем выбранную категорию из URL
          setSelectedCategory(categoryFromUrl);
      }
      
      // НОВЫЕ ПАРАМЕТРЫ ДЛЯ ПОДМЕНЮ ФИЛЬТРОВ
      // Получаем параметр brand из URL (?brand=novol)
      const brandFromUrl = searchParams.get('brand');
      if (brandFromUrl) {
          // Устанавливаем выбранный бренд из URL
          setSelectedBrand(brandFromUrl);
      }
      
      // Получаем параметры цены из URL (?price_min=10&price_max=100)
      const priceMinFromUrl = searchParams.get('price_min');
      const priceMaxFromUrl = searchParams.get('price_max');
      if (priceMinFromUrl || priceMaxFromUrl) {
          // Устанавливаем диапазон цен из URL
          setPriceRange({
              min: priceMinFromUrl || '',
              max: priceMaxFromUrl || ''
          });
      }
      
      console.log('=== ОБРАБОТКА URL ПАРАМЕТРОВ ===');
      console.log('Поиск:', searchFromUrl);
      console.log('Категория:', categoryFromUrl);
      console.log('Бренд:', brandFromUrl);
      console.log('Цена от:', priceMinFromUrl);
      console.log('Цена до:', priceMaxFromUrl);
  }, [searchParams]);

  // Функция для добавления товара в корзину
  const addToCart = async (productId, productSlug) => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
      
      const response = await fetch(`${apiUrl}/cart/add_item/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`
        },
        body: JSON.stringify({
          product_slug: productSlug,
          quantity: 1
        })
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (response.ok) {
        console.log('✓ Товар добавлен в корзину');
      } else {
        console.error('✗ Ошибка добавления в корзину');
      }
    } catch (error) {
      console.error('✗ Ошибка сети:', error);
    } finally {
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  // Функция фильтрации и сортировки товаров
  const filteredProducts = products
    .filter(product => {
      // Фильтр по категории
      const matchesCategory = !selectedCategory || product.category?.slug === selectedCategory;
      
      // Фильтр по бренду
      const matchesBrand = !selectedBrand || product.brand?.slug === selectedBrand;
      
      // Фильтр по поиску
      const matchesSearch = !searchTerm || 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Фильтр по цене
      const matchesMinPrice = !priceRange.min || parseFloat(product.price) >= parseFloat(priceRange.min);
      const matchesMaxPrice = !priceRange.max || parseFloat(product.price) <= parseFloat(priceRange.max);
            
      // Фильтр по наличию
      const matchesStock = !inStockOnly || product.stock > 0;
      
      return matchesCategory && matchesBrand && matchesSearch && 
             matchesMinPrice && matchesMaxPrice && matchesStock;
    })
    .sort((a, b) => {
      // Сортировка товаров
      switch (sortBy) {
        case 'price-asc':
          return parseFloat(a.price) - parseFloat(b.price);
        case 'price-desc':
          return parseFloat(b.price) - parseFloat(a.price);

        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });
  
  // Функция сброса всех фильтров
  const resetFilters = () => {
    setSelectedCategory('');
    setSelectedBrand('');
    setSearchTerm('');
    setPriceRange({ min: '', max: '' });

    setInStockOnly(false);
    setSortBy('');
  };

  if (loading) {
    return (
      <Container className="text-center my-5">
        <Spinner animation="border" />
        <p className="mt-3">Загрузка каталога...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5">
        <Alert variant="danger">Ошибка: {error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      {/* УБИРАЕМ ЗАГОЛОВОК КАТАЛОГА - ЗАДАЧА №7 
      Заголовок "Каталог товаров" и описание убраны для чистоты интерфейса
      */}

      {/* УБИРАЕМ БЛОК ФИЛЬТРОВ - ЗАДАЧА №2 
      Панель фильтров закомментирована для упрощения интерфейса
      Поиск теперь работает через навигацию
      */}

      {/* Результаты поиска */}
      {filteredProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          Товары не найдены. Попробуйте изменить фильтры.
        </Alert>
      ) : (
        <>
          <div className="mb-3">
            <Badge bg="secondary" className="me-2">
              Найдено товаров: {filteredProducts.length}
            </Badge>
          </div>
          
          <Row>
            {filteredProducts.map(product => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <Card className="h-100 product-card">
                  <div className="text-center p-3">
                    <img
                      src={product.image || 'https://via.placeholder.com/200x150?text=Нет+фото'}
                      alt={product.name}
                      className="img-fluid"
                      style={{ maxHeight: '150px', objectFit: 'contain' }}
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <div className="mb-2">
                      <Badge bg="primary" className="me-1">
                        {product.category?.name}
                      </Badge>
                      <Badge bg="info">
                        {product.brand?.name}
                      </Badge>
                    </div>
                    
                    <Card.Title className="h6 mb-2">
                      {product.name}
                    </Card.Title>
                    
                    {/* Рейтинг товара */}
                    {product.rating > 0 && (
                      <div className="product-rating mb-2">
                        <span className="rating-stars">
                          {'⭐'.repeat(Math.round(product.rating))}
                        </span>
                        <span className="rating-value text-muted ms-1">
                          {product.rating.toFixed(1)}
                        </span>
                        {product.reviews_count > 0 && (
                          <span className="reviews-count text-muted ms-1">
                            ({product.reviews_count})
                          </span>
                        )}
                      </div>
                    )}
                    
                    <Card.Text className="text-muted small flex-grow-1">
                      {product.description.length > 100 
                        ? `${product.description.substring(0, 100)}...` 
                        : product.description}
                    </Card.Text>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-primary mb-0">
                          {product.price} BYN
                        </span>
                        <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock > 0 ? `В наличии: ${product.stock}` : 'Нет в наличии'}
                        </Badge>
                      </div>
                      
                      <div className="d-flex gap-2">
                        <Link 
                          to={`/product/${product.slug}`}
                          className="btn btn-outline-primary flex-grow-1"
                        >
                          Подробнее
                        </Link>
                        <Button
                          variant="success"
                          onClick={() => addToCart(product.id, product.slug)}
                          disabled={product.stock === 0 || addingToCart[product.id]}
                          className="flex-grow-1"
                        >
                          {addingToCart[product.id] ? (
                            <>
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                                className="me-1"
                              />
                              Добавление...
                            </>
                          ) : (
                            'В корзину'
                          )}
                        </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default Catalog;