// Компонент страницы избранного
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button, Modal } from 'react-bootstrap';
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

  // Добавление товара в корзину: для авторизованных — API, иначе localStorage (как Home/Catalog)
  const addToCart = async (product) => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://127.0.0.1:8000/api';
    const accessToken = localStorage.getItem('access_token') || localStorage.getItem('access');

    if (accessToken) {
      try {
        const response = await fetch(`${apiUrl}/cart/add_item/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`
          },
          body: JSON.stringify({ product_id: product.id, quantity: 1 })
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.error || err.detail || 'Ошибка добавления в корзину');
        }
        window.dispatchEvent(new Event('cartUpdated'));
        setShowDetailModal(false);
        setSelectedProduct(null);
      } catch (e) {
        console.error('Ошибка добавления в корзину:', e);
        alert(e.message || 'Ошибка при добавлении товара в корзину');
      }
      return;
    }

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
    <div className="favorites-page">
      <Container className="py-4">
        {/* Рамка «окна» в стиле сайта */}
        <div className="favorites-window">
          <div className="favorites-window-title">
            <span className="favorites-window-title-text">Избранные товары</span>
          </div>
          <div className="favorites-window-body">
            {loading ? (
              <div className="favorites-loading">
                <div className="spinner-border text-danger" role="status">
                  <span className="visually-hidden">Загрузка...</span>
                </div>
                <p className="mt-3 mb-0 text-muted">Загрузка избранного...</p>
              </div>
            ) : favoriteProducts.length === 0 ? (
              <div className="favorites-empty-state">
                <div className="favorites-empty-icon">
                  <FaStar />
                </div>
                <h4 className="favorites-empty-title">Избранных товаров пока нет</h4>
                <p className="favorites-empty-text">Добавьте товары в избранное, нажав на звёздочку на карточке товара в каталоге или на главной</p>
                <Link to="/" className="btn btn-danger favorites-empty-btn">
                  Перейти к товарам
                </Link>
              </div>
            ) : (
              <Row className="favorites-grid">
                {favoriteProducts.map(product => {
                  const originalPrice = getOriginalPrice(product.price);
                  const discount = calculateDiscount(parseFloat(product.price), parseFloat(originalPrice));
                  return (
                    <Col key={product.id} md={3} sm={6} className="mb-4">
                      <Card className="favorites-product-card h-100">
                        <div className="favorites-card-favorite" onClick={() => removeFromFavorites(product.id)} title="Удалить из избранного">
                          <FaStar className="favorite-active" />
                        </div>
                        <div className="favorites-card-image-wrapper">
                          <img
                            src={product.image || 'https://via.placeholder.com/200x200?text=Нет+фото'}
                            alt={product.name}
                            className="favorites-card-image"
                          />
                        </div>
                        <Card.Body className="favorites-card-body">
                          <div className="favorites-card-price-section">
                            <span className="favorites-card-current-price">{product.price} BYN</span>
                            <span className="favorites-card-original-price">{originalPrice} BYN</span>
                            <Badge className="favorites-card-discount">-{discount}%</Badge>
                          </div>
                          <Card.Title className="favorites-card-name">{product.name}</Card.Title>
                          <div className="favorites-card-actions">
                            <Button variant="outline-danger" size="sm" onClick={() => openDetailModal(product)} className="favorites-btn-detail">
                              Подробнее
                            </Button>
                            <Button variant="danger" size="sm" onClick={() => addToCart(product)} className="favorites-btn-buy">
                              <FaShoppingCart className="me-1" /> Купить
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            )}
          </div>
        </div>
      </Container>

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
    </div>
  );
}

export default Favorites;