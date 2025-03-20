import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import PortfolioManager from "../../components/admin/PortfolioManager";
import CreatorsManager from "../../components/admin/CreatorsManager";
import TestimonialsManager from "../../components/admin/TestimonialsManager";
import BookingsManager from "../../components/admin/BookingsManager";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("portfolio");
  const [, setLocation] = useLocation();

  // Check if user is logged in
  const { data, isLoading, isError } = useQuery({
    queryKey: ["auth", "me"],
    queryFn: () => apiRequest({ url: "/api/auth/me", method: "GET" }),
  });

  const handleLogout = async () => {
    try {
      await apiRequest({ url: "/api/auth/logout", method: "POST" });
      setLocation("/admin/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (isError) {
      setLocation("/admin/login");
    }
  }, [isError, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  const user = data?.user;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Admin Header */}
      <header className="bg-zinc-900 p-4 border-b border-zinc-800 sticky top-0 z-10">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold">Zyro Visuals <span className="text-yellow-500">Admin</span></h1>
            {user && <span className="text-sm bg-zinc-800 px-2 py-1 rounded-md">@{user.username}</span>}
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="outline" className="border-zinc-700 text-zinc-300" onClick={() => setLocation("/")}>
              View Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>

      {/* Admin Content */}
      <main className="container mx-auto py-6 px-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-zinc-900 border-zinc-800 p-1">
            <TabsTrigger value="portfolio" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Portfolio
            </TabsTrigger>
            <TabsTrigger value="creators" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Creators
            </TabsTrigger>
            <TabsTrigger value="testimonials" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Testimonials
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-yellow-500 data-[state=active]:text-black">
              Bookings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="portfolio" className="space-y-4">
            <PortfolioManager />
          </TabsContent>

          <TabsContent value="creators" className="space-y-4">
            <CreatorsManager />
          </TabsContent>

          <TabsContent value="testimonials" className="space-y-4">
            <TestimonialsManager />
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <BookingsManager />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}