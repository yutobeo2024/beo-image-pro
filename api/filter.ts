import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Chỉ cho phép phương thức POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { imageData, filterPrompt } = req.body;

    if (!imageData || !filterPrompt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Khởi tạo Google Gemini API với API key từ biến môi trường
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

    // Chuẩn bị dữ liệu ảnh
    const mimeType = imageData.split(';')[0].split(':')[1];
    const base64Data = imageData.split(',')[1];
    const originalImagePart = { inlineData: { mimeType, data: base64Data } };

    // Tạo prompt cho Gemini API
    const promptText = `You are an expert photo editor AI. Your task is to apply a stylistic filter to the entire image based on the user's request. Do not change the composition or content, only apply the style.
Filter Request: "${filterPrompt}"

Safety & Ethics Policy:
- Filters may subtly shift colors, but you MUST ensure they do not alter a person's fundamental race or ethnicity.
- You MUST REFUSE any request that explicitly asks to change a person's race (e.g., 'apply a filter to make me look Chinese').

Output: Return ONLY the final filtered image. Do not return text.`;
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
    console.error('Error processing image filter:', error);
    return res.status(500).json({ error: 'Failed to process image filter' });
  }
}