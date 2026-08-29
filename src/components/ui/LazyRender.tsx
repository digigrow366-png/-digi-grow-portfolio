"use client";

import React, { useRef } from "react";
import { useInView } from "framer-motion";

export function LazyRender({ children, minHeight = "100vh" }: { children: React.ReactNode, minHeight?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "200px 0px" });

  return (
    <div ref={ref} style={{ minHeight: isInView ? "auto" : minHeight, width: "100%", height: "100%" }}>
      {isInView ? children : null}
    </div>
  );
}
