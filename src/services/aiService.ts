import { GoogleGenerativeAI } from "@google/generative-ai";
import type { Document } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

const SYSTEM_PROMPT = `
Bạn là "Trợ lý ảo ISO" chuyên nghiệp của công ty Phương Nam. 
Nhiệm vụ của bạn là hỗ trợ nhân viên tra cứu quy trình, hồ sơ, biểu mẫu và hướng dẫn công việc (HDCV) một cách nhanh chóng và chính xác.

Quy định trả lời:
1. Luôn lịch sự, chuyên nghiệp và súc tích.
2. Sử dụng thông tin từ danh sách tài liệu được cung cấp để trả lời.
3. Nếu không tìm thấy thông tin trong tài liệu, hãy nói "Tôi không tìm thấy thông tin này trong hệ thống ISO hiện tại, hãy liên hệ Ban ISO để được hỗ trợ".
4. Ưu tiên trích dẫn Mã hiệu tài liệu (VD: QT-01, BM-05) khi trả lời.
5. Hỗ trợ tóm tắt nội dung chính và giải thích các bước thực hiện trong quy trình.
`;

export const aiService = {
  /**
   * Hỏi đáp dựa trên danh sách tài liệu hiện có
   */
  askQuestion: async (question: string, contextDocs: Document[]) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      
      // Tạo ngữ cảnh từ danh sách tài liệu
      const docContext = contextDocs.map(d => 
        `- [${d.docCode}] ${d.name} (${d.isoType}): ${d.changeDescription || 'Không có mô tả chi tiết'}`
      ).join('\n');

      const prompt = `
      ${SYSTEM_PROMPT}

      Danh sách tài liệu hiện có trong hệ thống:
      ${docContext}

      Câu hỏi của người dùng: "${question}"
      `;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      console.error("AI Service Error:", error);
      return "Xin lỗi, tôi đang gặp trục trặc kỹ thuật khi kết nối với bộ não AI. Vui lòng thử lại sau.";
    }
  },

  /**
   * Tóm tắt nhanh một tài liệu dựa trên metadata
   */
  summarizeDoc: async (doc: Document) => {
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = `Hãy tóm tắt ngắn gọn mục đích và nội dung chính của tài liệu ISO sau:
      Tên: ${doc.name}
      Mã hiệu: ${doc.docCode}
      Loại: ${doc.isoType}
      Mô tả thay đổi: ${doc.changeDescription}
      
      Trả lời bằng tiếng Việt, dưới 3 gạch đầu dòng súc tích.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      return response.text();
    } catch (error) {
      return "Không thể tóm tắt tài liệu này lúc này.";
    }
  }
};
