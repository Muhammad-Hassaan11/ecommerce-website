const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Parse API key from .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from .env.local.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

async function run() {
    try {
        console.log("Testing gemini-2.0-flash...");
        const result = await model.generateContent("Say hello in one sentence.");
        const response = result.response;
        console.log("✅ Success! Response:", response.text());
    } catch (error) {
        console.error("❌ Error:", error.message);
    }
}

run();
