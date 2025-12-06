
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

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

  // Функция для добавления товара в корзину
  const addToCart = async (productId, productSlug) => {
    // Шаг 1: Получаем токен авторизации из localStorage
    const token = localStorage.getItem('token');
    
    // Шаг 2: Проверяем, авторизован ли пользователь
    if (!token) {
      // Если токена нет - показываем сообщение и перенаправляем на страницу входа
      alert('Пожалуйста, войдите в систему для добавления товаров в корзину');
      navigate('/login');
      return;
    }

    // Шаг 3: Устанавливаем состояние загрузки для этого товара
    // Это отключит кнопку и покажет индикатор загрузки
    setAddingToCart(prev => ({ ...prev, [productId]: true }));

    try {
      // Шаг 4: Формируем URL для API
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
      
      // Логируем информацию для отладки
      console.log('=== ДОБАВЛЕНИЕ ТОВАРА В КОРЗИНУ ===');
      console.log('URL:', `${apiUrl}/cart/add_item/`);
      console.log('Product Slug:', productSlug);
      console.log('Token (первые 10 символов):', token.substring(0, 10) + '...');

      // Шаг 5: Отправляем POST запрос на сервер
      // ВАЖНО: Правильный URL - /api/cart/add_item/ (без двойного cart)
      const response = await fetch(`${apiUrl}/cart/add_item/`, {
        method: 'POST', // Метод POST для создания/добавления данных
        headers: {
          'Content-Type': 'application/json', // Указываем, что отправляем JSON
          'Authorization': `Token ${token}` // Передаём токен для авторизации
        },
        body: JSON.stringify({
          product_slug: productSlug, // Slug товара (например, "jeta-pro")
          quantity: 1 // Количество товара (всегда 1 при добавлении)
        })
      });

      // Логируем статус ответа
      console.log('Статус ответа:', response.status, response.statusText);

      // Шаг 6: Проверяем статус ответа
      
      // Если 401 - токен недействителен или истёк
      if (response.status === 401) {
        alert('Ваша сессия истекла. Пожалуйста, войдите снова.');
        // Очищаем localStorage и перенаправляем на страницу входа
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      // Шаг 7: Читаем тело ответа
      // ВАЖНО: Сначала читаем текст, потом пытаемся распарсить JSON
      const responseText = await response.text();
      console.log('Тело ответа (текст):', responseText);

      // Шаг 8: Обрабатываем успешный ответ
      if (response.ok) {
        // Пытаемся распарсить JSON
        try {
          const data = responseText ? JSON.parse(responseText) : {};
          console.log('Товар добавлен успешно:', data);
          alert('Товар добавлен в корзину!');
        } catch (parseError) {
          // Если не удалось распарсить JSON, но статус успешный
          console.log('Ответ не является JSON, но операция успешна');
          alert('Товар добавлен в корзину!');
        }
      } else {
        // Шаг 9: Обрабатываем ошибку
        try {
          const errorData = responseText ? JSON.parse(responseText) : {};
          console.error('Ошибка от сервера:', errorData);
          alert(`Ошибка: ${errorData.error || errorData.detail || 'Не удалось добавить товар в корзину'}`);
        } catch (parseError) {
          // Если не удалось распарсить ошибку
          console.error('Не удалось распарсить ошибку:', responseText);
          alert(`Ошибка: ${response.status} ${response.statusText}`);
        }
      }
    } catch (error) {
      // Шаг 10: Обрабатываем ошибки сети или другие исключения
      console.error('Исключение при добавлении в корзину:', error);
      alert(`Ошибка при добавлении товара в корзину: ${error.message}`);
    } finally {
      // Шаг 11: Всегда снимаем состояние загрузки
      // Это выполнится в любом случае (успех или ошибка)
      setAddingToCart(prev => ({ ...prev, [productId]: false }));
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesCategory = !selectedCategory || product.category?.slug === selectedCategory;
    const matchesBrand = !selectedBrand || product.brand?.slug === selectedBrand;
    const matchesSearch = !searchTerm || 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesBrand && matchesSearch;
  });

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
      <div className="text-center mb-5">
        <h1>Каталог товаров</h1>
        <p className="text-muted">Профессиональная автокосметика и автохимия</p>
      </div>

      {/* Фильтры */}
      <Row className="mb-4">
        <Col md={3}>
          <Form.Group>
            <Form.Label>Категория</Form.Label>
            <Form.Select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Все категории</option>
              {categories.map(category => (
                <option key={category.id} value={category.slug}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Бренд</Form.Label>
            <Form.Select 
              value={selectedBrand} 
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="">Все бренды</option>
              {brands.map(brand => (
                <option key={brand.id} value={brand.slug}>
                  {brand.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group>
            <Form.Label>Поиск</Form.Label>
            <Form.Control
              type="text"
              placeholder="Поиск товаров..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>

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