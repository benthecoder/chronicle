import { NextResponse, NextRequest } from "next/server";
import OpenAI from "openai";
import { zodResponseFormat } from "openai/helpers/zod.mjs";
import { z } from "zod";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  // baseURL: "https://api.nvcf.nvidia.com/v1/chat/completions",
});

const Result = z.object({
  biased_text: z.string(),
  non_biased_text: z.string(),
  non_biased_source_url: z.string(),
});

const ListResult = z.object({
  results: z.array(Result),
});
export async function POST(request: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OPENAI_API_KEY is not configured");
    }

    const { inputText, compareText } = await request.json();

    console.log("inputText", inputText);
    console.log("compareText", compareText);
    console.log("Starting API request to NVIDIA...");

    const completion = await openai.beta.chat.completions.parse({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content:
            "You are a text comparison expert. Analyze the input text against the comparison text and identify similarities and differences.",
        },
        {
          role: "user",
          content: `Compare these two texts and provide a JSON response with the following structure:
          Input Text: ${inputText}
          Comparison Text: ${compareText}
          `,
        },
      ],
      temperature: 0.5,
      max_tokens: 4000,
      stream: false,
      response_format: zodResponseFormat(ListResult, "results"),
    });

    console.log("API Response:", completion);
    return NextResponse.json(completion.choices[0].message.parsed);
  } catch (error: any) {
    console.error("Detailed error:", {
      message: error.message,
      stack: error.stack,
      response: error.response?.data,
    });

    return NextResponse.json(
      { error: error.message || "Failed to process request" },
      { status: 500 }
    );
  }
}
