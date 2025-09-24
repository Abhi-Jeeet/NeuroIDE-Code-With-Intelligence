import { SidebarProvider } from "@/components/ui/sidebar";
import { getAllPlaygroundsForUser } from "@/features/dashboard/actions";
import DashboardSidebar from "@/features/dashboard/components/dashboard-sidebar";
import React from "react";

type PlaygroundWithRelations = {
    id: string;
    title: string;
    description: string | null;
    template: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    user: {
        id: string;
        name: string | null;
        email: string;
        image: string | null;
        role: string;
        createdAt: Date;
        updatedAt: Date;
    };
    Starmark: Array<{
        id: string;
        userId: string;
        playgroundId: string;
        isMarked: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
};

export default async function DashboardLayout({children}:{children:React.ReactNode}){

    const playgroundData: PlaygroundWithRelations[] | null = await getAllPlaygroundsForUser();
    const technologyIconMap: Record<string, string>={
        REACT:"zap",
        NEXTJS:"Lightbulb",
        EXPRESS:"Database",
        VUE:"Compass",
        HONO:"FlameIcon",
        ANGULAR:"Terminal"
    }
const formattedPlayGroundData = (playgroundData as PlaygroundWithRelations[])?.map((playground)=>({
    id:playground.id,
    name: playground.title,
    starred:playground.Starmark?.[0]?.isMarked || false,
    icon:technologyIconMap[playground.template] || "Code2",

})) || []

    return(
        <SidebarProvider>
            <div className="flex min-h-screen w-full overflow-x-hidden">
                <DashboardSidebar initialPlaygroundData={formattedPlayGroundData}/>
                <main className="flex-1">{children}</main>

            </div>
        </SidebarProvider>
    )
}