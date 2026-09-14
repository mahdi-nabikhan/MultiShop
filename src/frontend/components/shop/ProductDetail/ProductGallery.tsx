"use client";

interface ProductGalleryProps {
    images: string[];
    activeImage: string | null;
    productName: string;
    onImageSelect: (image: string) => void;
}

export default function ProductGallery({
    images,
    activeImage,
    productName,
    onImageSelect,
}: ProductGalleryProps) {
    return (
        <div className="gallery">
            <div className="thumbnail-list">
                {images.map((image, index) => (
                    <button
                        key={`${image}-${index}`}
                        type="button"
                        className={`thumbnail ${
                            activeImage === image
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            onImageSelect(image)
                        }
                    >
                        <img
                            src={image}
                            alt={`${productName} ${index + 1}`}
                        />
                    </button>
                ))}
            </div>

            <div className="main-image">
                {activeImage && (
                    <img
                        src={activeImage}
                        alt={productName}
                    />
                )}
            </div>
        </div>
    );
}