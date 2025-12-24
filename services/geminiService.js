import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Analyze skin image using Gemini Vision (PRODUCTION SAFE)
 */
export async function analyzeSkinImage(base64Image) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY not set in environment variables");
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash-latest",
    });

    // ✅ REMOVE base64 metadata
    const cleanBase64 = base64Image.replace(
      /^data:image\/(png|jpeg|jpg|webp);base64,/,
      ""
    );

    const prompt = `
You are a medical AI assistant.

Analyze the skin image and return:
1. Possible condition
2. Risk level (Low / Medium / High)
3. Simple recommendation
4. Clear medical disclaimer

Keep the response concise and readable.
`;

    // ✅ CORRECT Gemini Vision PAYLOAD (THIS FIXES 500 ERROR)
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

    const response = result.response.text();

    return {
      summary: response,
      disclaimer:
        "This is an AI-generated analysis and not a medical diagnosis. Consult a dermatologist for confirmation.",
    };
  } catch (error) {
    console.error("❌ Gemini Vision Error:", error);
    throw new Error("Vision analysis failed");
  }
}
