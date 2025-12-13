import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  
  // Состояние для слайдера
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Данные для слайдов
  const slides = [
    {
      id: 1,
      title: 'Профессиональные материалы для кузовного ремонта',
      subtitle: 'Краски, лаки, грунты от ведущих производителей',
      description: 'NOVOL, BODY, SPECTRAL, JETA PRO - всё для качественного ремонта',
      buttonText: 'Перейти в каталог',
      buttonLink: '/catalog',
      bgColor: '#E31E24',
      // Замени на свою картинку! Варианты:
      // 1. URL из интернета: 'https://example.com/banner1.jpg'
      // 2. Файл в public/images/: '/images/banner1.jpg'
      // 3. Placeholder пока нет картинки:
      image: '/images/ban1.jpg'
    },
    {
      id: 2,
      title: 'Скидки до 30%',
      subtitle: 'Акция на инструменты и оборудование',
      description: 'Пневмо и электроинструменты, абразивы, малярные материалы',
      buttonText: 'Смотреть акции',
      buttonLink: '/catalog',
      bgColor: '#C41E3A',
      // Замени на свою картинку для акций
      image: '/images/ban2.jpg'
    },
    {
      id: 3,
      title: 'Бесплатная доставка',
      subtitle: 'При заказе от 100 BYN',
      description: 'Доставка по всей Беларуси. Быстро и надёжно',
      buttonText: 'Узнать подробнее',
      buttonLink: '/catalog',
      bgColor: '#FF4444',
      // Замени на свою картинку для доставки
      image: '/images/ban3.jpg'
    }
  ];

  // Загрузка товаров
  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
        const response = await fetch(`${apiUrl}/catalog/products/`);
        if (!response.headers.get('content-type')?.includes('application/json')) {
          const text = await response.text();
          throw new Error(`Ожидался JSON, получен HTML. Проверьте URL: ${apiUrl}/catalog/products/`);
        }
        const data = await response.json();
        const products = data.results || data;
        // Берем первые 5 товаров как акционные (с "скидкой")
        setPromoProducts(products.slice(0, 5));
        // Остальные как популярные
        setFeaturedProducts(products.slice(5, 11));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  // Автоматическая прокрутка слайдера
  useEffect(() => {
    // Таймер для автоматической смены слайдов каждые 5 секунд
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 12000);

    // Очищаем таймер при размонтировании компонента
    return () => clearInterval(timer);
  }, [slides.length]);

  // Функции для управления слайдером
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
  };

  const toggleFavorite = (productId) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(productId)) {
      newFavorites.delete(productId);
    } else {
      newFavorites.add(productId);
    }
    setFavorites(newFavorites);
  };

  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getOriginalPrice = (price) => {
    // Для демонстрации добавляем 20-30% к цене как "старая цена"
    return (parseFloat(price) * 1.25).toFixed(2);
  };


  return (
    <div className="home-page">
      {/* Слайдер */}
      <div className="hero-slider">
        <div className="slider-container">
          {/* Слайды */}
          <div 
            className="slides-wrapper" 
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, index) => (
              <div 
                key={slide.id} 
                className="slide"
                style={{
                   backgroundImage:`url(${slide.image})`,
                   backgroundColor: slide.bgColor }}
              >
                <Container>
                  <Row className="align-items-center">
                    <Col md={12} className="slide-content">
                      <div className="slide-text">
                        <h3 className="slide-subtitle">{slide.subtitle}</h3>
                        <h1 className="slide-title">{slide.title}</h1>
                        <p className="slide-description">{slide.description}</p>
                        <Link to={slide.buttonLink}>
                          <Button variant="light" size="lg" className="slide-button">
                            {slide.buttonText}
                          </Button>
                        </Link>
                      </div>
                    </Col>
                  </Row>
                </Container>
              </div>
            ))}
          </div>

          {/* Кнопки навигации */}
          <button 
            className="slider-arrow slider-arrow-left" 
            onClick={prevSlide}
            aria-label="Предыдущий слайд"
          >
            <FaChevronLeft />
          </button>
          <button 
            className="slider-arrow slider-arrow-right" 
            onClick={nextSlide}
            aria-label="Следующий слайд"
          >
            <FaChevronRight />
          </button>

          {/* Индикаторы слайдов */}
          <div className="slider-indicators">
            {slides.map((_, index) => (
              <button
                key={index}
                className={`slider-indicator ${index === currentSlide ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
                aria-label={`Перейти к слайду ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Акционные товары */}
      <Container className="mb-5">
        <div className="section-header mb-4">
          <h2 className="section-title">Акционные товары</h2>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : (
          <>
            <Row className="promo-products-row">
              {promoProducts.map(product => {
                const originalPrice = getOriginalPrice(product.price);
                const discount = calculateDiscount(parseFloat(product.price), parseFloat(originalPrice));
                const isFavorite = favorites.has(product.id);
                
                return (
                  <Col key={product.id} className="promo-product-col">
                    <Card className="promo-product-card">
                      <div className="product-favorite" onClick={() => toggleFavorite(product.id)}>
                        <FaHeart className={isFavorite ? 'favorite-active' : ''} />
                      </div>
                      <div className="product-image-wrapper">
                        <img
                          src={product.image || 'https://via.placeholder.com/200x200?text=Нет+фото'}
                          alt={product.name}
                          className="product-image"
                        />
                      </div>
                      <Card.Body className="product-card-body">
                        <div className="product-price-section">
                          <div className="product-current-price">{product.price} BYN</div>
                          <div className="product-original-price">{originalPrice} BYN</div>
                          <Badge className="product-discount-badge">-{discount}%</Badge>
                        </div>
                        <Card.Title className="product-name">{product.name}</Card.Title>
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>
            <div className="promo-pagination">
              {[1, 2, 3].map((dot, index) => (
                <span key={index} className={`pagination-dot ${index === 0 ? 'active' : ''}`}></span>
              ))}
            </div>
          </>
        )}
      </Container>

    </div>
  );
}

export default Home;
