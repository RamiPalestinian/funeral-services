"use client";

import { useCallback, useEffect, useState } from "react";
import {
  subscribeToast,
  type ToastPayload,
} from "@/shared/lib/toast";
import "./Toast.css";

const TOAST_DURATION_MS = 3500;

export default function ToastProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [toasts, setToasts] = useState<ToastPayload[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  useEffect(() => {
    return subscribeToast((toast) => {
      setToasts((prev) => [...prev, toast]);

      window.setTimeout(() => {
        removeToast(toast.id);
      }, TOAST_DURATION_MS);
    });
  }, [removeToast]);

  return (
    <>
      {children}
      <div
        className="toast-viewport"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`toast-item toast-item--${toast.type}`}
            role="status"
          >
            {toast.message}
          </div>
        ))}
      </div>
    </>
  );
}
