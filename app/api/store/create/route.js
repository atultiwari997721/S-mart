import imagekit from "@/configs/imageKit";
import { getAuth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

// create the Store
export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    // get the user id from clerk
    const formData = await request.formData();

    const name = formData.get("name");
    const username = formData.get("username");
    const description = formData.get("description");
    const email = formData.get("email");
    const contact = formData.get("contact");
    const address = formData.get("address");
    const image = formData.get("image");

    if (
      !name ||
      !username ||
      !description ||
      !email ||
      !contact ||
      !address ||
      !image
    ) {
      return NextResponse.json(
        { error: "missing Store information" },
        { status: 400 }
      );
    }

    // chaeck is user have alradey store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // if store is already created or registered
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    // check is user name taken alredy
    const isUsernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });
    if (isUsernameTaken) {
      return NextResponse.json(
        { error: "username is already taken" },
        { status: 400 }
      );
    }
    // image uplode to imagekit
    const buffer = Buffer.from(await image.arrayBuffer());
    const response = await imagekit.upload({
      file: buffer, //required
      fileName: image.name, //required
      folder: "logos",
    });

    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [
        { quality: "auto" },
        { format: "webp" },
        { width: "512" },
      ],
    });

    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    //link store  to user
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "Applied, Waiting for Approval " });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}

// check is user have alradey store if yes then send the status
export async function GET(request) {
  try {
    const { userId } = getAuth(request);
    // chaeck is user have alradey store
    const store = await prisma.store.findFirst({
      where: { userId: userId },
    });

    // if store is already created or registered
    if (store) {
      return NextResponse.json({ status: store.status });
    }

    return NextResponse.json({ status: "not-registered" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}
