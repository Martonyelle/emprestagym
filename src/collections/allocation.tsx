import { buildCollection } from "firecms";
import { Allocation } from "../@shared/interface/interfaces";

export const allocationsCollection = buildCollection<Allocation>({
    path: "allocations",
    name: "Alocações",
    singularName: "Alocação",
    icon: "AssignmentTurnedIn",
    group: "Gerenciamento",
    hideFromNavigation:true,
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
    },
});
