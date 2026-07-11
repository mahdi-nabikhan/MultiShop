import Image from "next/image";
import BACKEND_URLS from "@/utils";
import {
    Star,
    MapPin,
    Phone,
    Store,
    BadgeCheck,
    Package
} from "lucide-react";

import "./ShopDetail.css";
import axios from "axios";
import { number } from "framer-motion";

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



    const {data:shop} = await axios.get<IGetStoreData>(
        `${BACKEND_URLS}website/api/v1/store/detail/${shopId}`
      );

    return (
        <section className="store-page">

    <div className="container">

        <div className="store-wrapper">

            <div className="store-logo">

                <Image
                    src={shop.image ?? "/images/default-store.jpg"}
                    alt={shop.name}
                    width={170}
                    height={170}
                />

            </div>

            <div className="store-content">

                <div className="store-header">

                    <div>

                        <span className="store-badge">
                            <BadgeCheck size={16}/>
                            Verified Store
                        </span>

                        <h1>{shop.name}</h1>

                        <p>
                            {shop.description}
                        </p>

                    </div>

                    <div className="store-buttons">

                        <button className="btn-primary">
                            Follow Store
                        </button>

                        <button className="btn-secondary">
                            View Products
                        </button>

                    </div>

                </div>

                <div className="store-info">

                    <div className="info-card">

                        <MapPin size={22}/>

                        <div>

                            <span>Location</span>

                            <strong>

                                {shop.address.state},
                                {" "}
                                {shop.address.street}

                            </strong>

                        </div>

                    </div>

                    <div className="info-card">

                        <Package size={22}/>

                        <div>

                            <span>Products</span>

                            <strong>124</strong>

                        </div>

                    </div>

                    <div className="info-card">

                        <Star size={22}/>

                        <div>

                            <span>Rating</span>

                            <strong>4.9 / 5</strong>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>



    );

}