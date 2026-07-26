"use client";

import "./DeleteOrderItemModal.css";

interface Props {
    open: boolean;
    loading: boolean;
    productName: string;
    onClose: () => void;
    onConfirm: () => void;
}

export default function DeleteOrderItemModal({
    open,
    loading,
    productName,
    onClose,
    onConfirm,
}: Props) {

    if (!open) return null;

    return (

        <div className="delete-modal-overlay">

            <div className="delete-modal">

                <h2>

                    Remove Product

                </h2>

                <p>

                    Are you sure you want to remove

                    <strong> {productName} </strong>

                    from your shopping cart?

                </p>

                <div className="delete-modal-buttons">

                    <button
                        className="cancel-btn"
                        onClick={onClose}
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <button
                        className="delete-btn"
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {loading ? "Removing..." : "Remove"}
                    </button>

                </div>

            </div>

        </div>

    );

}