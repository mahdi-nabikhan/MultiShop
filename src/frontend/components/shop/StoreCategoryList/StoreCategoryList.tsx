"use client";

import "./StoreCategoryList.css";

interface StoreCategory {
    id: number;
    name: string;
    slug: string;
    icon: string;
}

interface Props {
    categories: StoreCategory[];
}

export default function StoreCategoryList({ categories }: Props) {

    return (

        <section className="store-category-list">

            <h2 className="category-title">

                Store Categories

            </h2>

            <div className="category-grid">

                {

                    categories.map((category) => (

                        <div
                            key={category.id}
                            className="category-card"
                        >

                            <div
                                className="category-icon"
                                dangerouslySetInnerHTML={{
                                    __html: category.icon
                                }}
                            />

                            <h3>

                                {category.name}

                            </h3>

                        </div>

                    ))

                }

            </div>

        </section>

    );

}