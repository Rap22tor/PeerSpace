import type { ReactNode } from "react";
import { Link } from "react-router";

interface TextLinkProps {
  to: string;
  children: ReactNode;
}

// An in-app link in the accent colour.
export function TextLink({ to, children }: TextLinkProps) {
  return (
    <Link to={to} className="font-medium text-accent hover:underline">
      {children}
    </Link>
  );
}
