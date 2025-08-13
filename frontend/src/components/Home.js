import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Carousel } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/catalog/products/`);
        const data = await response.json();
        const products = data.results || data;
        // Берем первые 6 товаров как популярные
        setFeaturedProducts(products.slice(0, 6));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const banners = [
    {
      id: 1,
      title: "Профессиональные материалы для кузовного ремонта",
      subtitle: "Лучшие бренды для ремонта вашего автомобиля",
      image: "/images/ban1.jfif", // Изображение для кузовного ремонта
      link: "/catalog"
    },
    {
      id: 2,
      title: "Керамические покрытия",
      subtitle: "Долговечная защита вашего автомобиля",
      image: "/images/ban2.jfif", // Изображение для керамических покрытий
      link: "/catalog"
    },
    {
      id: 3,
      title: "Инструменты для деталинга",
      subtitle: "Профессиональное оборудование",
      image: "/images/ban4.jpg", // Изображение для инструментов
      link: "/catalog"
    }
  ];

  const categories = [
    {
      name: "Автокосметика",
      icon: "🧴",
      description: "Шампуни, воски, полироли",
      link: "/catalog?category=autocosmetics"
    },
    {
      name: "Автохимия", 
      icon: "🧪",
      description: "Очистители, обезжириватели",
      link: "/catalog?category=autochemistry"
    },
    {
      name: "Инструменты",
      icon: "🛠️", 
      description: "Щетки, губки, полотенца",
      link: "/catalog?category=tools"
    },
    {
      name: "Защитные покрытия",
      icon: "🛡️",
      description: "Керамика, воски, герметики", 
      link: "/catalog?category=protective-coatings"
    }
  ];

  return (
    <div>
      {/* Hero Banner */}
      <Carousel className="mb-5">
        {banners.map((banner) => (
          <Carousel.Item key={banner.id}>
            <div 
              className="hero-banner"
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${banner.image})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                                 height: '600px', // Можно изменить высоту
                display: 'flex',
                alignItems: 'center',
                color: 'white'
              }}
            >
              <Container>
                <Row>
                  <Col md={6}>
                    <h1 className="display-4 fw-bold mb-3">{banner.title}</h1>
                    <p className="lead mb-4">{banner.subtitle}</p>
                                         <Link to={banner.link}>
                       <Button variant="primary" size="lg" className="btn-custom">
                         Смотреть товары
                       </Button>
                     </Link>
                  </Col>
                </Row>
              </Container>
            </div>
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Категории */}
      <Container className="mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Категории товаров</h2>
          <p className="text-muted">Выберите интересующую вас категорию</p>
        </div>
        
        <Row>
          {categories.map((category, index) => (
            <Col key={index} lg={3} md={6} className="mb-4">
              <Link to={category.link} className="text-decoration-none">
                <Card className="h-100 category-card text-center">
                  <Card.Body>
                    <div className="category-icon mb-3">
                      <span style={{ fontSize: '3rem' }}>{category.icon}</span>
                    </div>
                    <Card.Title className="fw-bold">{category.name}</Card.Title>
                    <Card.Text className="text-muted">{category.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Link>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Популярные товары */}
      <Container className="mb-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold">Популярные товары</h2>
          <p className="text-muted">Самые востребованные товары наших клиентов</p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : (
          <Row>
            {featuredProducts.map(product => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <Card className="h-100 product-card">
                  <div className="text-center p-3">
                    <img
                      src={product.image || 'https://via.placeholder.com/300x200?text=Нет+фото'}
                      alt={product.name}
                      className="img-fluid"
                      style={{ maxHeight: '200px', objectFit: 'contain' }}
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
                      {product.description.length > 80 
                        ? `${product.description.substring(0, 80)}...` 
                        : product.description}
                    </Card.Text>
                    
                    <div className="mt-auto">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="h5 text-primary mb-0">
                          {product.price} BYN
                        </span>
                        <Badge bg={product.stock > 0 ? 'success' : 'danger'}>
                          {product.stock > 0 ? `В наличии` : 'Нет в наличии'}
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
        )}
      </Container>

      {/* Преимущества */}
      <div className="bg-light py-5">
        <Container>
          <div className="text-center mb-4">
            <h2 className="fw-bold">Почему выбирают нас</h2>
            <p className="text-muted">Мы предлагаем только качественные товары</p>
          </div>
          
          <Row>
            <Col md={3} className="text-center mb-4">
              <div className="feature-icon mb-3">
                <span style={{ fontSize: '2.5rem' }}>🚚</span>
              </div>
              <h5>Быстрая доставка</h5>
              <p className="text-muted">Доставляем по всей Беларуси</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="feature-icon mb-3">
                <span style={{ fontSize: '2.5rem' }}>✅</span>
              </div>
              <h5>Гарантия качества</h5>
              <p className="text-muted">Только оригинальные товары</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="feature-icon mb-3">
                <span style={{ fontSize: '2.5rem' }}>💰</span>
              </div>
              <h5>Лучшие цены</h5>
              <p className="text-muted">Конкурентные цены на все товары</p>
            </Col>
            <Col md={3} className="text-center mb-4">
              <div className="feature-icon mb-3">
                <span style={{ fontSize: '2.5rem' }}>🎯</span>
              </div>
              <h5>Профессиональная консультация</h5>
              <p className="text-muted">Поможем выбрать подходящий товар</p>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default Home;
