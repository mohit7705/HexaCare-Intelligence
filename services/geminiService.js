import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyze skin image using Gemini Vision
 */
export async function analyzeSkinImage(base64Image) {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
        throw new Error("API Key not configured in environment variables");
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // FIX: Use 'gemini-1.5-flash-latest' to resolve the 404 versioning issue
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash-latest" 
        });

        // Strip the metadata prefix (e.g., data:image/jpeg;base64,)
        const cleanBase64 = base64Image.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, "");

        const imagePart = {
            inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
            },
        };

        const prompt = `
        You are a medical AI assistant. Analyze the skin image and provide:
        1. Possible condition
        2. Risk level (Low / Medium / High)
        3. Simple recommendation
        4. Clear medical disclaimer.
        `;

        const result = await model.generateContent([prompt, imagePart]);
        const response = await result.response;
        
        return {
            summary: response.text(),
            disclaimer: "This is an AI analysis and not a professional medical diagnosis."
        };
    } catch (error) {
        console.error("❌ Gemini Service Error Detail:", error);
        throw error;
    }
}