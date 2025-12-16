import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Catalog from './components/Catalog';
import Cart from './components/Cart';
import Login from './components/Login';
import Register from './components/Register';
import ProductDetail from './components/ProductDetail';
import CreateProduct from './components/CreateProduct';
import Profile from './components/Profile';
// Импортируем компонент страницы избранного
import Favorites from './components/Favorites';
// Импортируем новые страницы для хедера
import Pickup from './components/Pickup';
import Delivery from './components/Delivery';
import PaintSelection from './components/PaintSelection';
import Wholesale from './components/Wholesale';
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
                        {/* НОВЫЕ МАРШРУТЫ ДЛЯ СТРАНИЦ ХЕДЕРА */}
                        <Route path="/pickup" element={<Pickup />} />
                        <Route path="/delivery" element={<Delivery />} />
                        <Route path="/paint-selection" element={<PaintSelection />} />
                        <Route path="/wholesale" element={<Wholesale />} />
                    </Routes>
                </div>
                
                {/* Футер сайта */}
                <Footer />
            </Router>
        </div>
    );
}

export default App;
