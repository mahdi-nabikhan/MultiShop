import Navbar from "@/components/admin panel/Navbar/Navbar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  return (
    <>
      <Navbar />

      <main>
        {children}
      </main>
    </>
  );
}