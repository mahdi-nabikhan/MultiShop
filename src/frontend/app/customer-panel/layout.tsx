import Navbar from "@/components/customer-panel/Navbar/Navbar";
import Sidebar from "@/components/customer-panel/Sidebar/Sidebar";

import "./layout.css";


export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>

      <Navbar />


      <Sidebar />


      <main className="customer-content">

        {children}

      </main>


    </>
  );
}