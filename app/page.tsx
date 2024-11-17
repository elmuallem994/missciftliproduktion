"use client";

import Categories from "./components/Categories";
import Featured from "./components/Featured";
import Offer from "./components/Offer";
import Slider from "./components/Slider";
import OrderStatusBar from "@/components/OrderStatusBar";
import VideoSection from "./components/VideoSection";

export default function Home() {
  return (
    <main className="specific-section overflow-auto">
      <Slider />
      <VideoSection />
      <Categories />
      <Featured />
      <Offer />
      <OrderStatusBar />
    </main>
  );
}
