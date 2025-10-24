# 🤖 Background Service - Hướng dẫn sử dụng

Service này cho phép ứng dụng chạy ngầm trên server mà không cần mở trình duyệt.

## 📋 Yêu cầu

- Node.js 18+ đã cài đặt
- Telegram Bot Token
- Telegram Chat ID hoặc Group ID

## 🚀 Cách sử dụng

### 1. Cài đặt dependencies

```bash
npm install
```

### 2. Cấu hình

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Sau đó chỉnh sửa file `.env` với thông tin của bạn:

```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
UPDATE_INTERVAL_MINUTES=60
```

#### Cách lấy Bot Token:
1. Mở Telegram và tìm kiếm `@BotFather`
2. Gửi lệnh `/newbot` để tạo bot mới
3. Làm theo hướng dẫn và copy Bot Token

#### Cách lấy Chat ID:
- **Chat cá nhân**: Tìm kiếm `@userinfobot` trên Telegram và gửi `/start`
- **Group**: 
  1. Thêm bot vào group
  2. Truy cập: `https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates`
  3. Tìm giá trị `"chat":{"id":-1001234567890}`

### 3. Chạy Service

#### Chạy trực tiếp (development):

```bash
npm run service
```

#### Chạy với PM2 (production - khuyến nghị):

```bash
# Cài đặt PM2 (nếu chưa có)
npm install -g pm2

# Start service
npm run service:pm2

# Hoặc
pm2 start background-service.js --name gold-notifier

# Xem logs
pm2 logs gold-notifier

# Dừng service
pm2 stop gold-notifier

# Khởi động lại
pm2 restart gold-notifier

# Xóa khỏi PM2
pm2 delete gold-notifier

# Tự động khởi động khi server reboot
pm2 startup
pm2 save
```

## 🎯 Tính năng

✅ Tự động fetch giá vàng từ 24h.com.vn  
✅ Gửi thông báo qua Telegram theo lịch  
✅ Chạy ngầm không cần browser  
✅ Tự động retry khi lỗi  
✅ Logs chi tiết  
✅ Graceful shutdown  

## 📊 Ví dụ thông báo

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

## 🔧 Troubleshooting

### Service không khởi động
- Kiểm tra file `.env` đã được tạo chưa
- Đảm bảo `TELEGRAM_BOT_TOKEN` và `TELEGRAM_CHAT_ID` đúng

### Không nhận được tin nhắn
- Kiểm tra bot đã được thêm vào group chưa (nếu gửi vào group)
- Kiểm tra bot có quyền gửi tin nhắn trong group
- Xem logs: `pm2 logs gold-notifier`

### Service bị crash
- Xem logs chi tiết: `pm2 logs gold-notifier --lines 100`
- Khởi động lại: `pm2 restart gold-notifier`

## 🌐 Deploy lên Server

### VPS/Cloud (Ubuntu/Debian):

```bash
# 1. Clone project
git clone <your-repo>
cd gold-price-telegram-notifier

# 2. Cài đặt Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 3. Cài đặt dependencies
npm install

# 4. Tạo file .env
nano .env
# Paste configuration và save (Ctrl+X, Y, Enter)

# 5. Cài đặt PM2
sudo npm install -g pm2

# 6. Start service
pm2 start background-service.js --name gold-notifier

# 7. Setup auto-start on reboot
pm2 startup
pm2 save
```

## 📝 Notes

- Interval tối thiểu khuyến nghị: 15 phút (để tránh spam)
- Service sử dụng rất ít tài nguyên (~50MB RAM)
- Có thể chạy nhiều instance với config khác nhau
