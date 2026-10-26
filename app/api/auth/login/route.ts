import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { createSession } from "@/lib/session";
import UserModel from "@/models/User";

export async function POST(request: Request) {
  let body: { email?: unknown; password?: unknown };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "請求格式錯誤" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return Response.json({ error: "請輸入 Email 和密碼" }, { status: 400 });
  }

  try {
    await connectDB();
    const user = await UserModel.findOne({ email }).select("+password");

    // 不透露是帳號不存在還是密碼錯誤
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return Response.json({ error: "Email 或密碼錯誤" }, { status: 401 });
    }

    await createSession({ userId: user._id.toString(), role: user.role });

    return Response.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("[auth/login] 失敗", error);
    return Response.json({ error: "登入失敗，請稍後再試" }, { status: 500 });
  }
}
