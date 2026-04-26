import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";
import { systemPrompt } from "@/lib/chatbot-prompt";

// Initialize Gemini SDK with the renamed key to avoid collision with invalid system env vars
function getModel() {
  const apiKey = process.env.GEMINI_API_KEY_MARKETHUB || process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    throw new Error("Gemini API key is not configured. Please set GEMINI_API_KEY_MARKETHUB in .env.local");
  }

  // Ensure completely clean key (remove quotes if any)
  const cleanKey = apiKey.replace(/["']/g, '').trim();
  
  const genAI = new GoogleGenerativeAI(cleanKey);
  
  // Using gemini-2.0-flash as the stable modern replacement for 1.5-flash
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    systemInstruction: systemPrompt,
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 500,
    },
  });
}

export async function POST(req: Request) {
  try {
    const { message, history } = await req.json();

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { success: false, reply: "Please provide a valid message." },
        { status: 400 }
      );
    }

    // Convert client-side history format to Gemini's expected format
    const mappedHistory = (history || []).map((msg: any) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.content }],
    }));

    const model = getModel();
    const chat = model.startChat({
      history: mappedHistory,
    });

    const result = await chat.sendMessage(message.trim());
    const responseText = result.response.text();

    return NextResponse.json({ success: true, reply: responseText });

  } catch (error: any) {
    console.error("Chatbot API Error:", error?.message || error);

    // Provide specific error responses
    if (error?.status === 429) {
      return NextResponse.json(
        { 
          success: false, 
          reply: "I'm receiving too many requests. Please wait a moment." 
        },
        { status: 429 }
      );
    }

    if (error?.message?.includes("API_KEY_INVALID") || error?.status === 400) {
      return NextResponse.json(
        { 
          success: false, 
          reply: "There is an issue with the AI configuration (Invalid API Key). Please check your .env.local" 
        },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        reply: "I'm having trouble connecting to my brain right now. Please try again later.",
        // We omit detailed error details in production-ready code for security
      },
      { status: 500 }
    );
  }
}
