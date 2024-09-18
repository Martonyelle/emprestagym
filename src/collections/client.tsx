import { buildCollection, EntityReference } from "firecms";
import { brStatesEnum } from "../@shared/enums/component";

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
    complement: string;
  };
  status: string;
  config: any;
};

export const clientsCollection = buildCollection<Client>({
  name: "Clients",
  singularName: "Client",
  path: "clients",
  icon: "Badge",
  group: "Manager",
  permissions: ({}) => ({
    read: true,
    edit: true,
    create: true,
    delete: true
}),
  properties: {
    cpf: {
      name: "Identificador",
      validation: { required: true },
      dataType: "string"
    },
    name: {
      name: "Nome",
      validation: { required: true },
      dataType: "string"
    },
    phone: {
      name: "Telefone",
      validation: { required: true },
      dataType: "string"
    },
    email: {
      name: "E-mail",
      validation: { required: true },
      dataType: "string"
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
      },
    },
    status: {
      name: "Status",
      validation: { required: true },
      dataType: "string",
      enumValues: {
        active: "Ativo",
        inactive: "Inativo"
      }
    },
    config: {
      name: "Configurações",
      validation: { required: true },
      dataType: "string",
    }
  },
});