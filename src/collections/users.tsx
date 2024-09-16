import { EntityReference, buildCollection, FieldProps } from "firecms";
import CustomPhoneField from "../@shared/atoms/CustomPhoneField";


export type User = {
    name: string;
    email: string;
    phone: string;
    status: string;
    roles: Array<string>;
    asaas?: any;
    created_at: Date;
}

export enum UserType {
    DOCTOR = "doctor",
    PATIENT = "client",
    MANAGER = "manager",
}

export const usersCollection = buildCollection<User>({
    name: "Usuários",
    singularName: "Usuário",
    path: "users",
    icon: "Group",
    group: "Administrador",
    permissions: ({ authController }) => ({
        // TO-DO: Implementar permissoes ADMIN/GERENTE
        read: true,
        edit: true,
        create: true,
        delete: true
    }),
    properties: {
        name: {
            name: "Nome",
            validation: { required: true },
            dataType: "string"
        },
        email: {
            name: "Email",
            validation: { required: true, unique: true },
            dataType: "string"
        },
        phone: {
            name: "Telefone",
            validation: { required: false },
            dataType: "string",
            Field: CustomPhoneField
        },
        status: {
            name: "Status",
            validation: { required: true },
            dataType: "string",
            description: "Plano Ativo",
            enumValues: {
                active: "Ativo",
                inactive: "Inativo"
            }
        },
        roles: {
            name: "Permissões",
            validation: { required: true },
            dataType: "array",
            description: "Permissões de acesso do usuário",
            of: {
                dataType: "string",
                enumValues: {
                    developer: { id: 'developer', label: 'Desenvolvedor', color: 'redDarker' },
                    admin: { id: 'admin', label: 'Administrador', color: 'blueLight' },
                    manager: { id: 'manager', label: 'Gestor', color: 'tealLighter' },
                    client: { id: 'client', label: 'Cliente', color: 'grayLighter' },
                    beta: { id: 'beta', label: 'Beta', color: 'greenDarker' },
                }
            }
        },
        asaas: {
            dataType: "map",
            name: "Asaas",
            keyValue: true,
            readOnly: true
        },
        created_at: {
            name: "Data de Criação",
            validation: {
                required: false,
            },
            dataType: "date",
            readOnly: true,
            autoValue: "on_create",
            defaultValue: new Date(),
        },
    }
});
