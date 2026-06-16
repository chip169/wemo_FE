import { Outlet } from "react-router";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import { SupportChatWidget } from "./components/SupportChatWidget";

export function Root() {
  return (
    <div className="min-h-screen relative">
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
      <SupportChatWidget />
    </div>
  );
}
