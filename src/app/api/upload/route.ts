import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { randomUUID } from "crypto";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export async function POST(request: Request) {
  try {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      return NextResponse.json(
        { error: "Image upload service is not configured" },
        { status: 500 },
      );
    }

    cloudinary.config({
      cloud_name: cloudName,
      api_key: apiKey,
      api_secret: apiSecret,
    });

    const formData = await request.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: "Image file is required" },
        { status: 400 },
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "Only image uploads are supported" },
        { status: 400 },
      );
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "Image must be 5MB or smaller" },
        { status: 400 },
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const publicId = `${Date.now()}-${randomUUID()}`;
    const folder = process.env.CLOUDINARY_FOLDER ?? "uploads";

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id?: string;
      width?: number;
      height?: number;
      bytes?: number;
      format?: string;
    }>(
      (resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          {
            folder,
            public_id: publicId,
            resource_type: "image",
            overwrite: true,
          },
          (error, result) => {
            if (error) return reject(error);
            if (!result || !result.secure_url) {
              return reject(new Error("No URL returned from Cloudinary"));
            }
            resolve({
              secure_url: result.secure_url,
              public_id: result.public_id ?? undefined,
              width: result.width ?? undefined,
              height: result.height ?? undefined,
              bytes: result.bytes ?? undefined,
              format: result.format ?? undefined,
            });
          },
        );
        stream.end(buffer);
      },
    );

    return NextResponse.json({
      // keep backward compat with previous frontend code that expected `path`
      path: uploadResult.secure_url,
      url: uploadResult.secure_url,
      publicId: uploadResult.public_id,
      meta: {
        width: uploadResult.width,
        height: uploadResult.height,
        bytes: uploadResult.bytes,
        format: uploadResult.format,
        folder,
      },
    });
  } catch (error) {
    console.error("Error uploading image", error);
    return NextResponse.json(
      { error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
