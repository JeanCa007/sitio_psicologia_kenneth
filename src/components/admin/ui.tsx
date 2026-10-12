import { type ReactNode, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from "react";

export const adminInputClass =
  "w-full rounded-md border border-background-300/70 bg-background-50 px-3.5 py-2.5 text-sm text-foreground-900 placeholder:text-foreground-400 focus:border-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-200";

export function AdminPageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
      <div>
        <h1 className="font-heading text-2xl md:text-3xl font-semibold text-foreground-950">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-foreground-600 max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-lg border border-background-200/80 bg-background-50 ${className}`}>
      {children}
    </div>
  );
}

export function Field({
  label,
  children,
  hint,
  className = "",
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-sm font-semibold text-foreground-800 mb-1.5">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-xs text-foreground-400">{hint}</span>}
    </label>
  );
}

export function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={`${adminInputClass} ${props.className ?? ""}`} />;
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${adminInputClass} resize-none ${props.className ?? ""}`} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select {...props} className={`${adminInputClass} ${props.className ?? ""}`} />;
}

export function Toggle({
  checked,
  onChange,
  label,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="inline-flex items-center gap-3 cursor-pointer"
    >
      <span
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? "bg-primary-500" : "bg-background-300"
        }`}
      >
        <span
          className={`absolute top-0.5 w-5 h-5 rounded-full bg-background-50 transition-all ${
            checked ? "left-[22px]" : "left-0.5"
          }`}
        />
      </span>
      <span className="text-sm font-medium text-foreground-800">{label}</span>
    </button>
  );
}

export function Modal({
  open,
  title,
  onClose,
  children,
  footer,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center bg-foreground-950/50 p-3 md:p-6 overflow-y-auto">
      <div className="w-full max-w-2xl my-4 md:my-8 rounded-lg bg-background-50 border border-background-200/80">
        <div className="flex items-center justify-between gap-4 border-b border-background-200/80 px-5 py-4">
          <h3 className="font-heading text-lg font-semibold text-foreground-950">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center rounded-md text-foreground-600 hover:bg-background-100 cursor-pointer"
            aria-label="close"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>
        <div className="px-5 py-5 max-h-[70vh] overflow-y-auto">{children}</div>
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 border-t border-background-200/80 px-5 py-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

export function ConfirmDialog({
  open,
  title,
  text,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  text: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center bg-foreground-950/50 p-4">
      <div className="w-full max-w-md rounded-lg bg-background-50 border border-background-200/80 p-6 text-center">
        <span className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-accent-100 text-accent-700 text-2xl">
          <i className="ri-error-warning-line" />
        </span>
        <h3 className="mt-4 font-heading text-lg font-semibold text-foreground-950">{title}</h3>
        <p className="mt-2 text-sm text-foreground-600">{text}</p>
        <div className="mt-6 flex flex-col-reverse sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-md border border-background-300 px-5 py-2.5 text-sm font-semibold text-foreground-700 hover:bg-background-100 cursor-pointer whitespace-nowrap"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-md bg-accent-500 px-5 py-2.5 text-sm font-semibold text-background-50 hover:bg-accent-600 cursor-pointer whitespace-nowrap"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ text, icon = "ri-inbox-line" }: { text: string; icon?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-14 text-center">
      <span className="w-14 h-14 flex items-center justify-center rounded-full bg-background-100 text-foreground-400 text-2xl">
        <i className={icon} />
      </span>
      <p className="mt-4 text-sm text-foreground-500 max-w-sm">{text}</p>
    </div>
  );
}

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="fixed bottom-5 right-5 z-[120] flex items-center gap-3 rounded-md bg-primary-950 px-4 py-3 text-sm text-background-50">
      <i className="ri-checkbox-circle-line text-lg text-accent-300" />
      <span>{message}</span>
      <button type="button" onClick={onClose} className="text-background-300 hover:text-background-50 cursor-pointer">
        <i className="ri-close-line" />
      </button>
    </div>
  );
}