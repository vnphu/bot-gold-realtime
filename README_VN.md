# 📊 Gold Price Telegram Notifier

Ứng dụng tự động theo dõi và gửi thông báo giá vàng qua Telegram. Hỗ trợ cả **chế độ Web UI** và **Background Service** chạy ngầm.

## ✨ Tính năng

- ✅ **Lấy giá vàng thực tế** từ 24h.com.vn
- ✅ **Tự động gửi thông báo** qua Telegram Bot
- ✅ **2 chế độ hoạt động**:
  - 🌐 **Web UI**: Giao diện web với dashboard trực quan
  - 🤖 **Background Service**: Chạy ngầm trên server không cần browser
- ✅ **Lưu cấu hình tự động** (localStorage)
- ✅ **Tùy chỉnh tần suất** cập nhật (phút/giờ)
- ✅ **Logs chi tiết** theo thời gian thực

## 📸 Screenshots

### Web UI
Giao diện web với:
- Form cấu hình Bot Token và Chat ID
- Bảng hiển thị giá vàng realtime
- Activity logs
- Control panel (Start/Stop)

### Telegram Notification
```
📊 Cập nhật giá vàng - 24/10/2025 08:00

Loại         | Mua        | Bán
--------------------------------------
SJC          | 147,800,000 | 149,800,000
DOJI HN      | 147,800,000 | 149,800,000
DOJI SG      | 147,800,000 | 149,800,000
PNJ          | 147,300,000 | 149,300,000

Nguồn: 24h.com.vn
```

## 🚀 Cài đặt

### Yêu cầu
- Node.js 18+
- Telegram Bot Token (lấy từ @BotFather)
- Telegram Chat ID (lấy từ @userinfobot)

### Clone và cài đặt

```bash
git clone <repo-url>
cd gold-price-telegram-notifier
npm install
```

## 💻 Chế độ Web UI

### 1. Khởi động development server

```bash
npm run dev
```

### 2. Truy cập ứng dụng

Mở browser tại: http://localhost:3000

### 3. Cấu hình

1. Nhập **Bot Token** (từ @BotFather)
2. Nhập **Chat ID** (từ @userinfobot hoặc group ID)
3. Chọn **tần suất cập nhật** (phút hoặc giờ)
4. Nhấn **Start Service**

### 4. Tính năng

- ✅ Cấu hình được **lưu tự động** trong localStorage
- ✅ Không cần nhập lại khi refresh trang
- ✅ Xem giá vàng realtime trong bảng
- ✅ Theo dõi logs hoạt động

### Build cho production

```bash
npm run build
npm run preview
```

## 🤖 Chế độ Background Service

Service chạy ngầm trên server, không cần mở browser.

### 1. Cấu hình

Tạo file `.env`:

```bash
cp .env.example .env
```

Chỉnh sửa `.env`:

```env
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
UPDATE_INTERVAL_MINUTES=60
```

### 2. Chạy service

#### Development mode:

```bash
npm run service
```

#### Production mode (với PM2):

```bash
# Cài PM2 (nếu chưa có)
npm install -g pm2

# Start service
npm run service:pm2

# Xem logs
pm2 logs gold-notifier

# Dừng service
pm2 stop gold-notifier

# Restart
pm2 restart gold-notifier
```

### 3. Deploy lên server

Xem chi tiết trong [BACKGROUND_SERVICE.md](./BACKGROUND_SERVICE.md)

## 📚 Cấu trúc Project

```
gold-price-telegram-notifier/
├── components/           # React components
│   ├── Header.tsx
│   ├── ConfigForm.tsx
│   ├── ControlPanel.tsx
│   ├── DataTable.tsx
│   ├── LogViewer.tsx
│   └── WarningBanner.tsx
├── services/            # Business logic
│   ├── goldService.ts        # Fetch gold prices
│   ├── telegramService.ts    # Telegram API
│   └── storageService.ts     # LocalStorage management
├── App.tsx              # Main React app
├── background-service.js     # Standalone Node.js service
├── .env.example         # Environment config template
└── BACKGROUND_SERVICE.md     # Service documentation
```

## 🔧 API & Services

### goldService.ts
- Fetch dữ liệu từ 24h.com.vn
- Parse HTML với DOMParser (browser) hoặc Cheerio (Node.js)
- Sử dụng CORS proxy cho browser

### telegramService.ts
- Gửi message qua Telegram Bot API
- Support Markdown formatting
- Error handling

### storageService.ts
- Lưu/load config từ localStorage
- Auto-save khi config thay đổi

## 🎯 Use Cases

### 1. Cá nhân theo dõi giá vàng
- Sử dụng Web UI
- Nhận thông báo trên Telegram cá nhân
- Cấu hình interval phù hợp (VD: 1 giờ)

### 2. Group/Channel Telegram
- Sử dụng Background Service
- Deploy lên VPS/Cloud
- Gửi thông báo định kỳ cho nhóm

### 3. Development/Testing
- Chạy Web UI local
- Test với interval ngắn (VD: 1 phút)
- Debug qua browser console

## ⚙️ Configuration

### Web UI (localStorage)
Tự động lưu khi nhập:
- Bot Token
- Chat ID
- Interval Value
- Interval Unit

### Background Service (.env)
```env
TELEGRAM_BOT_TOKEN=     # Required
TELEGRAM_CHAT_ID=       # Required  
UPDATE_INTERVAL_MINUTES=60  # Optional, default: 60
```

## 🐛 Troubleshooting

### Web UI

**Không fetch được giá vàng:**
- Kiểm tra CORS proxy có hoạt động
- Xem console log trong browser
- Thử refresh trang

**Không gửi được Telegram:**
- Kiểm tra Bot Token đúng chưa
- Kiểm tra Chat ID đúng chưa
- Bot có quyền gửi tin nhắn trong group chưa

### Background Service

**Service không start:**
- Kiểm tra file `.env` đã tạo chưa
- Verify các biến môi trường
- Chạy `node background-service.js` để xem lỗi

**Không nhận tin nhắn:**
- Kiểm tra bot đã được thêm vào group
- Bot có quyền "Send Messages"
- Xem logs: `pm2 logs gold-notifier`

## 📝 Notes

- **CORS proxy** (api.allorigins.win) chỉ dùng cho development
- **Production**: Nên dùng Background Service hoặc tự setup backend
- **Interval tối thiểu khuyến nghị**: 15 phút
- **Rate limiting**: 24h.com.vn có thể block nếu request quá nhiều

## 🔐 Security

- ⚠️ **Không commit** file `.env` lên git
- ⚠️ **Không share** Bot Token công khai
- ✅ Sử dụng environment variables
- ✅ Bot Token được mask trong UI

## 📄 License

MIT License

## 🤝 Contributing

Pull requests are welcome!

## 📮 Support

Nếu gặp vấn đề, tạo issue trên GitHub hoặc liên hệ qua Telegram.

---

**Developed with ❤️ by [Your Name]**
