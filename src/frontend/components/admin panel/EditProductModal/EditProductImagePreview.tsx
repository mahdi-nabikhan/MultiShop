"use client";

import { useEffect, useState } from "react";

interface EditProductImagePreviewProps {
    image: File | null;
    preview: string;
    alt: string;
}

function EditProductImagePreview({
    image,
    preview,
    alt,
}: EditProductImagePreviewProps) {
    const [previewUrl, setPreviewUrl] =
        useState<string | null>(null);

    useEffect(() => {
        if (!image) {
            setPreviewUrl(null);
            return;
        }

        const url =
            URL.createObjectURL(image);

        setPreviewUrl(url);

        return () => {
            URL.revokeObjectURL(url);
        };
    }, [image]);

    return (
        <div className="image-preview">
            <img
                src={previewUrl ?? preview}
                alt={alt}
            />
        </div>
    );
}

export default EditProductImagePreview;