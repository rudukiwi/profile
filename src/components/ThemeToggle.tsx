"use client";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => setDark(document.documentElement.dataset.theme === "dark"), []);
  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? "dark" : "light";
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch { /* bỏ qua */ }
  };
  return <button onClick={toggle} className="text-mute hover:text-paper" aria-label="Đổi giao diện sáng hoặc tối">{dark ? "Sáng" : "Tối"}</button>;
}
