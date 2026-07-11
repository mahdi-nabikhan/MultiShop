import Navbar from "@/components/shop/Navbar/Navbar";
import Footer from "@/components/shop/Footer/Footer";
import './custom.css'


export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>

      <Navbar />


   


      <main className="customer-content">

        {children}

      </main>
      <Footer/>


    </>
  );
}