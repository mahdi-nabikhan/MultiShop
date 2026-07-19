"use client";

import "./DeleteModal.css";

interface Props {
  open: boolean;
  loading: boolean;
  title: string;
  message: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteModal({
  open,
  loading,
  title,
  message,
  onClose,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="delete-modal-overlay"
      onClick={onClose}
    >
      <div
        className="delete-modal"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="delete-modal-icon">
          🗑️
        </div>

        <h2>{title}</h2>

        <p>{message}</p>

        <div className="delete-modal-actions">

          <button
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </button>

          <button
            className="delete-button"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

        </div>

      </div>
    </div>
  );
}