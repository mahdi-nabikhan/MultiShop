import Footer from "@/components/shop/Footer/Footer";
import Navbar from "@/components/shop/Navbar/Navbar";
import Topbar from "@/components/shop/Topbar/Topbar";
import SectionHeader from "@/components/shop/SectionHeader/SectionHeader";
import ShopList from "@/components/shop/ShopList/ShopList";
import RandomProducts from "@/components/shop/RandomProduct/RandomProduct";
import StoreCategoryList from "@/components/shop/StoreCategoryList/StoreCategoryList";
import StoreExplorer from "@/components/shop/StoreExplore/StoreExplore";
import ProductFilterList from "@/components/shop/ProductFiltering/ProductFiltering";

interface Props {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function Page({ searchParams }: Props) {
  const params = await searchParams;

  const page = params.page ?? "1";

  return (
    <>
    
      <Navbar />

      <Topbar />
    <div>
        <SectionHeader
          title="Category"
          description="Explore stores by category"
        />
        <StoreExplorer/>


      <div>
        <SectionHeader
          title="Shops"
          description="List Of All Shops On This Site"
        />

        <ShopList page={page} />

        <SectionHeader
          title="Products"
          description="List Of Products On This Site"
        />

        <RandomProducts />


        <SectionHeader
          title="Filter Products"
          description="Find products based on your preferences"
        />
        <ProductFilterList/>
      </div>

      <Footer />
    </div></>
  );
}