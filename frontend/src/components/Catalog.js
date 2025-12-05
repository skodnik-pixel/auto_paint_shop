
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Catalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        const [categoriesRes, brandsRes, productsRes] = await Promise.all([
          fetch(`${apiUrl}/catalog/categories/`),
          fetch(`${apiUrl}/catalog/brands/`),
          fetch(`${apiUrl}/catalog/products/`)
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
                      
                      <Link 
                        to={`/product/${product.slug}`}
                        className="btn btn-outline-primary w-100"
                      >
                        Подробнее
                      </Link>
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