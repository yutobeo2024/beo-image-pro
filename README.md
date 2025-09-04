<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# BEO IMAGE PRO

Ứng dụng chỉnh sửa ảnh sử dụng AI được xây dựng với React và Google Gemini API.

View your app in AI Studio: https://ai.studio/apps/drive/1tcxOdUCSAnlAsfG21wNoploQOZn5Izxr

## Tính năng

- **Retouch**: Chỉnh sửa cục bộ dựa trên prompt và điểm được chọn
- **Filters**: Áp dụng bộ lọc dựa trên văn bản
- **Adjustments**: Điều chỉnh toàn cục như làm mịn da, làm mờ nền, tăng chi tiết
- **Crop**: Cắt ảnh với các tỷ lệ khác nhau

## Run Locally

**Prerequisites:**  Node.js

1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
   
## Deploy lên Vercel

### 1. Chuẩn bị

- Đảm bảo bạn đã có tài khoản Vercel
- Đảm bảo bạn đã có Google Gemini API key

### 2. Cài đặt Vercel CLI

```bash
npm install -g vercel
```

### 3. Đăng nhập vào Vercel

```bash
vercel login
```

### 4. Thiết lập biến môi trường

Tạo biến môi trường bí mật trên Vercel:

```bash
vercel secrets add gemini_api_key "YOUR_GEMINI_API_KEY"
```

### 5. Deploy lên Vercel

```bash
vercel
```

Hoặc deploy trực tiếp từ GitHub:

1. Đẩy code lên GitHub repository
2. Đăng nhập vào [Vercel Dashboard](https://vercel.com/dashboard)
3. Chọn "New Project"
4. Import repository từ GitHub
5. Cấu hình project:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Thêm biến môi trường: `GEMINI_API_KEY` (sử dụng secret đã tạo)
6. Chọn "Deploy"

## Cấu trúc API

Ứng dụng sử dụng Vercel API Functions để xử lý các yêu cầu chỉnh sửa ảnh:

- `/api/retouch`: Xử lý chỉnh sửa cục bộ
- `/api/filter`: Xử lý áp dụng bộ lọc
- `/api/adjust`: Xử lý điều chỉnh toàn cục

Các API này gọi đến Google Gemini API để xử lý ảnh dựa trên prompt của người dùng.
