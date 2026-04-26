const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Manually parse .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const match = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from .env.local or could not be parsed.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

async function run() {
    try {
        console.log("Testing API with key ending in:", apiKey.slice(-4));
        const result = await model.generateContent("Hello!");
        const response = await result.response;
        console.log("Success! Bot says:", response.text());
    } catch (error) {
        console.error("API ERROR DETECTED:");
        console.error("Message:", error.message);
        if (error.status) console.error("Status Code:", error.status);
    }
}

run();
