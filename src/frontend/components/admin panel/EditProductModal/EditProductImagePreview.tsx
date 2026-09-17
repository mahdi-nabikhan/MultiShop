
"use client";

import Image from "next/image";
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
            <Image
                src={previewUrl ?? preview}
                alt={alt}
                width={300}
                height={300}
            />
        </div>
    );
}

export default EditProductImagePreview;
