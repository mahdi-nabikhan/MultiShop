import './DiscountList.css'
import BACKEND_URLS from '@/utils';
import axios from 'axios';
interface DiscountData {
    products:number;
    value : number;
    discount_type: "cash" | "percent";

}


async function DiscountList({productId}:{productId:number}) {
    const {data:discounts} =await axios.get<DiscountData[]>(
            `${BACKEND_URLS}vendor/api/v1/add/product/discount/${productId}/`,{
                withCredentials:true
            }
        )
        
  return (
    <div className="discount-list">

    {discounts.map((discount, index) => (

        <div
            className="discount-card"
            key={index}
        >

            <div className="discount-top">

                <span
                    className={
                        discount.discount_type === "cash"
                            ? "discount-type cash"
                            : "discount-type percent"
                    }
                >
                    {discount.discount_type}
                </span>

                <span className="discount-value">

                    {discount.value}

                    {
                        discount.discount_type === "percent"
                            ? "%"
                            : " $"
                    }

                </span>

            </div>

            <div className="discount-footer">

                <span>
                    Product ID: {discount.products}
                </span>

                <div className="discount-actions">

                    <button className="edit-discount">
                        Edit
                    </button>

                    <button className="delete-discount">
                        Delete
                    </button>

                </div>

            </div>

        </div>

    ))}

</div>
  )
}

export default DiscountList