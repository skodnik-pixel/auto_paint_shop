// Модальное окно «нужна авторизация» в стиле GTA (MISSION FAILED) — как в Login
import React from 'react';
import { Modal, Button } from 'react-bootstrap';

function AuthRequiredModal({ show, onHide, message = 'Для добавления товаров в корзину необходимо войти в систему', onRegister }) {
  return (
    <Modal show={show} onHide={onHide} centered className="gta-mission-failed-modal">
      <Modal.Header closeButton className="gta-mission-failed-modal-header">
        <Modal.Title className="gta-mission-failed-modal-title">MISSION FAILED</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="mb-0">{message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" className="gta-mission-failed-btn-close" onClick={onHide}>
          Закрыть
        </Button>
        {onRegister && (
          <Button variant="primary" className="gta-mission-failed-btn-register" onClick={onRegister}>
            Зарегистрироваться
          </Button>
        )}
      </Modal.Footer>
    </Modal>
  );
}

export default AuthRequiredModal;
