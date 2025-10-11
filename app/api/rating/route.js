import prisma from "@/lib/prisma";
import { getAuth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Create a new rating and update product average rating
export async function POST(request) {
    try {
        const { userId } = getAuth(request);
        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const { orderId, productId, rating, review } = await request.json();

        if (!orderId || !productId || !rating) {
            return NextResponse.json({ error: "Missing required rating data" }, { status: 400 });
        }       

        // Check if the order exists and belongs to the user
        const order = await prisma.order.findUnique({ where: { id: orderId, userId } });
        if (!order) {
            return NextResponse.json({ error: "Order not found or does not belong to user" }, { status: 404 });
        }

        // Check if the user has already rated this product for this order
        const isAlreadyRated = await prisma.rating.findFirst({
            where: { userId, productId, orderId }
        });
        if (isAlreadyRated) {
            return NextResponse.json({ error: "Product already rated for this order" }, { status: 400 });
        }

        // 1. Create the rating
        const newRating = await prisma.rating.create({
            data: {
                userId,
                productId,
                orderId,
                rating: parseInt(rating),
                review
            }
        });

        // 2. Calculate and update the product's new average rating (for Seller Dashboard/Product Page)
        
        // Fetch all ratings for the product
        const allProductRatings = await prisma.rating.findMany({
            where: { productId }
        });

        // Calculate the sum of all ratings
        const totalRatingSum = allProductRatings.reduce((sum, r) => sum + r.rating, 0);
        const totalRatingsCount = allProductRatings.length;
        
        // Calculate the new average
        const newAverageRating = totalRatingsCount > 0 
            ? parseFloat((totalRatingSum / totalRatingsCount).toFixed(2)) 
            : 0; 
        
        // Update the product with the new average rating
        // !!! IMPORTANT !!! This line is causing the error because your Prisma schema is missing 
        // 'averageRating' and 'totalRatings' fields on the 'Product' model. 
        // Please update your schema and run `prisma migrate dev` or `prisma db push`.
        await prisma.product.update({
            where: { id: productId },
            data: { 
                averageRating: newAverageRating,
                totalRatings: totalRatingsCount // Optional: useful for displaying rating count
            }
        });

        return NextResponse.json({ 
            message: "Rating submitted successfully and product score updated.", 
            rating: newRating 
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}

// Get all ratings from the user (Existing logic remains)
export async function GET(request) {
    try {
        const { userId } = getAuth(request);

        if (!userId) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const ratings = await prisma.rating.findMany({
            where: { userId },
            include: {
                product: true,
                order: true
            },
             orderBy: { createdAt: 'desc'}
        });

        return NextResponse.json({ ratings });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error.code || error.message }, { status: 400 });
    }
}
        