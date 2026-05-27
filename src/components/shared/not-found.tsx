import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

interface NotFoundProps {
  variant?: "full" | "compact";
}

export function NotFound({ variant = "compact" }: NotFoundProps) {
  const heightClass = variant === "full" ? "min-h-screen" : "min-h-[60vh]";

  return (
    <div className={`flex items-center justify-center px-6 ${heightClass}`}>
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-bold text-vivid-primary mb-4">404</h1>
        <h2 className="text-2xl font-bold text-white mb-2">Page Not Found</h2>
        <p className="text-vivid-textMuted mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button asChild>
          <Link href="/">
            <Home className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </Button>
      </div>
    </div>
  );
}
