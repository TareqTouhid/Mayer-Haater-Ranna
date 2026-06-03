"use client";

import { Suspense } from "react";
import RecommendationContent from "./RecommendationContent";

export default function RecommendationPage() {
  return (
    <Suspense fallback={<LoadingState />}>
      <RecommendationContent />
    </Suspense>
  );
}

function LoadingState() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center" style={{ background: "var(--bg)" }}>
      <p className="bn text-xl animate-pulse-soft" style={{ color: "var(--muted)" }}>
        খুঁজছি...
      </p>
    </div>
  );
}
