"use client";

import useStoreCategories from "@/hooks/shop/StoreCategoryList";
import "./StoreCategoryList.css";


interface Props {
    onSelectCategory: (id: number) => void;
}


export default function StoreCategoryList({
    onSelectCategory,
}: Props) {


    const {
     data: categories = [],isLoading,isError,} = useStoreCategories()


    // ==========================================
    // Loading
    // ==========================================

    if (isLoading) {

        return (

            <div>

                Loading Categories...

            </div>

        );

    }


    // ==========================================
    // Error
    // ==========================================

    if (isError) {

        return (

            <div>

                Error loading categories.

            </div>

        );

    }


    // ==========================================
    // UI
    // ==========================================

    return (

        <section className="store-category-list">


            <h2>

                Store Categories

            </h2>


            <div className="category-grid">


                {categories.map((category) => (

                    <div

                        key={category.id}

                        className="category-card"

                        onClick={() =>
                            onSelectCategory(
                                category.id
                            )
                        }

                    >

                        <div

                            className="category-icon"

                            dangerouslySetInnerHTML={{
                                __html: category.icon,
                            }}

                        />


                        <h3>

                            {category.name}

                        </h3>


                    </div>

                ))}


            </div>


        </section>

    );

}