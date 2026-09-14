function ProductListHeader() {
    return (
        <div className="product-header">
            <div>
                <h1>Products</h1>

                <p>
                    Manage all products in your store
                </p>
            </div>

            <button
                type="button"
                className="add-product-btn"
            >
                + Add Product
            </button>
        </div>
    );
}

export default ProductListHeader;