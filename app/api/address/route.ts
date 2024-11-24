// app/api/address/route.ts

import { NextRequest, NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import prisma from "@/utils/connect";

// API for creating a new address
export async function POST(req: NextRequest) {
  try {
    // Extract necessary fields from the request
    const { il, adres, regionId, neighborhoodId } = await req.json();

    // Validate the received data
    if (!il || !adres || !regionId || !neighborhoodId) {
      return NextResponse.json(
        { message: "Tüm alanları doldurduğunuzdan emin olunuz." },
        { status: 400 }
      );
    }

    // Check authentication
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated!" },
        { status: 401 }
      );
    }

    // Check if the user exists in the database
    let user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    // If the user doesn't exist, create them
    if (!user) {
      const clerkUser = await clerkClient.users.getUser(userId);
      user = await prisma.user.create({
        data: {
          id: userId,
          name: clerkUser.fullName || "Unknown Name",
          email: clerkUser.emailAddresses[0]?.emailAddress || "Unknown Email",
          phoneNumber:
            clerkUser.phoneNumbers[0]?.phoneNumber || "Unknown Phone",
        },
      });
    }

    // Validate region ID
    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      return NextResponse.json(
        { message: "Invalid region ID" },
        { status: 400 }
      );
    }

    // Validate neighborhood ID
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
    });

    if (!neighborhood) {
      return NextResponse.json(
        { message: "Invalid neighborhood ID" },
        { status: 400 }
      );
    }

    // Create the new address
    const newAddress = await prisma.address.create({
      data: {
        il,
        adres,
        regionId,
        neighborhoodId,
        userId, // Link the address to the user
      },
    });

    return NextResponse.json(newAddress, { status: 201 });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { message: "Error creating address" },
      { status: 500 }
    );
  }
}

// API to fetch all addresses for the authenticated user
// API to fetch the first address for the authenticated user
export async function GET() {
  try {
    const { userId } = auth(); // Get the user ID from Clerk

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated!" },
        { status: 401 }
      );
    }

    // Fetch the user's first address
    const address = await prisma.address.findFirst({
      where: {
        userId,
      },
      include: {
        region: true,
        neighborhood: true,
      },
    });

    if (!address) {
      return NextResponse.json(
        { message: "No address found!" },
        { status: 404 }
      );
    }

    // Format the response
    const formattedAddress = {
      addressId: address.id,
      il: address.il,
      adres: address.adres,
      regionId: address.regionId,
      regionName: address.region.name,
      neighborhoodId: address.neighborhoodId,
      neighborhoodName: address.neighborhood.name,
    };

    return NextResponse.json(formattedAddress, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Error fetching address", error },
      { status: 500 }
    );
  }
}

// API to update an address
export async function PUT(req: NextRequest) {
  try {
    const { il, adres, regionId, neighborhoodId } = await req.json(); // Get the updated address data
    const { userId } = auth(); // Get the user ID from Clerk

    if (!userId) {
      return NextResponse.json(
        { message: "User not authenticated!" },
        { status: 401 }
      );
    }

    // Validate region ID
    const region = await prisma.region.findUnique({
      where: { id: regionId },
    });

    if (!region) {
      return NextResponse.json(
        { message: "Invalid region ID" },
        { status: 400 }
      );
    }

    // Validate neighborhood ID
    const neighborhood = await prisma.neighborhood.findUnique({
      where: { id: neighborhoodId },
    });

    if (!neighborhood) {
      return NextResponse.json(
        { message: "Invalid neighborhood ID" },
        { status: 400 }
      );
    }

    // Update the address in the database for the current user
    const updatedAddress = await prisma.address.updateMany({
      where: {
        userId, // Find the address that belongs to the current user
      },
      data: {
        il,
        adres,
        regionId,
        neighborhoodId,
      },
    });

    if (updatedAddress.count === 0) {
      return NextResponse.json(
        { message: "No address found to update!" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Address updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      { message: "Error updating address", error },
      { status: 500 }
    );
  }
}
