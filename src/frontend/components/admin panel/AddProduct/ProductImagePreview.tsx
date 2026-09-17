
"use client";

import Image from "next/image";
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
            <Image
                src={previewUrl}
                alt="Product preview"
                width={300}
                height={300}
                loading="lazy"
            />
        </div>
    );
}

export default ProductImagePreview;
