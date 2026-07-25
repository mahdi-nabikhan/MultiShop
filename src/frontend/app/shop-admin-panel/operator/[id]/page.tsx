import OperatorDetail from "@/components/admin panel/OperatorDetail/OperatorDetail";

interface Props {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: Props) {

    const { id } = await params;

    return (
        <OperatorDetail
            operatorId={Number(id)}
        />
    );
}