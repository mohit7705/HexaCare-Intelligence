import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyze skin image using Gemini Vision
 */
export async function analyzeSkinImage(base64Image) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ FIX 1: Use specific model alias to avoid 404s
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest", 
    });

    // ✅ FIX 2: Ensure we aren't sending the header in the data payload
    // (Your regex was good, but this ensures safety if the string is already raw)
    const cleanBase64 = base64Image.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      ""
    );

    const prompt = `
    You are a medical AI assistant.
    Analyze the skin image and provide:
    1. Possible condition
    2. Risk level (Low / Medium / High)
    3. Recommendation
    4. Medical disclaimer
    `;

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            {
              inlineData: {
                data: cleanBase64,
                mimeType: "image/jpeg",
              },
            },
          ],
        },
      ],
    });

    const response = await result.response;
    const text = response.text();

    return {
      summary: text,
      disclaimer: "This is an AI-generated analysis and not a medical diagnosis. Consult a dermatologist.",
    };

  } catch (error) {
    console.error("❌ Gemini Vision Error Detailed:", error);
    // Throwing error allows the frontend to catch it
    throw new Error(error.message || "Vision analysis failed");
  }
}