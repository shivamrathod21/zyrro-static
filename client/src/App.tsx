import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import AdminDashboard from "@/pages/admin";
import AdminLogin from "@/pages/admin/login";
import TestPage from "@/pages/test";
import SEO from "@/components/SEO";

// Define routes with their SEO properties
const routes = [
  {
    path: "/",
    component: Home,
    seo: {
      title: "Zyro Visuals - Premium Gaming Video Editing Services",
      description: "Professional video editing services for gaming content creators. Elevate your gaming content with stunning visual effects, transitions, and cinematics."
    }
  },
  {
    path: "/test",
    component: TestPage,
    seo: {
      title: "Test Page - Zyro Visuals",
      description: "Test page for Zyro Visuals video editing services."
    }
  },
  {
    path: "/admin",
    component: AdminDashboard,
    seo: {
      title: "Admin Dashboard - Zyro Visuals",
      description: "Admin dashboard for Zyro Visuals content management."
    }
  },
  {
    path: "/admin/login",
    component: AdminLogin,
    seo: {
      title: "Admin Login - Zyro Visuals",
      description: "Login to access the Zyro Visuals admin dashboard."
    }
  }
];

function Router() {
  return (
    <Switch>
      {routes.map(({ path, component, seo }) => (
        <Route key={path} path={path} component={component} />
      ))}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {/* Default SEO that applies to all pages */}
      <SEO />
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
