import { buildCollection, buildProperty, EntityReference } from "firecms";

export type Allocation = {
    client: EntityReference;
    equipments: EntityReference[];
    rental_period: {
        start_date: Date;
        end_date: Date;
    };
    rental_price: number;
    payment_method: string;
    delivery_date: Date;
    return_date: Date;
    delivery_condition: string;
    return_condition: string;
};

export const allocationsCollection = buildCollection<Allocation>({
    name: "Alocações",
    singularName: "Alocação",
    path: "alocacoes",
    icon: "Schedule",
    group: "Gestão de Aluguéis",
    permissions: ({}) => ({
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        client: {
            name: "Cliente",
            validation: { required: true },
            dataType: "reference",
            path: "clients",
            description: "Cliente alocado para o aluguel dos equipamentos"
        },
        equipments: {
            name: "Equipamentos",
            validation: { required: true },
            dataType: "array",
            description: "Lista de equipamentos alocados para o cliente",
            of: {
                dataType: "reference",
                path: "equipments"
            }
        },
        rental_period: {
            name: "Período de Aluguel",
            dataType: "map",
            properties: {
                start_date: {
                    name: "Data de Início",
                    dataType: "date",
                    validation: { required: true }
                },
                end_date: {
                    name: "Data de Término",
                    dataType: "date",
                    validation: { required: true }
                }
            },
            description: "Período no qual os equipamentos serão alugados"
        },
        rental_price: {
            name: "Preço do Aluguel",
            validation: {
                required: true,
                min: 0
            },
            dataType: "number",
            description: "Valor total do aluguel para o período"
        },
        payment_method: {
            name: "Método de Pagamento",
            validation: { required: true },
            dataType: "string",
            enumValues: {
                credit_card: "Cartão de Crédito",
                debit_card: "Cartão de Débito",
                bank_transfer: "Transferência Bancária",
                cash: "Dinheiro"
            },
            description: "Método de pagamento escolhido pelo cliente"
        },
        delivery_date: {
            name: "Data de Entrega",
            dataType: "date",
            validation: { required: true },
            description: "Data em que os equipamentos foram entregues"
        },
        return_date: {
            name: "Data de Devolução",
            dataType: "date",
            validation: { required: true },
            description: "Data em que os equipamentos foram devolvidos"
        },
        delivery_condition: {
            name: "Condição na Entrega",
            dataType: "string",
            validation: { required: true },
            enumValues: {
                excellent: "Excelente",
                good: "Boa",
                poor: "Ruim"
            },
            description: "Condição dos equipamentos no momento da entrega"
        },
        return_condition: {
            name: "Condição na Devolução",
            dataType: "string",
            validation: { required: true },
            enumValues: {
                excellent: "Excelente",
                good: "Boa",
                poor: "Ruim"
            },
            description: "Condição dos equipamentos no momento da devolução"
        }
    }
});
