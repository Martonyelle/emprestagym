import { EntityOnFetchProps, EntityReference, PropertyBuilder, buildCollection, buildEntityCallbacks, buildProperty } from "firecms";
import { AsaasPayment } from "../@shared/interface/asaas";


export type AsaasWebhook = {
    collection: string;
    event: string;
    event_id: string;
    payment: AsaasPayment | any;
    reference: EntityReference;
    created_at: Date;
}

const asaasWebhookCallbacks = buildEntityCallbacks({
    onFetch({
        entity        
    }: EntityOnFetchProps) : any {
        return entity;
    }
});

export const asaasWebhooksCollection = buildCollection<AsaasWebhook>({
    name: "Webhooks do Asaas",
    singularName: "Webhook do Asaas",
    path: "asaas_webhooks",
    defaultSize: 'm',
    icon: "WebhookIcon",
    group: "Desenvolvedor",
    textSearchEnabled: true,
    exportable: true,
    callbacks: asaasWebhookCallbacks,
    hideIdFromCollection: false,
    hideIdFromForm: true,
    initialSort: ["created_at", "desc"],
    permissions: ({ authController }) => ({
        read: true,
        edit: false,
        create: false,
        delete: true
    }),
    properties: {
        reference: ({ values }) => {
            const ref = values.reference;
            let property: PropertyBuilder | any;
            property = buildProperty({
                dataType: "reference",
                path: ref?.pathWithId,
                readOnly: true,
                previewProperties: ['name'],
                name: "Referencia",
            });
            return property;
        },
        collection: {
            name: "Collection",
            dataType: "string",
            validation: { required: false },
        },
        event: {
            name: "Evento do Webhook",
            validation: { required: true },
            dataType: "string"
        },
        payment: {
            name: "Dados",
            validation: { required: false },
            dataType: "map",
            keyValue: true,
            readOnly: true
        },
        event_id: {
            name: "ID do evento",
            dataType: "string",
            validation: { required: false },
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
