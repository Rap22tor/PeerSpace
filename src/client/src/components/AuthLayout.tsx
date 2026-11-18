import type { ReactNode } from "react";

interface AuthLayoutProps {
  title: string;
  subtitle: string;
  children: ReactNode;
}

// The centred single column shared by every signed-out and landing screen.
export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-6">
      <div className="w-full max-w-85">
        <h1 className="mb-1 text-2xl leading-tight font-medium">{title}</h1>
        <p className="mb-7 text-muted">{subtitle}</p>
        {children}
      </div>
    </main>
  );
}
