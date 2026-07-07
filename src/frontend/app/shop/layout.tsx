import Navbar from "@/components/shop/Navbar/Navbar";


export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />

      <main>{children}</main>
    </>
  );
}