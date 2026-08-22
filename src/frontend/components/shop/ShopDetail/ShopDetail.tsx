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

    const shop =
        await getStoreDetail(shopId);


    return (
        <section className="store-page">

            {/* بقیه JSX خودت بدون تغییر */}
            
        </section>
    );
}