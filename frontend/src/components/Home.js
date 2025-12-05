import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaHeart, FaChevronLeft, FaChevronRight } from 'react-icons/fa';

function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());

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
      {/* Желтый промо-баннер */}
      <div className="promo-banner">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <div className="promo-content">
                <h3 className="promo-subtitle">Особые условия только для вас</h3>
                <h2 className="promo-title">Бесплатная доставка для всех клиентов магазина</h2>
                <p className="promo-description">Доставка в ПВЗ или до двери!</p>
              </div>
            </Col>
            <Col md={4} className="text-end">
              <div className="promo-image-wrapper">
                <div className="promo-delivery-box">
                  <div className="delivery-text">Доставка 24/7</div>
                </div>
              </div>
            </Col>
          </Row>
          <div className="promo-arrows">
            <button className="promo-arrow"><FaChevronLeft /></button>
            <button className="promo-arrow"><FaChevronRight /></button>
          </div>
        </Container>
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
