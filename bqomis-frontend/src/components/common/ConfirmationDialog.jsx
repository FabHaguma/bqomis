import React from 'react';
import Modal from './Modal'; // Reusing the Modal
import './ConfirmationDialog.scss'; // Create this SCSS file

const ConfirmationDialog = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmButtonText = 'Confirm',
  cancelButtonText = 'Cancel',
  confirmButtonVariant = 'primary', // 'primary', 'danger', etc. for styling
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onCancel} title={title}>
      <div className="confirmation-dialog">
        <p className="confirmation-message">{message}</p>
        <div className="confirmation-actions">
          <button 
            onClick={onCancel} 
            className="btn btn-secondary" // General secondary button style
          >
            {cancelButtonText}
          </button>
          <button 
            onClick={onConfirm} 
            className={`btn btn-${confirmButtonVariant}`} // e.g., btn-primary or btn-danger
          >
            {confirmButtonText}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationDialog;