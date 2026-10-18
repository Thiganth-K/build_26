import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { getSessionFromRequest } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = getSessionFromRequest(req);
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Limit to PPT, PPTX, PDF, KEY
    const allowedExtensions = [".ppt", ".pptx", ".pdf", ".key", ".odp"];
    const ext = path.extname(file.name).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Invalid file format. Please upload a Presentation (.pptx, .ppt, .pdf)" },
        { status: 400 }
      );
    }

    // Limit file size to 50MB
    const MAX_SIZE = 50 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File size exceeds 50MB limit." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Format file size
    const sizeFormatted =
      file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${(file.size / 1024).toFixed(1)} KB`;

    // Ensure uploads directory exists inside public/
    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    await mkdir(uploadsDir, { recursive: true });

    // Clean filename and make unique
    const cleanOrigName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const uniquePrefix = `day1_ppt_${Date.now()}`;
    const finalFileName = `${uniquePrefix}_${cleanOrigName}`;
    const filePath = path.join(uploadsDir, finalFileName);

    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${finalFileName}`;

    return NextResponse.json({
      success: true,
      url: fileUrl,
      fileName: file.name,
      storedFileName: finalFileName,
      fileSize: sizeFormatted,
      type: file.type || ext,
      uploadedBy: session?.name || "Participant",
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "File upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
