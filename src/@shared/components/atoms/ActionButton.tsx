import React, { useState } from "react";
import { Button } from "@mui/material";
import { ActionButtonProps } from "../../interface/components";

export const ActionButton = <T,>({
  title,
  icon,
  triggerModal: TriggerModal,
  data,
  disabled = false,
  clickFn,
  showSnackbar = true,
}: ActionButtonProps<T>) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  const handleClick = () => {
    if (clickFn) {
      clickFn();
    }
  };

  return (
    <>
      <Button
        onClick={TriggerModal ? handleOpenModal : handleClick}
        startIcon={icon}
        color="primary"
        variant="outlined"
        disabled={disabled}
        size="small"
      >
        {title}
      </Button>
      {TriggerModal && (
        <TriggerModal
          data={data as T}
          isOpen={isModalOpen}
          closeFn={handleCloseModal}
        />
      )}
    </>
  );
};
