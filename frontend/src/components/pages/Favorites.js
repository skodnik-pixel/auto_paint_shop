// Компонент страницы избранного
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Alert, Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaStar, FaShoppingCart } from 'react-icons/fa';
import './Favorites.css';

function Favorites() {
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  // Модальное окно "Подробнее" — описание товара в одном месте, без дублирования
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Загружаем избранные товары при загрузке компонента
  useEffect(() => {
    loadFavoriteProducts();
  }, []);

  // Функция загрузки избранных товаров
  const loadFavoriteProducts = async () => {
    try {
      // Получаем список избранных товаров из localStorage
      const savedFavorites = localStorage.getItem('favorites');
      if (!savedFavorites) {
        setLoading(false);
        return;
      }

      // Парсим JSON с товарами (теперь это полные объекты, а не только ID)
      const favoriteProducts = JSON.parse(savedFavorites);
      if (favoriteProducts.length === 0) {
        setLoading(false);
        return;
      }

      // Устанавливаем избранные товары (они уже содержат всю нужную информацию)
      setFavoriteProducts(favoriteProducts);
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
      const favoriteProducts = JSON.parse(savedFavorites);
      // Удаляем товар из списка (по ID)
      const updatedFavorites = favoriteProducts.filter(product => product.id !== productId);
      // Сохраняем обновленный список
      localStorage.setItem('favorites', JSON.stringify(updatedFavorites));
      
      // Обновляем состояние компонента
      setFavoriteProducts(prev => prev.filter(product => product.id !== productId));
      
      // Отправляем событие для обновления счетчика в навигации
      window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
        detail: { count: updatedFavorites.length } 
      }));
    }
  };

  // Функция расчета скидки (как в Home.js)
  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getOriginalPrice = (price) => {
    return (parseFloat(price) * 1.25).toFixed(2);
  };

  // Добавление товара в корзину (localStorage), как в Cart.js
  const addToCart = (product) => {
    try {
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.id === product.id);
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          slug: product.slug
        });
      }
      localStorage.setItem('cart', JSON.stringify(cart));
      window.dispatchEvent(new Event('cartUpdated'));
      setShowDetailModal(false);
      setSelectedProduct(null);
    } catch (e) {
      console.error('Ошибка добавления в корзину:', e);
    }
  };

  const openDetailModal = (product) => {
    setSelectedProduct(product);
    setShowDetailModal(true);
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
                    
                    <div className="d-flex gap-2 flex-wrap">
                      <Button variant="outline-primary" size="sm" onClick={() => openDetailModal(product)}>
                        Подробнее
                      </Button>
                      <Button variant="success" size="sm" onClick={() => addToCart(product)} className="d-flex align-items-center gap-1">
                        <FaShoppingCart /> Купить
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Модальное окно: описание товара в одном месте, без дублирования на карточке */}
      <Modal show={showDetailModal} onHide={() => { setShowDetailModal(false); setSelectedProduct(null); }} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedProduct?.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedProduct && (
            <>
              <div className="text-center mb-3">
                <img
                  src={selectedProduct.image || 'https://via.placeholder.com/200x200?text=Нет+фото'}
                  alt={selectedProduct.name}
                  style={{ maxWidth: '200px', maxHeight: '200px', objectFit: 'contain' }}
                />
              </div>
              <p className="text-muted mb-2"><strong>Цена:</strong> {selectedProduct.price} BYN</p>
              <p className="mb-0"><strong>Описание:</strong></p>
              <p className="text-muted small">{selectedProduct.description || 'Нет описания'}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => { setShowDetailModal(false); setSelectedProduct(null); }}>
            Закрыть
          </Button>
          {selectedProduct && (
            <Button variant="success" onClick={() => addToCart(selectedProduct)}>
              <FaShoppingCart className="me-1" /> Купить
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default Favorites;