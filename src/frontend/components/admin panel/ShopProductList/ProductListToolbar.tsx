function ProductListToolbar() {
    return (
        <div className="toolbar">
            <input
                type="text"
                placeholder="Search product..."
            />

            <select>
                <option>
                    All Categories
                </option>
            </select>

            <select>
                <option>
                    All Stock
                </option>
            </select>
        </div>
    );
}

export default ProductListToolbar;