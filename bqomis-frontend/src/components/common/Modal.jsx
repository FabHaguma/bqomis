import React from 'react';
import './Modal.scss'; // Create this SCSS file

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <header className="modal-header">
          {title && <h2 className="modal-title">{title}</h2>}
          <button onClick={onClose} className="modal-close-button">×</button>
        </header>
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;