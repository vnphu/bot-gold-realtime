# 🚀 Quick Start Guide

## Bước 1: Tạo Telegram Bot

1. Mở Telegram, tìm kiếm **@BotFather**
2. Gửi lệnh: `/newbot`
3. Đặt tên cho bot (VD: "Gold Price Notifier")
4. Đặt username cho bot (VD: "my_gold_price_bot")
5. **Copy Bot Token** (VD: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Bước 2: Lấy Chat ID

### Cho Chat Cá Nhân:
1. Tìm kiếm **@userinfobot** trên Telegram
2. Gửi `/start`
3. Bot sẽ trả về Chat ID của bạn (VD: `123456789`)

### Cho Group:
1. Tạo group mới hoặc dùng group có sẵn
2. Thêm bot vào group (Add Members → tìm bot của bạn)
3. Promote bot thành Admin (Settings → Edit → Administrators → Add Admin)
4. Gửi một tin nhắn bất kỳ trong group
5. Truy cập URL: `https://api.telegram.org/bot<BOT_TOKEN>/getUpdates`
   (Thay `<BOT_TOKEN>` bằng token của bạn)
6. Tìm `"chat":{"id":-1001234567890}` (Group ID thường bắt đầu bằng `-100`)
7. **Copy Chat ID** (VD: `-1001234567890`)

## Bước 3: Chọn chế độ sử dụng

### 🌐 Option A: Web UI (Đơn giản, dùng cho cá nhân)

```bash
# 1. Cài đặt
npm install

# 2. Chạy app
npm run dev

# 3. Mở browser
# Truy cập: http://localhost:3000

# 4. Nhập thông tin
- Bot Token: paste token từ bước 1
- Chat ID: paste chat ID từ bước 2  
- Interval: 60 phút (hoặc tùy chọn)

# 5. Click "Start Service"
```

**Ưu điểm:**
- ✅ Dễ sử dụng, có giao diện trực quan
- ✅ Xem logs realtime
- ✅ Tự động lưu config

**Nhược điểm:**
- ❌ Phải giữ tab browser mở
- ❌ Không chạy khi tắt máy

---

### 🤖 Option B: Background Service (Chuyên nghiệp, chạy 24/7)

```bash
# 1. Cài đặt
npm install

# 2. Tạo file config
cp .env.example .env

# 3. Chỉnh sửa file .env
nano .env
```

Nhập thông tin:
```env
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=-1001234567890
UPDATE_INTERVAL_MINUTES=60
```

Lưu file (Ctrl+X, Y, Enter)

```bash
# 4. Chạy service
npm run service

# Hoặc dùng PM2 (production)
npm install -g pm2
npm run service:pm2

# Xem logs
pm2 logs gold-notifier
```

**Ưu điểm:**
- ✅ Chạy ngầm, không cần browser
- ✅ Tự động restart khi crash
- ✅ Chạy 24/7 trên server
- ✅ Ít tốn tài nguyên (~50MB RAM)

**Nhược điểm:**
- ❌ Cần command line
- ❌ Cần server/VPS để chạy lâu dài

---

## Bước 4: Test

### Test với Web UI:
1. Sau khi click "Start Service"
2. Kiểm tra logs trong app
3. Kiểm tra Telegram xem có nhận tin nhắn không

### Test với Background Service:
```bash
# Xem logs realtime
npm run service

# Hoặc với PM2
pm2 logs gold-notifier
```

Bạn sẽ thấy:
```
✅ Configuration validated successfully
📡 Fetching gold prices from 24h.com.vn...
✅ Successfully fetched 10 gold prices
📤 Sending message to Telegram...
✅ Message sent successfully to Telegram
```

Kiểm tra Telegram để xem tin nhắn!

---

## 🎯 Kết quả

Bạn sẽ nhận được tin nhắn như này:

```
📊 Cập nhật giá vàng - 24/10/2025 09:00

Loại         | Mua        | Bán
--------------------------------------
SJC          | 147,800,000 | 149,800,000
DOJI HN      | 147,800,000 | 149,800,000
DOJI SG      | 147,800,000 | 149,800,000
PNJ          | 147,300,000 | 149,300,000
BTMC SJC     | 147,500,000 | 149,500,000

Nguồn: 24h.com.vn
```

---

## ⚠️ Troubleshooting

### Không nhận được tin nhắn?

**Kiểm tra Bot Token:**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getMe"
```
Nếu đúng, sẽ trả về thông tin bot.

**Kiểm tra Chat ID:**
```bash
curl "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/sendMessage?chat_id=<YOUR_CHAT_ID>&text=Test"
```
Nếu đúng, bạn sẽ nhận được tin "Test".

**Bot trong Group:**
- Bot phải là Admin
- Bot phải có quyền "Send Messages"
- Group ID phải đúng (bắt đầu bằng `-100`)

### Service bị crash?

```bash
# Xem logs chi tiết
pm2 logs gold-notifier --lines 100

# Restart service
pm2 restart gold-notifier

# Xem status
pm2 status
```

---

## 📚 Tài liệu chi tiết

- [README_VN.md](./README_VN.md) - Hướng dẫn đầy đủ
- [BACKGROUND_SERVICE.md](./BACKGROUND_SERVICE.md) - Chi tiết về service

---

## 🎉 Xong!

Giờ bạn đã có một hệ thống tự động theo dõi giá vàng và gửi thông báo qua Telegram!

**Tips:**
- Interval khuyến nghị: 30-60 phút (tránh spam)
- Dùng Web UI để test nhanh
- Dùng Background Service cho production
- Deploy lên VPS để chạy 24/7
