import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './components/pages/Home';
import Catalog from './components/catalog/Catalog';
import Cart from './components/cart/Cart';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductDetail from './components/product/ProductDetail';
import CreateProduct from './components/pages/CreateProduct';
import Profile from './components/profile/Profile';
import Checkout from './components/checkout/Checkout';
// Импортируем компонент страницы избранного
import Favorites from './components/pages/Favorites';
// Импортируем новые страницы для хедера
import Pickup from './components/pages/Pickup';
import Delivery from './components/pages/Delivery';
import PaintSelection from './components/PaintSelection';
import Wholesale from './components/pages/Wholesale';
// Импортируем новые страницы для футера
import About from './components/pages/About';
import Warranty from './components/pages/Warranty';
import HowToOrder from './components/pages/HowToOrder';
import TechnicalSupport from './components/pages/TechnicalSupport';
import ColorMatching from './components/pages/ColorMatching';
import FAQ from './components/pages/FAQ';
import Contacts from './components/pages/Contacts';
import backgroundImage from './assets/images/background.jpg';

function App() {
    return (
        <div 
            className="App app-background"
            style={{
                backgroundImage: `url(${backgroundImage})`
            }}
        >
            <Router>
                {/* Шапка сайта */}
                <Navbar />
                
                {/* Основной контент */}
                <div className="main-content">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/catalog" element={<Catalog />} />
                        <Route path="/cart" element={<Cart />} />
                        {/* Добавляем маршрут для страницы избранного */}
                        <Route path="/favorites" element={<Favorites />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/product/:slug" element={<ProductDetail />} />
                        <Route path="/create-product" element={<CreateProduct />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/checkout" element={<Checkout />} />
                        {/* НОВЫЕ МАРШРУТЫ ДЛЯ СТРАНИЦ ХЕДЕРА */}
                        <Route path="/pickup" element={<Pickup />} />
                        <Route path="/delivery" element={<Delivery />} />
                        <Route path="/paint-selection" element={<PaintSelection />} />
                        <Route path="/wholesale" element={<Wholesale />} />
                        {/* НОВЫЕ МАРШРУТЫ ДЛЯ СТРАНИЦ ФУТЕРА */}
                        <Route path="/about" element={<About />} />
                        <Route path="/warranty" element={<Warranty />} />
                        <Route path="/how-to-order" element={<HowToOrder />} />
                        <Route path="/technical-support" element={<TechnicalSupport />} />
                        <Route path="/color-matching" element={<ColorMatching />} />
                        <Route path="/faq" element={<FAQ />} />
                        <Route path="/contacts" element={<Contacts />} />
                    </Routes>
                </div>
                
                {/* Футер сайта */}
                <Footer />
            </Router>
        </div>
    );
}

export default App;
