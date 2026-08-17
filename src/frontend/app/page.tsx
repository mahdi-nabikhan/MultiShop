export default async function Page({ searchParams }: Props) {

  const params = await searchParams;

  const page = params.page ?? "1";

  return (
    <>

      <Navbar />

      <Topbar />


      <main>

        <div className="container">


          <SectionHeader
            title="Category"
            description="Explore stores by category"
          />

          <StoreExplorer />



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

          <ProductFilterList />


        </div>

      </main>


      <Footer />

    </>
  );
}