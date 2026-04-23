"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const handleSignOut = () => {
    signOut({ callbackUrl: "/auth/sign-in" });
  };

  return (
    <Button variant="outline" onClick={handleSignOut} className="gap-2">
      <LogOut className="h-4 w-4" />
      Sign Out
    </Button>
  );
}
