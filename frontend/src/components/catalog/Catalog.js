
import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Spinner, Alert, Form, Button } from 'react-bootstrap';
// Добавляем useSearchParams для чтения URL параметров
// Добавляем иконки для кнопок количества и покупки
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { FaStar, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';

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
  
  // Состояние для количества товаров (для кнопок +/-)
  const [quantities, setQuantities] = useState({});
  
  // Состояние для избранного товаров
  const [favorites, setFavorites] = useState(() => {
    // Загружаем избранное из localStorage при инициализации
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  });
  
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Новые фильтры
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState(''); // price-asc, price-desc, name
  
  // Пагинация
  const [currentPage, setCurrentPage] = useState(1); // Текущая страница
  const [itemsPerPage] = useState(12); // Товаров на странице (12 = 3 ряда по 4 товара)

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

  // Функция добавления/удаления товара из избранного
  const toggleFavorite = (product) => {
    const isFav = favorites.some(fav => fav.id === product.id);
    let newFavorites;
    
    if (isFav) {
      // Удаляем из избранного
      newFavorites = favorites.filter(fav => fav.id !== product.id);
    } else {
      // Добавляем в избранное
      newFavorites = [...favorites, product];
    }
    
    setFavorites(newFavorites);
    localStorage.setItem('favorites', JSON.stringify(newFavorites));
    
    // Отправляем событие для обновления счетчика в навигации
    window.dispatchEvent(new CustomEvent('favoritesUpdated', {
      detail: { count: newFavorites.length }
    }));
  };

  // Функция проверки - находится ли товар в избранном
  const isFavorite = (productId) => {
    return favorites.some(fav => fav.id === productId);
  };

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
        // Синхронизируем с localStorage, чтобы счётчик в шапке обновился
        const product = products.find(p => p.id === productId);
        if (product) {
          const cart = JSON.parse(localStorage.getItem('cart') || '[]');
          const existing = cart.find(item => item.id === product.id);
          if (existing) existing.quantity += 1;
          else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, slug: product.slug, quantity: 1 });
          localStorage.setItem('cart', JSON.stringify(cart));
        }
        window.dispatchEvent(new Event('cartUpdated'));
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
      
      // Уведомляем шапку сайта обновить счётчик корзины
      window.dispatchEvent(new Event('cartUpdated'));
      
      console.log(`Товар "${product.name}" добавлен в корзину и историю!`);
      
    } catch (error) {
      console.error('Ошибка при добавлении товара:', error);
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

  // Пагинация - вычисляем какие товары показывать
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Функция смены страницы
  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); // Прокрутка вверх
  };

  // Сброс на первую страницу при изменении фильтров
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedBrand, searchTerm, priceRange, inStockOnly, sortBy]);

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
            {currentProducts.map(product => (
              <Col key={product.id} lg={4} md={6} className="mb-4">
                <Card className="h-100 product-card">
                  <div className="text-center p-3 position-relative">
                    <img
                      src={product.image || 'https://via.placeholder.com/200x150?text=Нет+фото'}
                      alt={product.name}
                      className="img-fluid"
                      style={{ maxHeight: '150px', objectFit: 'contain' }}
                    />
                    
                    {/* ⭐ ЗВЁЗДОЧКА ИЗБРАННОГО */}
                    <Button
                      variant="link"
                      className={`favorite-btn ${isFavorite(product.id) ? 'favorite-active' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleFavorite(product);
                      }}
                      title={isFavorite(product.id) ? 'Удалить из избранного' : 'Добавить в избранное'}
                    >
                      <FaStar />
                    </Button>
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
                      
                      {/* Блок с кнопками управления товаром */}
                      <div className="product-actions">
                        {/* Кнопки количества товара */}
                        <div className="quantity-controls">
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => decreaseQuantity(product.id)}
                            className="quantity-btn"
                            disabled={product.stock === 0}
                          >
                            <FaMinus />
                          </Button>
                          <span className="quantity-display">{quantities[product.id] || 1}</span>
                          <Button 
                            variant="outline-secondary" 
                            size="sm" 
                            onClick={() => increaseQuantity(product.id)}
                            className="quantity-btn"
                            disabled={product.stock === 0}
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
                            disabled={product.stock === 0}
                          >
                            <FaShoppingCart className="me-1" />
                            Купить
                          </Button>
                          
                          {/* Кнопка "Подробнее" для перехода на страницу товара */}
                          <Link 
                            to={`/product/${product.slug}`}
                            className="btn btn-primary btn-sm product-detail-btn"
                          >
                            Подробнее
                          </Link>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

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

                  {/* Номера страниц (показываем текущую и по 2 с каждой стороны) */}
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
                Показано {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredProducts.length)} из {filteredProducts.length} товаров
              </div>
            </div>
          )}
        </>
      )}
    </Container>
  );
};

export default Catalog;