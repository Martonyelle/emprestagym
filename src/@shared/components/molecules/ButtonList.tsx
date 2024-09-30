import React, { useState } from "react";
import {
  CircularProgress,
  List,
  ListItem,
  Button,
} from "@mui/material";
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
        const Modal = action.triggerModal;
        const [itemLoading, setItemLoading] = useState(false);
        const [openModal, setOpenModal] = useState(false);

        const dismissModal = () => {
          setOpenModal(false);
        };

        const clickHandler = async () => {
          setLoading(true);
          setItemLoading(true);

          if (action.triggerModal) {
            setOpenModal(true);
            setItemLoading(false);
            setLoading(false);
            return;
          }

          if (action.clickFn) {
            try {
              const res = await action.clickFn();
              if (res.success === false)
                throw new Error(res.message || "Falha ao executar ação");
              if (res.success) {
                if (action.showSnackbar) {
                  snackbarController.open({
                    type: "success",
                    message: (
                      <SnackbarMessage
                        title={
                          res.message || "Ação executada com sucesso."
                        }
                      />
                    ),
                  });
                }
              }
            } catch (error: any) {
              if (action.showSnackbar) {
                const errorMessage =
                  error instanceof Error
                    ? error.message
                    : typeof error === "string"
                    ? error
                    : "Ocorreu um erro inesperado.";
                snackbarController.open({
                  type: "error",
                  message: <SnackbarMessage title={errorMessage} />,
                });
              }
            }
          }

          setItemLoading(false);
          setLoading(false);
        };

        return (
          <ListItem disablePadding key={`btn-list-item-${index}`}>
            {openModal && Modal && (
              <Modal
                data={action.data}
                isOpen={openModal}
                closeFn={dismissModal}
              />
            )}
            <Button
              onClick={clickHandler}
              startIcon={
                itemLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  action.icon
                )
              }
              fullWidth
              sx={{ justifyContent: 'flex-start', padding: '8px 16px' }}
            >
              {action.title}
            </Button>
          </ListItem>
        );
      })}
    </List>
  );
};