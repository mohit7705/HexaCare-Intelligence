import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyze skin image using Gemini Vision (FINAL FIX)
 */
export async function analyzeSkinImage(base64Image) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    // ✅ FIXED MODEL NAME (NO -latest)
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
    });

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

    return {
      summary: result.response.text(),
      disclaimer:
        "This is an AI-generated analysis and not a medical diagnosis. Consult a dermatologist.",
    };
  } catch (error) {
    console.error("❌ Gemini Vision Error:", error);
    throw new Error("Vision analysis failed");
  }
}
