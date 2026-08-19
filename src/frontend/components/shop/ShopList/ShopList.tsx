import Link from "next/link";
import { cookies } from "next/headers";

import { getStores } from "@/services/shop.services";
import ShopPagination from "./ShopPagination";
import BACKEND_URLS from "@/utils";

import "./ShopList.css";

interface Props {
    page: string;
}

async function ShopList({ page }: Props) {

    const cookieStore = await cookies();

    const token = cookieStore.get("access")?.value;

    const headers: Record<string, string> = {};

    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const data = await getStores(page, headers);

    return (
        <section className="shop-list container">

            {
                data.results.map((item) => (

                    <Link
                        href={`/shop/${item.pk}`}
                        className="shop-card"
                        key={item.pk}
                    >

                        <div className="shop-image">

                            <img
                                src={
                                    item.image
                                        ? `${BACKEND_URLS.replace(/\/$/, "")}${item.image}`
                                        : "/images/banner-1.jpg"
                                }
                                alt={item.name}
                            />

                        </div>

                        <div className="shop-content">

                            <h3>
                                {item.name}
                            </h3>

                            <p>
                                {item.description}
                            </p>

                        </div>

                    </Link>

                ))
            }

            <ShopPagination
                next={data.links.next}
                previous={data.links.previous}
            />

        </section>
    );
}

export default ShopList;