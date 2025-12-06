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

function App() {
    return (
        <Router>
            {/* Шапка сайта */}
            <Navbar />
            
            {/* Основной контент */}
            <div className="main-content">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/catalog" element={<Catalog />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/product/:slug" element={<ProductDetail />} />
                    <Route path="/create-product" element={<CreateProduct />} />
                </Routes>
            </div>
            
            {/* Футер сайта */}
            <Footer />
        </Router>
    );
}

export default App;
