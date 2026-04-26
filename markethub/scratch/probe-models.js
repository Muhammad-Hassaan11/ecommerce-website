const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");

// Manually parse .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
const match = envContent.match(/GEMINI_API_KEY="([^"]+)"/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from .env.local.");
    process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
    try {
        console.log("Fetching available models...");
        // Use the v1 API or list models
        // Note: listModels might not be available in all SDK versions like this
        // but we can try to probe.
        const models = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-pro", "gemini-1.5-flash-latest"];
        
        for (const modelName of models) {
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent("Hi");
                console.log(`Success with model: ${modelName}`);
                return;
            } catch (e) {
                console.log(`Failed with ${modelName}: ${e.message}`);
            }
        }
    } catch (error) {
        console.error("General Error:", error.message);
    }
}

run();
