import { toast as sonnerToast } from "sonner";

export interface ToastProps {
  title?: string;
  description?: string;
  variant?: "default" | "destructive";
  duration?: number;
}

export function useToast() {
  const toast = ({ title, description, variant, duration }: ToastProps) => {
    const hasMultipleLines = description && description.includes('\n');
    const effectiveDuration = duration || (hasMultipleLines ? 6000 : 4000);

    if (variant === "destructive") {
      sonnerToast.error(title || "Error", {
        description,
        duration: effectiveDuration,
        style: { whiteSpace: 'pre-line' },
      });
    } else {
      sonnerToast.success(title || "Success", {
        description,
        duration: effectiveDuration,
        style: { whiteSpace: 'pre-line' },
      });
    }
  };

  return { toast };
}
