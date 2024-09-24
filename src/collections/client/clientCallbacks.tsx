import {
  buildEntityCallbacks,
  EntityOnFetchProps,
  EntityCallbacks,
} from "firecms";
import { Client } from "./client";
import Asaas from "asaas";


export const clientsCallbacks: EntityCallbacks<Client> = {
  onFetch: async ({ entity }) => {
    // Pode-se adicionar lógica de pós-carregamento aqui, se necessário
    return entity;
  },

  onPreSave: async ({ values }) => {
    // Verificar se o CPF já existe ou outras validações necessárias
    // Adicione lógica aqui se necessário antes de salvar
    return values;
  },

  onCreate: async ({ values, context, collection }) => {
    try {
      const asaasAccessToken = asaasConfig.accessToken; // Obtenha o token de acesso do Asaas

      const asaas = new Asaas({
        apiVersion: "v3",
        sandbox: asaasConfig.sandbox,
        accessToken: asaasAccessToken,
      });

      // Cria o objeto do cliente para enviar ao Asaas
      const asaasCustomerObj: AsaasCustomer = {
        name: values.name,
        cpfCnpj: values.cpf,
        email: values.email,
        phone: values.phone,
        mobilePhone: values.phone,
        externalReference: context.entityId, // Usando o ID da entidade como referência externa
        groupName: "AluguelEquipamentos",
        address: values.address.street,
        addressNumber: values.address.number,
        complement: values.address.complement,
        province: values.address.city,
        postalCode: values.address.postalCode || "", // Se disponível
      };

      // Chama a API do Asaas para criar o cliente
      const createAsaasCustomer = await asaas.createCustomer(asaasCustomerObj);

      if (createAsaasCustomer.success) {
        // Atualiza o cliente com o ID do cliente criado no Asaas
        await context.dataSource.updateEntity<Client>({
          path: collection.path,
          id: context.entityId!,
          values: {
            ...values,
            asaas_customer_id: createAsaasCustomer.data.id,
          },
        });
      } else {
        throw new Error(
          `Erro ao criar cliente no Asaas: ${JSON.stringify(
            createAsaasCustomer.data
          )}`
        );
      }
    } catch (error) {
      console.error("Erro ao criar cliente no Asaas:", error);
      throw error; // Propaga o erro para ser exibido na interface
    }
  },

  onDelete: async ({ entity }) => {
    try {
      if (entity.values.asaas_customer_id) {
        const asaasAccessToken = asaasConfig.accessToken;

        const asaas = new Asaas({
          apiVersion: "v3",
          sandbox: asaasConfig.sandbox,
          accessToken: asaasAccessToken,
        });

        const deleteAsaasCustomer = await asaas.deleteCustomer(
          entity.values.asaas_customer_id
        );

        if (!deleteAsaasCustomer.success) {
          console.error(
            `Erro ao deletar cliente no Asaas: ${JSON.stringify(
              deleteAsaasCustomer.data
            )}`
          );
          // Você pode optar por não lançar um erro aqui, para não impedir a exclusão no Firestore
        }
      }
    } catch (error) {
      console.error("Erro ao deletar cliente no Asaas:", error);
      // Você pode optar por não lançar um erro aqui, para não impedir a exclusão no Firestore
    }
  },
};
