import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
    request: Request, 
    { params }: { params: { colorId: string } }
) {
    try {

        if (!params.colorId) {
            return new NextResponse('Color ID is required', { status: 400 });
        };

        const color = await prismadb.color.findUnique({
            where: {
                id: params.colorId
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR-GET-ERROR]:- ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    };
};


export async function PATCH(
    request: Request,
    { params }: { params: { colorId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const { name, value } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        };

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        };

        if (!value) {
            return new NextResponse('Value is required', { status: 400 });
        };

        if (!params.colorId) {
            return new NextResponse('Color ID is required', { status: 400 });
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

        const color = await prismadb.color.updateMany({
            where: {
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR-PATCH-ERROR]:- ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    };
};


export async function DELETE(
    request: Request, 
    { params }: { params: { colorId: string, storeId: string } }
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        };

        if (!params.colorId) {
            return new NextResponse('Color ID is required', { status: 400 });
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

        const color = await prismadb.color.delete({
            where: {
                id: params.colorId
            },
        });

        return NextResponse.json(color);

    } catch (error) {
        console.log('[COLOR-DELETE-ERROR]:- ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    };
};