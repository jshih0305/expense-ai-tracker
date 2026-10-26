import { connectDB } from "@/lib/mongodb";
import { deleteSession, getSession, unauthorized } from "@/lib/session";
import UserModel from "@/models/User";

// GET /api/auth/me：取得目前登入的使用者
export async function GET() {
  const session = await getSession();
  if (!session) return unauthorized();

  try {
    await connectDB();
    const user = await UserModel.findById(session.userId).lean();
    // cookie 有效但使用者已被刪除：清掉 cookie，避免登入頁和首頁互相導向
    if (!user) {
      await deleteSession();
      return unauthorized();
    }

    return Response.json({
      user: { id: user._id, email: user.email, name: user.name, role: user.role },
    });
  } catch (error) {
    console.error("[auth/me] 失敗", error);
    return Response.json({ error: "讀取使用者失敗" }, { status: 500 });
  }
}
