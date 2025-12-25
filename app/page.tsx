import Link from "next/link";
import { ThemeToggle } from "@/components/web/theme-toggle";
import { buttonVariants } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex w-full justify-around">
      <Link href="/login" className={buttonVariants()}>
        Login
      </Link>
      <Link href="/sign-up" className={buttonVariants()}>
        Sign up
      </Link>
      <ThemeToggle />
    </div>
  );
}
