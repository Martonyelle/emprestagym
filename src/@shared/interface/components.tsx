import React from "react";

export interface ActionButtonProps<T = undefined> {
    disabled: boolean;
    title: string;
    icon: React.ReactNode;
    showSnackbar: boolean;
    data: T;
    triggerModal?: React.ComponentType<T & { isOpen: boolean; closeFn: () => void }>;
    clickFn?: () => Promise<{ success: boolean; message?: string }>;
}
