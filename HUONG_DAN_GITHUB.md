# 📋 HƯỚNG DẪN UP AZZUILL LÊN GITHUB & BUILD IPA

## Bước 1 — Tạo tài khoản & repo GitHub

1. Vào [github.com](https://github.com) → Đăng ký tài khoản miễn phí (nếu chưa có)
2. Bấm dấu **+** góc trên phải → **New repository**
3. Đặt tên: `azzuill-ff`
4. Chọn **Public**
5. **KHÔNG** tick "Add README" (đã có sẵn trong code)
6. Bấm **Create repository**

---

## Bước 2 — Cài Git trên máy tính (nếu chưa có)

Tải Git tại: https://git-scm.com/download/win  
Cài xong mở **Command Prompt** hoặc **PowerShell**

---

## Bước 3 — Upload code lên GitHub

Mở PowerShell, chạy lần lượt từng lệnh:

```powershell
cd C:\Users\Administrator\Downloads\ipaff\AzzuillSwift

git init
git add .
git commit -m "Initial: Azzuill FF VIP Optimizer"
git branch -M main
git remote add origin https://github.com/TEN_GITHUB_CUA_BAN/azzuill-ff.git
git push -u origin main
```

> ⚠️ Thay `TEN_GITHUB_CUA_BAN` bằng username GitHub của bạn

---

## Bước 4 — GitHub Actions tự động build

Sau khi push:
1. Vào repo GitHub của bạn
2. Click tab **Actions**
3. Thấy workflow **"Build Azzuill IPA"** đang chạy (🟡 màu vàng)
4. Chờ ~3-5 phút cho đến khi thấy ✅ màu xanh

---

## Bước 5 — Tải IPA

Sau khi build thành công:
1. Click tab **Releases** trên GitHub
2. Tải file **`Azzuill.ipa`**

---

## Bước 6 — Cài bằng Esign

1. Gửi `Azzuill.ipa` sang iPhone (AirDrop/Files/iCloud)
2. Mở Esign → Import IPA
3. Bấm **Ký** → Chọn certificate → **Ký ứng dụng**
4. Bấm **Cài đặt**
5. Vào `Cài đặt > Chung > VPN & Quản lý thiết bị` → Trust
6. ✅ Mở **Azzuill** — không lỗi, không văng!
