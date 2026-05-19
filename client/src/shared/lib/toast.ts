export type ToastType = "success" | "error" | "info";

export type ToastPayload = {
  id: string;
  message: string;
  type: ToastType;
};

type ToastListener = (toast: ToastPayload) => void;

const listeners = new Set<ToastListener>();

export function subscribeToast(listener: ToastListener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function showToast(message: string, type: ToastType = "success") {
  const toast: ToastPayload = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    message,
    type,
  };

  listeners.forEach((listener) => listener(toast));
}
