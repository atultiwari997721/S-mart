import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import authAdmin from "@/middlewares/authAdmin";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const isAdmin = await authAdmin(userId);
    if (!isAdmin) {
      return NextResponse.json({ error: "unauthorized" }, { status: 401 });
    }

    const formData = await request.formData();
    const semester = formData.get('semester');
    const branch = formData.get('branch');
    const category = formData.get('category');
    const fileUrl = formData.get('fileUrl');
    const title = formData.get('title');

    if (!semester || !branch || !category || !fileUrl || !title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const resource = await prisma.studentResource.create({
      data: {
        semester,
        branch,
        category, 
        fileUrl,
        title,
        uploadedById: userId
      }
    });

    return NextResponse.json({ message: "Resource added successfully", resource });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}