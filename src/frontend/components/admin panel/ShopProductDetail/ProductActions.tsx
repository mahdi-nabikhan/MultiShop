interface ProductActionsProps {
    onEdit: () => void;
    onAddDiscount: () => void;
    onDelete: () => void;
    onAddImage: () => void;
}

function ProductActions({
    onEdit,
    onAddDiscount,
    onDelete,
    onAddImage,
}: ProductActionsProps) {
    return (
        <div className="action-buttons">
            <button
                type="button"
                className="edit-btn"
                onClick={onEdit}
            >
                Edit Product
            </button>

            <button
                type="button"
                className="primary-btn"
                onClick={onAddDiscount}
            >
                Add Discount
            </button>

            <button
                type="button"
                className="delete-btn"
                onClick={onDelete}
            >
                Delete Product
            </button>

            <button
                type="button"
                className="primary-btn"
                onClick={onAddImage}
            >
                Add Product Image
            </button>
        </div>
    );
}

export default ProductActions;