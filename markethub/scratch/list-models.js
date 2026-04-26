const fs = require("fs");

// Parse API key from .env.local
const envContent = fs.readFileSync(".env.local", "utf8");
// Support both quoted and unquoted values
const match = envContent.match(/GEMINI_API_KEY=["']?([^"'\r\n]+)["']?/);
const apiKey = match ? match[1] : null;

if (!apiKey) {
    console.error("GEMINI_API_KEY is missing from .env.local.");
    process.exit(1);
}

console.log("API key ends with:", apiKey.slice(-4));

// Use the REST API directly to list available models
async function listModels() {
    try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data.error) {
            console.error("API Error:", data.error);
            return;
        }

        console.log("\n=== Available Models (supporting generateContent) ===\n");
        const contentModels = (data.models || []).filter(m => 
            m.supportedGenerationMethods && 
            m.supportedGenerationMethods.includes("generateContent")
        );
        
        contentModels.forEach(m => {
            console.log(`  ${m.name} (${m.displayName})`);
        });

        console.log(`\nTotal: ${contentModels.length} models support generateContent`);
    } catch (error) {
        console.error("Fetch error:", error.message);
    }
}

listModels();
