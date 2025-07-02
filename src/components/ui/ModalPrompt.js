import React from 'react';
import Button from './Button';
import Loading from './Loading';
import './ModalPrompt.css';

const ModalPrompt = ({
  open,
  onConfirm,
  onCancel,
  message,
  confirmText = 'Yes',
  cancelText = 'No',
  loading = false,
  successMsg = '',
}) => {
  if (!open) return null;
  return (
    <div className="modal-prompt-backdrop">
      <div className="modal-prompt-card">
        <div className="modal-prompt-message">{successMsg || message}</div>
        {!successMsg && (
          <div className="modal-prompt-actions">
            <Button onClick={onConfirm} disabled={loading} className="modal-prompt-btn">
              {loading ? (<><Loading small /> {confirmText}...</>) : confirmText}
            </Button>
            <Button onClick={onCancel} disabled={loading} className="modal-prompt-btn modal-prompt-cancel">
              {cancelText}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalPrompt; 