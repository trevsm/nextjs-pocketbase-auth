"use client";

import AuthRequired from "@/components/AuthRequired";

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <AuthRequired typeMatch="">{children}</AuthRequired>;
}
