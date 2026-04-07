import Groq from "groq-sdk";
import { NextRequest, NextResponse } from "next/server";
import { Fixture } from "@/lib/types";

const SYSTEM_PROMPT = `You are a lighting submittal expert. Given raw text extracted from a lighting schedule PDF, parse it into a JSON array of fixture objects.

Each fixture object must match this TypeScript type exactly:
{
  id: string;           // generate a short unique id like "f1", "f2", etc.
  tag?: string;         // e.g. "A1", "E2"
  manufacturer: string;
  model: string;
  description?: string;
  lumens?: string;
  wattage?: string;
  cct?: string;
  voltage?: string;
  mounting?: string;
  quantity?: number;
  notes?: string;
}

Respond ONLY with a valid JSON array. No markdown, no explanation, no code fences.`;

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { message: "GROQ_API_KEY is not configured on the server." },
      { status: 500 }
    );
  }

  let body: { text?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Invalid JSON body. Expected { text: string }." },
      { status: 400 }
    );
  }

  const { text } = body;
  if (!text || typeof text !== "string") {
    return NextResponse.json(
      { message: "Missing or invalid 'text' field." },
      { status: 400 }
    );
  }

  const groq = new Groq({ apiKey });

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: text },
      ],
      max_tokens: 4096,
      temperature: 0.2,
    });

    const raw = completion.choices[0]?.message?.content ?? "";

    // Try to parse the response as JSON directly, or extract a JSON block
    let fixtures: Fixture[];
    try {
      fixtures = JSON.parse(raw);
    } catch {
      // Attempt to extract a JSON array from the response
      const match = raw.match(/\[[\s\S]*\]/);
      if (!match) {
        console.error("Groq returned non-JSON response:", raw.slice(0, 500));
        return NextResponse.json(
          {
            message:
              "The AI response was not valid JSON. Try again or simplify the input.",
          },
          { status: 400 }
        );
      }
      fixtures = JSON.parse(match[0]);
    }

    if (!Array.isArray(fixtures)) {
      return NextResponse.json(
        { message: "Expected a JSON array of fixtures from the AI." },
        { status: 400 }
      );
    }

    return NextResponse.json({ fixtures });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    console.error("Groq API error:", msg);
    return NextResponse.json(
      { message: `Groq API error: ${msg}` },
      { status: 500 }
    );
  }
}
