import patchRequest from "./patch";

export async function PATCH(request: Request, { params }: { params: { slug: string } }) {
    return await patchRequest(request, params.slug);
}