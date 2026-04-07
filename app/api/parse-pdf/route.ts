import { NextRequest, NextResponse } from "next/server";
import { PDFParse } from "pdf-parse";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!file || !(file instanceof Blob)) {
      return NextResponse.json(
        { message: "No PDF file provided. Send a 'file' field with multipart/form-data." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    const text = result.text?.trim();

    if (!text) {
      return NextResponse.json(
        { message: "Could not extract any text from the uploaded PDF." },
        { status: 422 }
      );
    }

    return NextResponse.json({ text });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("PDF parse error:", msg);
    return NextResponse.json(
      { message: `Failed to parse PDF: ${msg}` },
      { status: 500 }
    );
  }
}
