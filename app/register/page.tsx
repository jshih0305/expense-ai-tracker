import type { Metadata } from "next";
import AuthForm from "../_components/AuthForm";

export const metadata: Metadata = {
  title: "註冊",
};

export default function RegisterPage() {
  return <AuthForm mode="register" />;
}
