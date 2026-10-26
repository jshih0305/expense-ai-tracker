import type { Metadata } from "next";
import AuthForm from "../_components/AuthForm";

export const metadata: Metadata = {
  title: "登入",
};

export default function LoginPage() {
  return <AuthForm mode="login" />;
}
