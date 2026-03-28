const mongoose = require("mongoose");
const User = require("../schemas/users");

const readUsersFromExcel = require("../utils/readUsers");
const generatePassword = require("../utils/generatePassword");
const sendPasswordEmail = require("../services/emailService");

// ⏱️ Delay để tránh spam mail
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 🔗 Kết nối MongoDB
mongoose.connect("mongodb://127.0.0.1:27017/test")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err));

// 👉 Thay bằng ObjectId role "user" của bạn
const ROLE_USER_ID = "69c79564e9de5f8321880a37";

async function importUsers() {
    try {
        // 📥 Đọc file Excel
        const users = readUsersFromExcel("data/user.xlsx");

        for (const u of users) {
            try {
                // ❌ Bỏ qua nếu thiếu dữ liệu
                if (!u.username || !u.email) continue;

                // 🔎 Kiểm tra trùng username
                const existingUser = await User.findOne({ username: u.username });
                if (existingUser) {
                    console.log("Skipped:", u.username);
                    continue;
                }

                // 🔐 Tạo password random 16 ký tự
                const password = generatePassword(16);

                // 👤 Tạo user mới
                const newUser = new User({
                    username: u.username,
                    email: u.email,
                    password: password, // sẽ tự hash bởi schema
                    role: ROLE_USER_ID
                });

                // 💾 Lưu DB
                await newUser.save();

                // 📧 Gửi email password
                await sendPasswordEmail(u.email, u.username, password);

                console.log("Created:", u.username);

                // ⏱️ Delay tránh spam Mailtrap
                await sleep(3000);

            } catch (err) {
                console.error("Error with:", u.username, err.message);
            }
        }

        console.log("🎉 IMPORT DONE");
        process.exit();

    } catch (error) {
        console.error("Import error:", error);
    }
}

// ▶️ Chạy
importUsers();