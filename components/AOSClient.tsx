"use client";

import { useEffect } from "react";
import AOS from "aos";

export default function AOSClient() {
  useEffect(() => {
    AOS.init({ duration: 700, easing: "ease-out", once: true, offset: 80 });
  }, []);
  return null;
}
