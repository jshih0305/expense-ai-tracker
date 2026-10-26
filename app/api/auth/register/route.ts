import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/session";
import UserModel from "@/models/User";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// 註冊驗證碼，先寫死
const REGISTER_CODE = "love";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown; name?: unknown; code?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const code = typeof body.code === "string" ? body.code.trim() : "";

  if (code !== REGISTER_CODE) {
    return Response.json({ error: "驗證碼錯誤" }, { status: 403 });
  }
  if (!name) {
    return Response.json({ error: "請輸入名稱" }, { status: 400 });
  }
  if (!EMAIL_PATTERN.test(email)) {
    return Response.json({ error: "Email 格式不正確" }, { status: 400 });
  }
  if (password.length < 8) {
    return Response.json({ error: "密碼至少需要 8 個字元" }, { status: 400 });
  }

  try {
    await connectDB();

    if (await UserModel.exists({ email })) {
      return Response.json({ error: "這個 Email 已經註冊過了" }, { status: 409 });
    }

    const user = await UserModel.create({
      email,
      name,
      password: await bcrypt.hash(password, 10),
    });

    await createSession({ userId: user._id.toString(), role: user.role });

    return Response.json(
      { user: { id: user._id, email: user.email, name: user.name, role: user.role } },
      { status: 201 },
    );
  } catch (error) {
    console.error("[auth/register] 失敗", error);
    return Response.json({ error: "註冊失敗，請稍後再試" }, { status: 500 });
  }
}
