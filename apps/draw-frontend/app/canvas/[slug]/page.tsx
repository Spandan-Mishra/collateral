import Canvas from "@/components/Canvas";

const CanvasPage = async ({ params } : {
    params: {
        slug: string
    }
}) => {
    const slug = (await params).slug;

    return <Canvas slug={slug} />
}

export default CanvasPage;