
import Image from "next/image";

import {
    Star,
    MapPin,
    BadgeCheck,
    Package,
} from "lucide-react";

import "./ShopDetail.css";

import { getStoreDetail } from "@/services/shop.services";


interface ShopProps {
    shopId: string;
}


interface IStoreAddress {
    state: string;
    street: string;
}


export interface IGetStoreData {
    pk: number;
    image: string | null;
    description: string;
    name: string;
    address: IStoreAddress;
}


export default async function ShopDetail({
    shopId,
}: ShopProps) {


    let shop: IGetStoreData;

    try {

        shop = await getStoreDetail(shopId);

    } catch (error) {

        console.error(
            "Failed to load store:",
            error
        );

        return (

            <section className="store-page">

                <div className="store-error">

                    <h2>
                        Failed to load store.
                    </h2>

                    <p>
                        Please try again later.
                    </p>

                </div>

            </section>

        );

    }


    if (!shop) {

        return (

            <section className="store-page">

                <div className="store-error">

                    <h2>
                        Store not found.
                    </h2>

                </div>

            </section>

        );

    }


    const imageUrl = shop.image
        ? shop.image.startsWith("http")
            ? shop.image
            : `http://localhost:8000${shop.image}`
        : null;


    return (

        <section className="store-page">


            {/* ==========================================
                Store Header
            ========================================== */}

            <div className="store-header">


                {/* Store Image */}

                <div className="store-image">

                    {imageUrl ? (

                        <Image
                            src={imageUrl}
                            alt={shop.name}
                            width={140}
                            height={140}
                        />

                    ) : (

                        <div className="store-image-placeholder">

                            <Package size={48} />

                        </div>

                    )}

                </div>


                {/* Store Info */}

                <div className="store-info">


                    <div className="store-title">


                        <h1>
                            {shop.name}
                        </h1>


                        <BadgeCheck
                            size={24}
                        />

                    </div>


                    <p className="store-description">

                        {shop.description}

                    </p>


                    {/* Address */}

                    <div className="store-address">

                        <MapPin size={18} />

                        <span>

                            {shop.address?.state}

                            {" / "}

                            {shop.address?.street}

                        </span>

                    </div>


                    {/* Rating */}

                    <div className="store-rating">

                        <Star
                            size={18}
                            fill="#FFD700"
                            stroke="#FFD700"
                        />

                        <span>
                            0.0
                        </span>

                        <span>
                            Store Rating
                        </span>

                    </div>


                </div>


            </div>


            {/* ==========================================
                Store Stats
            ========================================== */}

            <div className="store-stats">


                <div className="store-stat">

                    <Package size={22} />

                    <div>

                        <strong>
                            Products
                        </strong>

                        <span>
                            Store Products
                        </span>

                    </div>

                </div>


                <div className="store-stat">

                    <BadgeCheck size={22} />

                    <div>

                        <strong>
                            Verified Store
                        </strong>

                        <span>
                            Trusted Seller
                        </span>

                    </div>

                </div>


                <div className="store-stat">

                    <MapPin size={22} />

                    <div>

                        <strong>
                            Location
                        </strong>

                        <span>
                            {shop.address?.state}
                        </span>

                    </div>

                </div>


            </div>


            {/* ==========================================
                Store Description
            ========================================== */}

            <div className="store-description-section">


                <h2>
                    About {shop.name}
                </h2>


                <p>
                    {shop.description}
                </p>


            </div>


        </section>

    );

}
