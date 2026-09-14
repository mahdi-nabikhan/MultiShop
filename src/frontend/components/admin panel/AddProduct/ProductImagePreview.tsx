"use client";

import { useEffect, useState } from "react";

interface ProductImagePreviewProps {
    image: File;
}

function ProductImagePreview({
    image,
}: ProductImagePreviewProps) {
    const [previewUrl, setPreviewUrl] =
        useState("");

    useEffect(() => {
        const url =
            URL.createObjectURL(image);

        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [image]);

    if (!previewUrl) {
        return null;
    }

    return (
        <div className="preview">
            <img
                src={previewUrl}
                alt="Product preview"
            />
        </div>
    );
}

export default ProductImagePreview;