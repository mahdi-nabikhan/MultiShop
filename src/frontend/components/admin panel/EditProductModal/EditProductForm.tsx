"use client";

import EditProductImagePreview from "./EditProductImagePreview";

interface EditProductFormProps {
    name: string;
    description: string;
    price: string;
    priceAfter: string;
    stock: string;
    category: string;
    image: File | null;
    preview: string;
    isPending: boolean;

    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onPriceChange: (value: string) => void;
    onPriceAfterChange: (value: string) => void;
    onStockChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onImageChange: (file: File | null) => void;

    onSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void;

    onCancel: () => void;
}

function EditProductForm({
    name,
    description,
    price,
    priceAfter,
    stock,
    category,
    image,
    preview,
    isPending,
    onNameChange,
    onDescriptionChange,
    onPriceChange,
    onPriceAfterChange,
    onStockChange,
    onCategoryChange,
    onImageChange,
    onSubmit,
    onCancel,
}: EditProductFormProps) {
    return (
        <form
            className="edit-form"
            onSubmit={onSubmit}
        >
            {/* Image Preview */}

            <EditProductImagePreview
                image={image}
                preview={preview}
                alt={name || "Product preview"}
            />

            {/* Image */}

            <div className="form-group">
                <label>
                    Product Image
                </label>

                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        const file =
                            e.target.files?.[0] ??
                            null;

                        onImageChange(file);
                    }}
                />
            </div>

            {/* Name */}

            <div className="form-group">
                <label>
                    Product Name
                </label>

                <input
                    type="text"
                    value={name}
                    onChange={(e) =>
                        onNameChange(
                            e.target.value
                        )
                    }
                />
            </div>

            {/* Description */}

            <div className="form-group">
                <label>
                    Description
                </label>

                <textarea
                    rows={5}
                    value={description}
                    onChange={(e) =>
                        onDescriptionChange(
                            e.target.value
                        )
                    }
                />
            </div>

            {/* Price */}

            <div className="grid-2">
                <div className="form-group">
                    <label>
                        Price
                    </label>

                    <input
                        type="number"
                        value={price}
                        onChange={(e) =>
                            onPriceChange(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group">
                    <label>
                        Sale Price
                    </label>

                    <input
                        type="number"
                        value={priceAfter}
                        onChange={(e) =>
                            onPriceAfterChange(
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            {/* Stock / Category */}

            <div className="grid-2">
                <div className="form-group">
                    <label>
                        Stock
                    </label>

                    <input
                        type="number"
                        value={stock}
                        onChange={(e) =>
                            onStockChange(
                                e.target.value
                            )
                        }
                    />
                </div>

                <div className="form-group">
                    <label>
                        Category
                    </label>

                    <input
                        type="number"
                        value={category}
                        onChange={(e) =>
                            onCategoryChange(
                                e.target.value
                            )
                        }
                    />
                </div>
            </div>

            {/* Actions */}

            <div className="modal-actions">
                <button
                    type="button"
                    className="cancel-btn"
                    onClick={onCancel}
                    disabled={isPending}
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    className="save-btn"
                    disabled={isPending}
                >
                    {isPending
                        ? "Saving..."
                        : "Save Changes"}
                </button>
            </div>
        </form>
    );
}

export default EditProductForm;