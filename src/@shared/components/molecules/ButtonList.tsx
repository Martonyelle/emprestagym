// src/@shared/components/molecules/ButtonList.tsx

import React, { useState } from "react";
import { CircularProgress, List, ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import { useSnackbarController } from "firecms";
import { SnackbarMessage } from "../../atoms/SnackbarMessage";
import { ActionButtonProps } from "../../interface/components";

interface ButtonListProps<T> {
    actions: ActionButtonProps<T>[];
}

export const ButtonList = <T,>({ actions = [] }: ButtonListProps<T>) => {
    const snackbarController = useSnackbarController();
    const [loading, setLoading] = useState(false);

    return (
        <List>
            {actions.map((action, index) => {
                const Modal: React.FC<any> = action.triggerModal || (() => (<></>));
                const [itemLoading, setItemLoading] = useState(false);
                const [openModal, setOpenModal] = useState(false);
                const now = new Date();

                const dismissModal = () => {
                    setOpenModal(false);
                }

                const clickHandler = async () => {
                    setLoading(true);
                    setItemLoading(true);

                    if (action.triggerModal) {
                        setOpenModal(true);
                        setItemLoading(false);
                        setLoading(false);
                        return;
                    }

                    if(action.clickFn){
                        try {
                            const res = await action.clickFn();
                            if (res.success && res.success === false) throw new Error(res.message || 'Falha ao executar ação');
                            if (res.success) {
                                if (action.showSnackbar) {
                                    snackbarController.open({
                                        type: 'success',
                                        message: (
                                            <SnackbarMessage
                                                title={res.message}
                                            />
                                        )
                                    })
                                }
                            }
                        } catch (error: any) {
                            if (action.showSnackbar) {
                                snackbarController.open({
                                    type: 'error',
                                    message: (
                                        <SnackbarMessage
                                            title={error.message}
                                        />
                                    )
                                })
                            }
                        }
                    }
                    
                    setItemLoading(false);
                    setLoading(false);
                }

                return (
                    <ListItem disablePadding key={`btn-list-item-${now.getTime()}-${index}`}>
                        {openModal && (
                            <Modal
                                data={action.data}
                                isOpen={openModal}
                                closeFn={dismissModal}
                            />
                        )}
                        <ListItemButton onClick={clickHandler} disabled={action.disabled || loading}>
                            {!itemLoading && (
                                <ListItemIcon>
                                    {action.icon}
                                </ListItemIcon>
                            )}
                            {itemLoading && (
                                <ListItemIcon>
                                    <CircularProgress size={24} />
                                </ListItemIcon>
                            )}
                            <ListItemText primary={action.title} />
                        </ListItemButton>
                    </ListItem>
                )
            })}
        </List>
    )
}
