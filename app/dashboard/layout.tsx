import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundForUser } from "@/modules/dashboard/actions";
import { DashboardSidebar } from "@/modules/dashboard/components/dashboard-sidebar";

type SidebarPlaygroundData = {
  id: string;
  name: string;
  starred: boolean;
  icon: string;
};

type DashboardPlaygroundItem = {
  id: string;
  title: string;
  template: string;
  starMarks?: { isMarked: boolean }[];
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

    const playgroundData = await getAllPlaygroundForUser();

    console.log("playgroundData", playgroundData);

  const technologyIconMap: Record<string, string> = {
    REACT: "Zap",
    NEXTJS: "Lightbulb",
    EXPRESS: "Database",
    VUE: "Compass",
    HONO: "FlameIcon",
    ANGULAR: "Terminal",
  }
  const formattedPlaygroundData: SidebarPlaygroundData[] =
    ((playgroundData ?? []) as DashboardPlaygroundItem[]).map((item: DashboardPlaygroundItem) => ({
      id: item.id,
      name: item.title,
      starred: item.starMarks?.[0]?.isMarked ?? false,
      icon: technologyIconMap[item.template] || "Code2",
    }));


  return (

  <SidebarProvider>
    
    <div className="flex min-h-screen w-full overflow-x-hidden">
      {/* Dashboard Sidebar */}
      <DashboardSidebar initialPlaygroundData={formattedPlaygroundData}/>
      <main className="flex-1">{children}</main>
    </div>
  </SidebarProvider>
  )

}
