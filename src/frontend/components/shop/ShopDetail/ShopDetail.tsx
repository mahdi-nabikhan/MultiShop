import Image from "next/image";
import {
    Star,
    MapPin,
    Phone,
    Store,
    BadgeCheck,
    Package
} from "lucide-react";

import "./ShopDetail.css";

interface ShopProps {

    shopId: string;

}

export default function ShopDetail({
    shopId,
}: ShopProps) {

    // بعداً اطلاعات از API میاد
    const shop = {

        id: shopId,

        name: "Tech World",

        description:
            "Professional electronics store with thousands of products.",

        address: "Tehran",

        phone: "09121234567",

        rating: 4.9,

        totalProducts: 125,

        logo: "/images/store-logo.jpg",

        cover: "/images/store-cover.jpg",

    };

    return (

        <section className="shop-detail">

            <div className="cover">

                <Image
                    src={shop.cover}
                    alt="cover"
                    fill
                    className="cover-image"
                />

            </div>


            <div className="shop-card container">

                <div className="shop-logo">

                    <Image
                        src={shop.logo}
                        alt={shop.name}
                        width={140}
                        height={140}
                    />

                </div>


                <div className="shop-info">

                    <h1>{shop.name}</h1>

                    <div className="rating">

                        <Star
                            size={18}
                            fill="#FFD700"
                            stroke="#FFD700"
                        />

                        <span>{shop.rating}</span>

                    </div>


                    <p>

                        {shop.description}

                    </p>


                    <div className="shop-meta">

                        <div>

                            <Store size={18} />

                            Multi Vendor Shop

                        </div>


                        <div>

                            <BadgeCheck size={18} />

                            Verified Seller

                        </div>


                        <div>

                            <MapPin size={18} />

                            {shop.address}

                        </div>


                        <div>

                            <Phone size={18} />

                            {shop.phone}

                        </div>


                        <div>

                            <Package size={18} />

                            {shop.totalProducts} Products

                        </div>

                    </div>


                    <div className="buttons">

                        <button className="follow">

                            Follow Store

                        </button>


                        <button className="contact">

                            Contact

                        </button>

                    </div>

                </div>

            </div>

        </section>

    );

}