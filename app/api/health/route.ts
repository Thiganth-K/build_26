import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!process.env.MONGODB_URI) {
      return NextResponse.json(
        {
          status: "error",
          service: "build26",
          database: "disconnected",
        },
        { status: 503 }
      );
    }

    await connectToDatabase();
    const isConnected = mongoose.connection.readyState === 1;

    if (!isConnected) {
      return NextResponse.json(
        {
          status: "error",
          service: "build26",
          database: "disconnected",
        },
        { status: 503 }
      );
    }

    if (mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
    }

    return NextResponse.json(
      {
        status: "ok",
        service: "build26",
        database: "connected",
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json(
      {
        status: "error",
        service: "build26",
        database: "disconnected",
      },
      { status: 503 }
    );
  }
}
