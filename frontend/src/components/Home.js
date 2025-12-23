import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
// FaStar - иконка звездочки для избранного
// FaChevronLeft, FaChevronRight - стрелки для слайдера
// FaPlus, FaMinus - иконки для кнопок количества
// FaShoppingCart - иконка корзины для кнопки "Купить"
import { FaStar, FaChevronLeft, FaChevronRight, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';


function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [promoProducts, setPromoProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState(new Set());
  
  // Состояние для количества товаров (для кнопок +/-)
  const [quantities, setQuantities] = useState({});
  
  // Состояние для слайдера
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Пагинация для товаров на главной
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // 10 товаров на странице (2 ряда по 5)
  
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

  // Загружаем избранное из localStorage при загрузке компонента
  useEffect(() => {
    // Получаем сохраненное избранное из localStorage
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      try {
        // Парсим JSON и создаем Set из массива ID товаров
        const favoritesArray = JSON.parse(savedFavorites);
        setFavorites(new Set(favoritesArray));
      } catch (error) {
        // Если ошибка парсинга - сбрасываем избранное
        console.error('Error parsing saved favorites:', error);
        setFavorites(new Set());
      }
    }
  }, []);

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

  // Функция добавления/удаления товара из избранного
  const toggleFavorite = (productId) => {
    // Создаем новый Set на основе текущего состояния избранного
    const newFavorites = new Set(favorites);
    
    if (newFavorites.has(productId)) {
      // Если товар уже в избранном - удаляем его
      newFavorites.delete(productId);
    } else {
      // Если товара нет в избранном - добавляем его
      newFavorites.add(productId);
    }
    
    // Обновляем состояние избранного
    setFavorites(newFavorites);
    
    // Сохраняем избранное в localStorage для постоянного хранения
    // Array.from() преобразует Set в обычный массив для JSON
    localStorage.setItem('favorites', JSON.stringify(Array.from(newFavorites)));
    
    // Отправляем событие для обновления счетчика в навигации
    // CustomEvent - специальное событие браузера для передачи данных между компонентами
    window.dispatchEvent(new CustomEvent('favoritesUpdated', { 
      detail: { count: newFavorites.size } 
    }));
  };

  const calculateDiscount = (currentPrice, originalPrice) => {
    if (!originalPrice || originalPrice <= currentPrice) return 0;
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  const getOriginalPrice = (price) => {
    // Для демонстрации добавляем 20-30% к цене как "старая цена"
    return (parseFloat(price) * 1.25).toFixed(2);
  };

  // Пагинация - вычисляем какие товары показывать
  const allProducts = promoProducts.concat(featuredProducts);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = allProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(allProducts.length / itemsPerPage);

  // Функция смены страницы
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 400, behavior: 'smooth' }); // Прокрутка к товарам
  };

  // Функции для работы с количеством товаров
  const increaseQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: (prev[productId] || 1) + 1
    }));
  };

  const decreaseQuantity = (productId) => {
    setQuantities(prev => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) - 1)
    }));
  };

  // Функция покупки товара (добавление в корзину и историю)
  const buyProduct = async (product) => {
    const quantity = quantities[product.id] || 1;
    
    try {
      // Добавляем в корзину
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existingItem = cart.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cart.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          slug: product.slug,
          quantity: quantity
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cart));
      
      // Добавляем в историю покупок
      const history = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
      const historyItem = {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        slug: product.slug,
        quantity: quantity,
        purchaseDate: new Date().toISOString()
      };
      
      // Проверяем есть ли уже такой товар в истории
      const existingHistoryIndex = history.findIndex(item => item.id === product.id);
      if (existingHistoryIndex >= 0) {
        // Обновляем существующий товар в истории
        history[existingHistoryIndex] = historyItem;
      } else {
        // Добавляем новый товар в начало истории
        history.unshift(historyItem);
      }
      
      localStorage.setItem('purchaseHistory', JSON.stringify(history));
      
      // Сбрасываем количество после покупки
      setQuantities(prev => ({
        ...prev,
        [product.id]: 1
      }));
      
      // Можно добавить уведомление о успешном добавлении
      console.log(`Товар "${product.name}" добавлен в корзину и историю!`);
      
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
    }
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

      {/* Товары в 2 ряда по 5 штук */}
      <Container className="mb-5">
        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Загрузка...</span>
            </div>
          </div>
        ) : (
          <>
          <div className="products-grid-container">
            {/* Товары текущей страницы в сетке 2x5 */}
            {currentProducts.map(product => {
              const originalPrice = getOriginalPrice(product.price);
              const discount = calculateDiscount(parseFloat(product.price), parseFloat(originalPrice));
              const isFavorite = favorites.has(product.id);
              
              return (
                <div key={product.id} className="product-grid-item">
                  <Card className="promo-product-card">
                    {/* Кнопка добавления в избранное (звездочка) */}
                    <div className="product-favorite" onClick={() => toggleFavorite(product.id)}>
                      {/* FaStar - иконка звездочки, меняет цвет если товар в избранном */}
                      <FaStar className={isFavorite ? 'favorite-active' : ''} />
                    </div>
                    <div className="product-image-wrapper">
                      <img
                        src={product.image || 'https://via.placeholder.com/200x200?text=Нет+фото'}
                        alt={product.name}
                        className="product-image"
                      />
                    </div>
                    <Card.Body className="product-card-body">
                      {/* Секция с ценами товара */}
                      <div className="product-price-section">
                        {/* Текущая цена товара (отображается крупным шрифтом) */}
                        <div className="product-current-price">{product.price} BYN</div>
                        {/* Старая цена товара (зачеркнутая, показывает от какой цены скидка) */}
                        <div className="product-original-price">{originalPrice} BYN</div>
                        {/* Badge - цветная метка Bootstrap для показа скидки (красный прямоугольник с белым текстом "-20%") */}
                        <Badge className="product-discount-badge">-{discount}%</Badge>
                      </div>
                      {/* Card.Title - заголовок карточки Bootstrap, отображает название товара */}
                      <Card.Title className="product-name">{product.name}</Card.Title>
                      
                      {/* Блок с кнопками управления товаром */}
                      <div className="product-actions">
                        {/* Кнопки количества товара */}
                        <div className="quantity-controls">
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => decreaseQuantity(product.id)}
                            className="quantity-btn"
                          >
                            <FaMinus />
                          </Button>
                          <span className="quantity-display">{quantities[product.id] || 1}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => increaseQuantity(product.id)}
                            className="quantity-btn"
                          >
                            <FaPlus />
                          </Button>
                        </div>
                        
                        {/* Кнопки действий */}
                        <div className="action-buttons">
                          {/* Кнопка "Купить" - добавляет в корзину и историю */}
                          <Button 
                            variant="success" 
                            size="sm" 
                            onClick={() => buyProduct(product)}
                            className="buy-btn"
                          >
                            <FaShoppingCart className="me-1" />
                            Купить
                          </Button>
                          
                          {/* Кнопка "Подробнее" для перехода на страницу товара */}
                          <Link to={`/product/${product.slug || product.id}`} className="product-detail-link">
                            <Button variant="primary" size="sm" className="product-detail-btn">
                              Подробнее
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              );
            })}
          </div>

          {/* Пагинация */}
          {totalPages > 1 && (
            <div className="pagination-container mt-5">
              <nav aria-label="Навигация по страницам">
                <ul className="pagination justify-content-center">
                  {/* Кнопка "Предыдущая" */}
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      ← Предыдущая
                    </button>
                  </li>

                  {/* Первая страница */}
                  {currentPage > 3 && (
                    <>
                      <li className="page-item">
                        <button className="page-link" onClick={() => paginate(1)}>
                          1
                        </button>
                      </li>
                      {currentPage > 4 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                    </>
                  )}

                  {/* Номера страниц */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(page => {
                      return page === currentPage || 
                             page === currentPage - 1 || 
                             page === currentPage - 2 ||
                             page === currentPage + 1 || 
                             page === currentPage + 2;
                    })
                    .map(page => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button
                          className="page-link"
                          onClick={() => paginate(page)}
                        >
                          {page}
                        </button>
                      </li>
                    ))}

                  {/* Последняя страница */}
                  {currentPage < totalPages - 2 && (
                    <>
                      {currentPage < totalPages - 3 && (
                        <li className="page-item disabled">
                          <span className="page-link">...</span>
                        </li>
                      )}
                      <li className="page-item">
                        <button className="page-link" onClick={() => paginate(totalPages)}>
                          {totalPages}
                        </button>
                      </li>
                    </>
                  )}

                  {/* Кнопка "Следующая" */}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Следующая →
                    </button>
                  </li>
                </ul>
              </nav>

              {/* Информация о текущей странице */}
              <div className="text-center mt-3 text-muted">
                Страница {currentPage} из {totalPages} 
                <span className="mx-2">•</span>
                Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, allProducts.length)} из {allProducts.length} товаров
              </div>
            </div>
          )}
          </>
        )}
      </Container>

    </div>
  );
}

export default Home;
