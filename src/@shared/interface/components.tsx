import React from "react";

export interface ActionButtonProps<T = undefined> {
  title: string;
  icon: React.ReactNode;
  showSnackbar: boolean;
  data: T;
  triggerModal?: React.ComponentType<{ data: T; isOpen: boolean; closeFn: () => void }>;
  clickFn?: () => Promise<{ success: boolean; message?: string }>;
  color?: 'inherit' | 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning';
  onClose?: () => void;
}

