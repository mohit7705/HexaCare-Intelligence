import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyze skin image using Gemini Vision (PRODUCTION SAFE)
 */
export async function analyzeSkinImage(base64Image) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  try {
    // 1️⃣ Validate input
    if (!base64Image || typeof base64Image !== "string") {
      throw new Error("Invalid image payload");
    }

    // 2️⃣ Extract mime type + base64 safely
    const match = base64Image.match(/^data:(image\/\w+);base64,(.+)$/);

    if (!match) {
      throw new Error("Invalid base64 image format");
    }

    const mimeType = match[1];       // image/jpeg | image/png | image/webp
    const base64Data = match[2];

    // 3️⃣ Convert base64 → Uint8Array (REQUIRED BY GEMINI)
    const imageBuffer = Buffer.from(base64Data, "base64");

    // 4️⃣ Size protection (Render safe)
    if (imageBuffer.length > 4 * 1024 * 1024) {
      throw new Error("Image too large for analysis");
    }

    // 5️⃣ Init Gemini
    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ Vision-stable model
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-pro"
    });

    // 6️⃣ Vision input
    const imagePart = {
      inlineData: {
        data: imageBuffer,
        mimeType
      }
    };

    const prompt = `
You are a medical AI assistant.

Analyze the provided skin image and respond with:
- Possible condition (if visible)
- Risk level: Low / Medium / High
- Simple recommendation
- Clear medical disclaimer

Keep the response concise and patient-friendly.
`;

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;

    return {
      summary: response.text(),
      disclaimer:
        "This AI-based analysis is for informational purposes only and is not a medical diagnosis. Please consult a qualified doctor."
    };

  } catch (error) {
    console.error("❌ Gemini Vision Error:", error.message);
    throw new Error("Vision analysis failed");
  }
}
