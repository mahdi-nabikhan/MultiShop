import AdminDetail from "@/components/admin panel/AdminDetail/AdminDetail";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: Props) {

    const { id } = await params;

    return (
        <AdminDetail
            adminId={Number(id)}
        />
    );
}