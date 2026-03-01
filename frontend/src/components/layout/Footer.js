// frontend/src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import './Footer.css';
import { Link } from 'react-router-dom';
import { 
  FaPhone, 
  FaEnvelope, 
  FaMapMarkerAlt, 
  FaClock,
  FaFacebookF,
  FaInstagram,
  FaTelegramPlane,
  FaViber
} from 'react-icons/fa';

function Footer() {
  return (
    <footer className="footer">
      {/* Основная часть футера */}
      <div className="footer-main">
        <Container>
          <Row>
            {/* Колонка 1: О компании - обновленная информация для магазина кузовного ремонта */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">TIME TO BLOW</h5>
              <p className="footer-description">
                Профессиональные материалы для кузовного ремонта и покраски автомобилей. 
                Краски, грунты, шпатлевки, абразивы и инструменты от ведущих мировых брендов.
              </p>
              {/* Социальные сети */}
              <div className="footer-social">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaFacebookF />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaInstagram />
                </a>
                <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaTelegramPlane />
                </a>
                <a href="https://viber.com" target="_blank" rel="noopener noreferrer" className="social-link">
                  <FaViber />
                </a>
              </div>
            </Col>

            {/* Колонка 2: Информация - обновленные ссылки для кузовного ремонта */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">Информация</h5>
              <ul className="footer-links">
                <li><Link to="/catalog">Каталог материалов</Link></li>
                <li><Link to="/about">О компании</Link></li>
                <li><Link to="/terms">Условия использования</Link></li>
                <li><Link to="/privacy">Политика конфиденциальности</Link></li>
                <li><Link to="/paint-selection">Подбор краски по коду</Link></li>
                <li><Link to="/delivery">Доставка и оплата</Link></li>
                <li><Link to="/warranty">Гарантия качества</Link></li>
                <li><Link to="/contacts">Контакты</Link></li>
              </ul>
            </Col>

            {/* Колонка 3: Покупателям - специализированные услуги для кузовного ремонта */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">Покупателям</h5>
              <ul className="footer-links">
                <li><Link to="/how-to-order">Как сделать заказ</Link></li>
                <li><Link to="/wholesale">Оптовым покупателям</Link></li>
                <li><Link to="/pickup">Пункты самовывоза</Link></li>
                <li><Link to="/technical-support">Техническая поддержка</Link></li>
                <li><Link to="/color-matching">Компьютерный подбор цвета</Link></li>
                <li><Link to="/faq">Вопросы и ответы</Link></li>
              </ul>
            </Col>

            {/* Колонка 4: Контакты - реальные контакты для магазина кузовного ремонта */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">Контакты</h5>
              <ul className="footer-contacts">
                <li>
                  <FaPhone className="contact-icon" />
                  <div className="contact-info">
                    <a href="tel:+375291234567">+375 (29) 123-45-67</a>
                    <span className="contact-label">Основной номер</span>
                  </div>
                </li>
                <li>
                  <FaPhone className="contact-icon" />
                  <div className="contact-info">
                    <a href="tel:+375331234567">+375 (33) 123-45-67</a>
                    <span className="contact-label">Viber, Telegram</span>
                  </div>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <div className="contact-info">
                    <a href="mailto:info@bodyrepair.by">info@timetoblow.by</a>
                    <span className="contact-label">Email для заказов</span>
                  </div>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <div className="contact-info">
                    <span>г. Минск, ул. Промышленная, 15А</span>
                    <span className="contact-label">Склад и магазин</span>
                  </div>
                </li>
                <li>
                  <FaClock className="contact-icon" />
                  <div className="contact-info">
                    <span>пн-пт: 08:00 - 19:00</span>
                    <span>сб: 09:00 - 15:00, вс: выходной</span>
                  </div>
                </li>
              </ul>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Нижняя часть футера */}
      <div className="footer-bottom">
        <Container>
          <Row className="align-items-center">
            <Col md={6} className="footer-copyright">
              <p>&copy; {new Date().getFullYear()} TIME TO BLOW. Все права защищены. by Skodnik.</p>
            </Col>
            <Col md={6} className="footer-payment">
              <div className="payment-methods">
                <span className="payment-label">Принимаем к оплате:</span>
                <div className="payment-icons">
                  <span className="payment-icon">💳 Visa</span>
                  <span className="payment-icon">💳 MasterCard</span>
                  <span className="payment-icon">💰 Наличные</span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default Footer;
