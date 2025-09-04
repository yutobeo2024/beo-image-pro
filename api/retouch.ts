import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, userPrompt, hotspot } = req.body;

    if (!imageData || !userPrompt || !hotspot) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Khởi tạo Google Gemini API với API key từ biến môi trường
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Chuẩn bị dữ liệu ảnh
    const mimeType = imageData.split(';')[0].split(':')[1];
    const base64Data = imageData.split(',')[1];
    const originalImagePart = { inlineData: { mimeType, data: base64Data } };

    // Tạo prompt cho Gemini API
    const promptText = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
User Request: "${userPrompt}"
Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}).

Editing Guidelines:
- The edit must be realistic and blend seamlessly with the surrounding area.
- The rest of the image (outside the immediate edit area) must remain identical to the original.

Safety & Ethics Policy:
- You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
- You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

Output: Return ONLY the final edited image. Do not return text.`;
    const textPart = { text: promptText };

    // Gọi API Gemini
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image-preview',
      contents: { parts: [originalImagePart, textPart] },
    });

    // Xử lý phản hồi
    if (response.promptFeedback?.blockReason) {
      const { blockReason, blockReasonMessage } = response.promptFeedback;
      return res.status(400).json({
        error: `Request was blocked. Reason: ${blockReason}. ${blockReasonMessage || ''}`,
      });
    }

    // Tìm phần ảnh trong phản hồi
    const imagePartFromResponse = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

    if (imagePartFromResponse?.inlineData) {
      const { mimeType, data } = imagePartFromResponse.inlineData;
      return res.status(200).json({
        imageUrl: `data:${mimeType};base64,${data}`,
      });
    }

    // Kiểm tra lý do kết thúc
    const finishReason = response.candidates?.[0]?.finishReason;
    if (finishReason && finishReason !== 'STOP') {
      return res.status(400).json({
        error: `Image generation stopped unexpectedly. Reason: ${finishReason}. This often relates to safety settings.`,
      });
    }

    const textFeedback = response.text?.trim();
    return res.status(400).json({
      error: `The AI model did not return an image. ${textFeedback ? `The model responded with text: "${textFeedback}"` : 'This can happen due to safety filters or if the request is too complex. Please try rephrasing your prompt to be more direct.'}`,
    });

  } catch (error) {
    console.error('Error processing image retouch:', error);
    return res.status(500).json({ error: 'Failed to process image retouch' });
  }
}