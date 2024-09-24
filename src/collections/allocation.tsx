import { buildCollection, AdditionalFieldDelegate } from "firecms";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import AllocationModal from "../@shared/components/modals/AllocationModal";
import { ActionButton } from "../@shared/components/atoms/ActionButton";
import { Allocation } from "../@shared/interface/interfaces";

const actionsField: AdditionalFieldDelegate<Allocation> = {
    id: "actions",
    name: "Ações",
    width: 150,
    Builder: ({ entity }) => {
        return (
            <div className="collection-action-buttons-container">
                <ActionButton<{
                    equipmentId: string;
                }>
                    title="Alocar"
                    icon={<AssignmentTurnedInIcon />}
                    triggerModal={AllocationModal}
                    data={{
                        equipmentId: entity.values.equipment.id,
                    }}
                    color="primary"
                />
                {/* Adicione mais botões de ação conforme necessário */}
            </div>
        );
    }
};

export const allocationsCollection = buildCollection<Allocation>({
    path: "allocations",
    name: "Alocações",
    singularName: "Alocação",
    icon: "AssignmentTurnedIn",
    group: "Gerenciamento",
    permissions: ({ authController }) => ({
        read: true,
        create: true,
        edit: true,
        delete: true,
    }),
    properties: {
        equipment: {
            dataType: "reference",
            name: "Equipamento",
            path: "equipments",
            validation: { required: true },
        },
        client: {
            dataType: "reference",
            name: "Cliente",
            path: "clients",
            validation: { required: true },
        },
        payment_method: {
            dataType: "string",
            name: "Forma de Pagamento",
            validation: { required: true },
            enumValues: {
                credit_card: "Cartão de Crédito",
                debit_card: "Cartão de Débito",
                cash: "Dinheiro",
                bank_transfer: "Transferência Bancária",
                pix: "PIX",
            },
        },
        rental_duration: {
            dataType: "number",
            name: "Duração do Aluguel (meses)",
            validation: { required: true, min: 1 },
        },
        total_cost: {
            dataType: "number",
            name: "Custo Total",
            validation: { required: true },
        },
        allocation_date: {
            dataType: "date",
            name: "Data de Alocação",
            validation: { required: true },
        },
        // ... outras propriedades conforme necessário
    },
    additionalFields: [
        actionsField,
        // Adicione outros campos adicionais se necessário
    ],
});
