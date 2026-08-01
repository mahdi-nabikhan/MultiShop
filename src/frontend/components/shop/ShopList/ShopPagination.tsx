import Link from "next/link";

import "./ShopPagination.css";

interface Props {
    next: string | null;
    previous: string | null;
}

export default function ShopPagination({
    next,
    previous,
}: Props) {

    function getPageNumber(url: string | null) {
        if (!url) {
            return null;
        }

        const urlObject = new URL(url);

        return urlObject.searchParams.get("page");
    }

    const nextPage = getPageNumber(next);
    const previousPage = getPageNumber(previous);

    return (
        <div className="shop-pagination">

            {previousPage ? (
                <Link
                    href={`/?page=${previousPage}`}
                    className="pagination-button"
                >
                    ← Previous
                </Link>
            ) : (
                <button
                    className="pagination-button disabled"
                    disabled
                >
                    ← Previous
                </button>
            )}

            {nextPage ? (
                <Link
                    href={`/?page=${nextPage}`}
                    className="pagination-button"
                >
                    Next →
                </Link>
            ) : (
                <button
                    className="pagination-button disabled"
                    disabled
                >
                    Next →
                </button>
            )}

        </div>
    );
}