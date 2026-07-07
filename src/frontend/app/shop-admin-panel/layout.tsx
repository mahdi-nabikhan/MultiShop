import Navbar from "@/components/admin panel/Navbar/Navbar";
import Sidebar from "@/components/admin panel/Sidebar/Sidebar";
import './layout.css'
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Navbar />
    <Sidebar/>
      <main className="admin-content">
        {children}
      </main>
    </>
  );
}