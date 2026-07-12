import axios from "axios";
import BACKEND_URLS from "@/utils";
import Image from "next/image";
import Link from "next/link";
import './ShopList.css'
import { cookies } from "next/headers";
interface IGetStoreData {
  pk: number,
  name: string;
  description: string;
  image: string;
}

async function ShopList() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access")?.value;

  const headers: Record<string, string> = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const { data } = await axios.get<IGetStoreData[]>(
    `${BACKEND_URLS}website/api/v1/store/list`,
    {
      headers,
    }
  );

  return (
    <section className="shop-list container">

      {data.map((item) => (

        <Link
          href={`/shop/${item.pk}`}
          className="shop-card"
          key={item.pk}
        >

          <div className="shop-image">

            <Image
              src={
                item.image
                  ? item.image
                  : "/images/banner-1.jpg"
              }
              alt={item.name}
              fill
            />

          </div>

          <div className="shop-content">

            <h3>{item.name}</h3>

            <p>
              {item.description}
            </p>

          </div>

        </Link>

      ))}
    </section>
  );
}

export default ShopList;