import { NextResponse } from "next/server";

import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

export async function GET(
    request: Request,
    { params }: { params: { productId: string } }
) {
    try {

        if (!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 });
        };

        const product = await prismadb.product.findUnique({
            where: {
                id: params.productId
            },
            include: {
                images: true,
                category: true,
                size: true,
                color: true
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT-GET-ERROR]:- ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    };
};


export async function PATCH(
    request: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {
        const { userId } = auth();

        const body = await request.json();

        const {
            name, price, categoryId, sizeId,
            colorId, images, isFeatured, isArchived
        } = body;

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        };

        if (!userId) {
            return new NextResponse('Unauthenticated', { status: 401 });
        };

        if (!name) {
            return new NextResponse('Name is required', { status: 400 });
        };

        if (!images || !images.length) {
            return new NextResponse('Image URL is required', { status: 400 });
        };

        if (!price) {
            return new NextResponse('Price is required', { status: 400 });
        };

        if (!categoryId) {
            return new NextResponse('Category is required', { status: 400 });
        };

        if (!sizeId) {
            return new NextResponse('Size is required', { status: 400 });
        };

        if (!colorId) {
            return new NextResponse('Color is required', { status: 400 });
        };

        if (!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 });
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

        await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                name,
                price,
                sizeId,
                colorId,
                categoryId,
                images: {
                    deleteMany: {}
                },
                isFeatured,
                isArchived
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId,
            },
            data: {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT-PATCH-ERROR]', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    };
};


export async function DELETE(
    request: Request,
    { params }: { params: { productId: string, storeId: string } }
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse('Unathenticated', { status: 401 });
        };

        if (!params.productId) {
            return new NextResponse('Product ID is required', { status: 400 });
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

        const product = await prismadb.product.deleteMany({
            where: {
                id: params.productId
            },

        });

        return NextResponse.json(product);

    } catch (error) {
        console.log('[PRODUCT-DELETE-ERROR]:- ', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    };
};