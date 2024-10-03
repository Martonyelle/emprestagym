import {
  buildCollection,
  AdditionalFieldDelegate,
} from "firecms";
import { brStatesEnum } from "../../@shared/enums/component";
import { CreditCardTokenPreview } from "../../@shared/components/credicard-token/CrediCardTokenPreview";

export type Client = {
  cpf: string;
  name: string;
  phone: string;
  email: string;
  address: {
    state: string;
    city: string;
    street: string;
    number: string;
    complement?: string;
    postalCode?: string;
  };
  status: string;
  credit_card?: {
    brand: string;
    maskedNumber: string;
  };
  config?: any;
  asaas_customer_id?: string;
};

const cardsField: AdditionalFieldDelegate<Client> = {
  id: "cards",
  name: "Cartão Salvo",
  width: 200,
  Builder: ({ entity }) => {
    return (
      <CreditCardTokenPreview
        brand={entity.values.credit_card?.brand || ''}
        number={entity.values.credit_card?.maskedNumber}
      />
    );
  }
};

export const clientsCollection = buildCollection<Client>({
  name: "Clientes",
  singularName: "Cliente",
  path: "clients",
  icon: "Person",
  group: "Gerenciamento",
  permissions: ({ authController }) => ({
    read: true,
    edit: true,
    create: true,
    delete: true,
  }),
  properties: {
    cpf: {
      name: "CPF/CNPJ",
      validation: { required: true },
      dataType: "string",
    },
    name: {
      name: "Nome",
      validation: { required: true },
      dataType: "string",
    },
    phone: {
      name: "Telefone",
      validation: { required: true },
      dataType: "string",
    },
    email: {
      name: "E-mail",
      validation: { required: true },
      dataType: "string",
    },
    address: {
      dataType: "map",
      name: "Endereço",
      properties: {
        state: {
          dataType: "string",
          name: "Estado",
          validation: { required: true },
          enumValues: brStatesEnum,
        },
        city: {
          dataType: "string",
          name: "Cidade",
          validation: { required: true },
        },
        street: {
          dataType: "string",
          name: "Rua",
          validation: { required: true },
        },
        number: {
          dataType: "string",
          name: "Número",
          validation: { required: true },
        },
        complement: {
          dataType: "string",
          name: "Complemento",
          validation: { required: false },
        },
        postalCode: {
          dataType: "string",
          name: "CEP",
          validation: { required: false },
        },
      },
    },
    status: {
      name: "Status",
      validation: { required: true },
      dataType: "string",
      enumValues: {
        active: "Ativo",
        inactive: "Inativo",
      },
    },
    credit_card: {
      name: "Cartão de Crédito",
      dataType: "map",
      properties: {
        brand: {
          name: "Bandeira",
          validation: { required: true },
          dataType: "string",
        },
        maskedNumber: {
          name: "Número do Cartão",
          validation: { required: true },
          dataType: "string",
        },
      },
    },
    asaas_customer_id: {
      name: "ID do Cliente no Asaas",
      dataType: "string",
      readOnly: true,
      disabled: true,
    },
  },
  additionalFields: [
    cardsField,
  ],
});
