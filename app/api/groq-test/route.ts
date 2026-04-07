import Groq from "groq-sdk";
import { NextResponse } from "next/server";

export async function GET() {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { message: "GROQ_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  const groq = new Groq({ apiKey });

  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content:
            "Say hello and mention that you are running inside flux-lighting-ai.",
        },
      ],
      max_tokens: 256,
      temperature: 0.7,
    });

    const message =
      chatCompletion.choices[0]?.message?.content ??
      "No response from the model.";

    return NextResponse.json({ message });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { message: `Groq API error: ${errorMessage}` },
      { status: 500 }
    );
  }
}
