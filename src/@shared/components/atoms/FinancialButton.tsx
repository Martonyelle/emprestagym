import React, { useState } from "react";
import {
  IconButton,
  Popover,
} from "@mui/material";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { ActionButtonProps } from "../../interface/components";
import { ButtonList } from "../molecules/ButtonList";
import AllocationModal from "../modals/AllocationModal";

// Defina o tipo para os dados que serão passados
interface AllocationData {
  equipmentId: string;
}

interface EquipmentAllocationButtonProps {
  equipmentId: string;
}

export const EquipmentAllocationButton: React.FC<EquipmentAllocationButtonProps> = ({
  equipmentId,
}) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);

  const expandOptions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseOptions = () => {
    setAnchorEl(null);
  };

  const openOptions = Boolean(anchorEl);
  const popoverId = openOptions ? "options-popover" : undefined;

  // Especifique o tipo genérico correto para ActionButtonProps
  const actions: ActionButtonProps<AllocationData>[] = [
    {
      title: "Alocar Equipamento",
      icon: <AssignmentTurnedInIcon />,
      showSnackbar: false,
      data: {
        equipmentId: equipmentId,
      },
      triggerModal: AllocationModal,
    },
  ];

  return (
    <>
      <IconButton
        color="primary"
        onClick={expandOptions}
        edge="end"
        aria-label="allocate"
      >
        <AssignmentIcon />
      </IconButton>
      <Popover
        id={popoverId}
        open={openOptions}
        anchorEl={anchorEl}
        onClose={handleCloseOptions}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ButtonList actions={actions} />
      </Popover>
    </>
  );
};
