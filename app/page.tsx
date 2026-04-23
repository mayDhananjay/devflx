import { auth } from "@/auth";
import { UserButton } from "@/modules/auth/components/user-button";
import { LogoutButton } from "@/modules/auth/components/logout-button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          {session?.user && <UserButton user={session.user} />}
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Welcome, {session?.user?.name || "User"}!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Email:</span> {session?.user?.email}
              </p>
              <p className="text-sm text-muted-foreground">
                <span className="font-medium">Role:</span> {session?.user?.role}
              </p>
            </div>
            <div className="pt-4">
              <LogoutButton />
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
