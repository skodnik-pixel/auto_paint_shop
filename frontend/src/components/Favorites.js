// Компонент страницы избранного
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

function Favorites() {
  // Состояние для списка избранных товаров
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  // Состояние загрузки
  const [loading, setLoading] = useState(true);

  // Загружаем избранные товары при загрузке компонента
  useEffect(() => {
    loadFavoriteProducts();
  }, []);

  // Функция загрузки избранных товаров
  const loadFavoriteProducts = async () => {
    try {
      // Получаем список ID избранных товаров из localStorage
      const savedFavorites = localStorage.getItem('favorites');
      if (!savedFavorites) {
        setLoading(false);
        return;
      }

      // Парсим JSON с ID товаров
      const favoriteIds = JSON.parse(savedFavorites);
      if (favoriteIds.length === 0) {
        setLoading(false);
        return;
      }

      // Загружаем данные товаров с сервера
      const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
      const response = await fetch(`${apiUrl}/catalog/products/`);
      const data = await response.json();
      const allProducts = data.results || data;

      // Фильтруем только избранные товары
      const favorites = allProducts.filter(product => favoriteIds.includes(product.id));
      setFavoriteProducts(favorites);
      setLoading(false);
    } catch (error) {
      console.error('Error loading favorite products:', error);
      setLoading(false);
    }
  };

  // Функция удаления товара из избранного
  const removeFromFavorites = (productId) => {
    // Получаем текущий список избранного
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      const favoriteIds = JSON.parse(savedFavorites);
      // Удаляем товар из списка
      const updatedIds = favoriteIds.filter(id => id !== productId);
      // Сохраняем обновленный список
      localStorage.setItem('favorites', JSON.stringify(updatedIds));
      
      // Обновляем состояние компонента
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
      
      // Отправляем событие для обновления счетчика в навигации
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
        detail: { count: updatedIds.length } 
      }));
    }
  };

  // Функция расчета скидки (как в Home.js)
  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  // Функция получения старой цены (как в Home.js)
  const getOriginalPrice = (price) => {
    return (parseFloat(price) * 1.25).toFixed(2);
  };

  return (
    <Container className="favorites-page py-4">
      <h2 className="mb-4">Избранные товары</h2>
      
      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Загрузка...</span>
          </div>
        </div>
      ) : favoriteProducts.length === 0 ? (
        <Alert variant="info" className="text-center">
          <h4>Избранных товаров пока нет</h4>
          <p>Добавьте товары в избранное, нажав на звездочку на карточке товара</p>
          <Link to="/" className="btn btn-primary">
            Перейти к товарам
          </Link>
        </Alert>
      ) : (
        <Row>
          {favoriteProducts.map(product => {
            const originalPrice = getOriginalPrice(product.price);
            const discount = calculateDiscount(parseFloat(product.price), parseFloat(originalPrice));
            
            return (
              <Col key={product.id} md={3} sm={6} className="mb-4">
                <Card className="product-card h-100">
                  <div className="product-favorite" onClick={() => removeFromFavorites(product.id)}>
                    <FaStar className="favorite-active" />
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
                    
                    <Link to={`/product/${product.slug || product.id}`} className="product-detail-link">
                      <Button variant="primary" size="sm" className="product-detail-btn">
                        Подробнее
                      </Button>
                    </Link>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
}

export default Favorites;