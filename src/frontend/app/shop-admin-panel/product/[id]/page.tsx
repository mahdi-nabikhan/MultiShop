import ShopProductDetail from "@/components/admin panel/ShopProductDetail/ShopProductDetail";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page({ params }: Props) {
  const { id } = await params;

  return (
    <ShopProductDetail productId={Number(id)} />
  );
}