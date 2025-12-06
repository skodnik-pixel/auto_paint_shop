// frontend/src/components/Footer.js
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
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
            {/* Колонка 1: О компании */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">TIME TO BLOW</h5>
              <p className="footer-description">
                Профессиональная автокосметика и автохимия. 
                Широкий ассортимент товаров от ведущих производителей.
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
                <a href="viber://chat" className="social-link">
                  <FaViber />
                </a>
              </div>
            </Col>

            {/* Колонка 2: Информация */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">Информация</h5>
              <ul className="footer-links">
                <li><Link to="/catalog">Каталог товаров</Link></li>
                <li><Link to="/about">О компании</Link></li>
                <li><Link to="/delivery">Доставка и оплата</Link></li>
                <li><Link to="/warranty">Гарантия и возврат</Link></li>
                <li><Link to="/contacts">Контакты</Link></li>
              </ul>
            </Col>

            {/* Колонка 3: Покупателям */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">Покупателям</h5>
              <ul className="footer-links">
                <li><Link to="/how-to-order">Как сделать заказ</Link></li>
                <li><Link to="/payment">Способы оплаты</Link></li>
                <li><Link to="/pickup">Пункты самовывоза</Link></li>
                <li><Link to="/discount">Дисконтная программа</Link></li>
                <li><Link to="/faq">Вопросы и ответы</Link></li>
              </ul>
            </Col>

            {/* Колонка 4: Контакты */}
            <Col lg={3} md={6} className="footer-column">
              <h5 className="footer-title">Контакты</h5>
              <ul className="footer-contacts">
                <li>
                  <FaPhone className="contact-icon" />
                  <div className="contact-info">
                    <a href="tel:+375333550203">+375 (33) 355-02-03</a>
                    <span className="contact-label">Звонки и Viber</span>
                  </div>
                </li>
                <li>
                  <FaEnvelope className="contact-icon" />
                  <div className="contact-info">
                    <a href="mailto:info@timetoblow.by">info@timetoblow.by</a>
                    <span className="contact-label">Email для связи</span>
                  </div>
                </li>
                <li>
                  <FaMapMarkerAlt className="contact-icon" />
                  <div className="contact-info">
                    <span>г. Минск, ул. Примерная, 123</span>
                    <span className="contact-label">Наш адрес</span>
                  </div>
                </li>
                <li>
                  <FaClock className="contact-icon" />
                  <div className="contact-info">
                    <span>пн-пт: 09:00 - 18:00</span>
                    <span>сб: 09:00 - 13:00, вс: выходной</span>
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
              <p>&copy; {new Date().getFullYear()} TIME TO BLOW. Все права защищены.</p>
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
