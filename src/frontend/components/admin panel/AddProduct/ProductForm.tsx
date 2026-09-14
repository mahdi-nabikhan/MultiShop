"use client";

import ProductImagePreview from "./ProductImagePreview";

interface ProductFormProps {
    name: string;
    description: string;
    price: string;
    priceAfter: string;
    stock: string;
    category: string;
    image: File | null;
    isPending: boolean;

    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onPriceChange: (value: string) => void;
    onPriceAfterChange: (value: string) => void;
    onStockChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onImageChange: (
        file: File | null
    ) => void;

    onSubmit: (
        e: React.FormEvent<HTMLFormElement>
    ) => void;
}

function ProductForm({
    name,
    description,
    price,
    priceAfter,
    stock,
    category,
    image,
    isPending,
    onNameChange,
    onDescriptionChange,
    onPriceChange,
    onPriceAfterChange,
    onStockChange,
    onCategoryChange,
    onImageChange,
    onSubmit,
}: ProductFormProps) {
    return (
        <form
            className="create-form"
            onSubmit={onSubmit}
        >
            <div className="form-group">
                <label>Product Name</label>

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

            <div className="form-group">
                <label>Description</label>

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

            <div className="grid-2">
                <div className="form-group">
                    <label>Price</label>

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
                    <label>Sale Price</label>

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

            <div className="grid-2">
                <div className="form-group">
                    <label>Stock</label>

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
                    <label>Category</label>

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

            <div className="form-group">
                <label>Product Image</label>

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

            {image && (
                <ProductImagePreview
                    image={image}
                />
            )}

            <button
                type="submit"
                className="create-btn"
                disabled={isPending}
            >
                {isPending
                    ? "Creating..."
                    : "Create Product"}
            </button>
        </form>
    );
}

export default ProductForm;