import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
    request: Request, 
    { params }: { params: { billboardId: string } }
) {
    try {

        if (!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
        };

        const billboard = await prismadb.billboard.findUnique({
            where: {
                id: params.billboardId
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD-GET-ERROR]:- ', error);
        return new NextResponse('Internal Error', { status: 500 });
    };
};


export async function PATCH(
    request: Request,
    { params }: { params: { billboardId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const { label, imageUrl } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        };

        if (!label) {
            return new NextResponse('Name is required', { status: 400 });
        };

        if (!imageUrl) {
            return new NextResponse('Image URL is required', { status: 400 });
        };

        if (!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
        };

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorised', { status: 403 });
        };

        const billboard = await prismadb.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARDS_PATCH]', error);
        return new NextResponse('Internal Server', { status: 500 });
    };
};


export async function DELETE(
    request: Request, 
    { params }: { params: { billboardId: string, storeId: string } }
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unathenticated', { status: 401 });
        };

        if (!params.billboardId) {
            return new NextResponse('Billboard ID is required', { status: 400 });
        };

        const storeByUserId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) {
            return new NextResponse('Unauthorised', { status: 403 });
        };

        const billboard = await prismadb.billboard.delete({
            where: {
                id: params.billboardId
            },
            
        });

        return NextResponse.json(billboard);

    } catch (error) {
        console.log('[BILLBOARD-DELETE-ERROR]:- ', error);
        return new NextResponse('Internal Error', { status: 500 });
    };
};