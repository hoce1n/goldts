import { Loader } from "lucide-react";
import { Button } from "./Button";

type ConfirmDialogProps = {
    open: boolean;
    title?: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
  };
  
  export default function ConfirmDialog({
    open,
    title = "تایید عملیات",
    description = "آیا مطمئن هستید؟",
    confirmText = "تایید",
    cancelText = "انصراف",
    loading = false,
    onConfirm,
    onCancel,
  }: ConfirmDialogProps) {
    if (!open) return null;
  
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-[420px] bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-lg font-semibold mb-2">{title}</h2>
  
          <p className="text-sm text-gray-600 mb-6">
            {description}
          </p>
  
          <div className="flex justify-end gap-1">
            <button
              onClick={onCancel}
              className="px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300"
            >
              {cancelText}
            </button>
  
            <Button
              onClick={onConfirm}
              disabled={loading}
              className="bg-red-600 text-white hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? <Loader className="animate-spin" /> : confirmText}
            </Button>
          </div>
        </div>
      </div>
    );
  }
  