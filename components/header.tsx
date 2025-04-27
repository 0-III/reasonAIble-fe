"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { LogOut, Menu, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/auth-context";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image"; // 이미지 컴포넌트 추가

export function Header() {
  const pathname = usePathname();
  const { user, logout, isLoading } = useAuth();

  const navItems = [
    { name: "Generate", path: "/" },
    { name: "List", path: "/excuses" },
    { name: "Dashboard", path: "/dashboard" },
  ];

  // Render auth button based on authentication state
  const renderAuthButton = () => {
    if (isLoading) {
      return <Skeleton className="h-9 w-20" />;
    }

    if (user) {
      return (
        <Button variant="outline" size="sm" className="gap-2" onClick={logout}>
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
      );
    }

    return (
      <Button variant="outline" size="sm" asChild>
        <Link href="/login">Login</Link>
      </Button>
    );
  };

  // Render mobile auth section
  const renderMobileAuth = () => {
    if (isLoading) {
      return (
        <div className="py-4 flex justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      );
    }

    if (user) {
      return (
        <>
          <div className="py-2 text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="font-medium text-foreground">{user.email}</span>
          </div>
          <Button variant="destructive" onClick={logout} className="mt-2">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </>
      );
    }

    return (
      <Button asChild className="mt-2">
        <Link href="/login">Login</Link>
      </Button>
    );
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          {/* <Lightbulb className="h-6 w-6 text-primary" /> */}
          {/* 로고 이미지로 교체 */}
          <Link href="/">
            <Image
              src="/reasonaible-high-resolution-logo-transparent.png"
              alt="ReasonAIble Logo"
              width={150} // 로고 너비
              height={40} // 로고 높이
              priority // 로고 우선 로드
            />
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <div className="hidden md:flex gap-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  pathname === item.path
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="hidden md:flex items-center gap-2">
            {renderAuthButton()}
          </div>

          {/* Mobile Navigation */}
          <Sheet>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[250px] sm:w-[300px]">
              <nav className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    className={`text-base font-medium transition-colors hover:text-primary py-2 ${
                      pathname === item.path
                        ? "text-primary"
                        : "text-muted-foreground"
                    }`}
                  >
                    {item.name}
                  </Link>
                ))}

                <div className="h-px bg-border my-2" />

                {renderMobileAuth()}
              </nav>
            </SheetContent>
          </Sheet>

          <ModeToggle />
        </nav>
      </div>
    </header>
  );
}
