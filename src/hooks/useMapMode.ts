import { useState, useCallback } from "react";

type Mode = "area" | "radius" | null;

export const useMapMode = () => {
  const [mode, setMode] = useState<Mode>("area");

  const handleModeChange = useCallback((newMode: Mode) => {
    setMode(newMode);
  }, []);

  return { mode, handleModeChange };
};
