import CanvasRoom from "@/components/CanvasRoom";

const CanvasPage = async ({ params } : {
    params: {
        slug: string
    }
}) => {
    const slug = (await params).slug;

    return <CanvasRoom slug={slug} />
}

export default CanvasPage;