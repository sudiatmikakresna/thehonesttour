import Image from "next/image";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  name: string;
  email: string;
  picture: string;
}

interface HeaderProps {
  user: User | null;
  openLoginModal: () => void;
  logout: () => void;
}

export function Header({ user, openLoginModal, logout }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/60 shadow-sm">
      <div className="container mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 -ml-4">
            <Image
              src="/logo.png"
              alt="Bali Honest Tour"
              width={180}
              height={60}
              className="h-16 w-auto"
              priority
            />
            <div className="flex flex-col">
              <h1 className="text-xl font-bold text-[#41787D]">Bali Honest Tour</h1>
              <p className="text-xs text-[#1F4F53]">Discover Bali with Heart and Honesty</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <Image
                    src={user.picture}
                    alt={user.name}
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-full"
                  />
                  <span className="hidden md:inline text-sm font-medium">
                    {user.name}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="text-xs"
                >
                  Logout
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2"
                onClick={openLoginModal}
              >
                <User className="w-4 h-4" />
                <span className="hidden md:inline">Login</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
