import Footer from '@/components/shop/Footer/Footer'
import Navbar from '@/components/shop/Navbar/Navbar'
import Topbar from '@/components/shop/Topbar/Topbar'
import SectionHeader from '@/components/shop/SectionHeader/SectionHeader'
import ShopList from '@/components/shop/ShopList/ShopList'
import RandomProducts from '@/components/shop/RandomProduct/RandomProduct'


interface Props {

  searchParams: {

    page?: string;

  };

}



export default async function Page({

  searchParams

}: Props) {


  const page = searchParams.page ?? "1";


  return (

    <div>

      <Navbar/>

      <Topbar/>


      <div>


        <SectionHeader

          title="Shops"

          description="List Of All Shops On This Site"

        />


        <ShopList

          page={page}

        />



        <SectionHeader

          title="Products"

          description="List Of Products on this On This Site"

        />


        <RandomProducts/>


      </div>


      <Footer/>


    </div>

  );

}