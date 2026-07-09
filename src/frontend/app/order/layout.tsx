import Navbar from "@/components/shop/Navbar/Navbar";
import Footer from "@/components/shop/Footer/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main>{children}</main>
      <Footer/>
    </>
  );
}