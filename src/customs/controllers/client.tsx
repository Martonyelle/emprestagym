import { fetchData } from "../../@shared/helpers/helpers";

/**
 * Gera um registro único para um novo cliente.
 */
export const generateRegister = async () => {
  return fetchData(
    "GET",
    "/clients/generateRegister",
    "gerar matrícula de cliente"
  );
};

/**
 * Verifica se o CPF informado já está cadastrado no sistema.
 * @param cpf - CPF a ser verificado.
 */
export const verifyCpf = async (cpf: string) => {
  const postData: any = {
    cpf: cpf,
  };

  return fetchData(
    "POST",
    "/clients/verifyCpf",
    "verificar CPF do cliente",
    postData
  );
};

/**
 * Remove uma assinatura associada a um cliente.
 * @param clientId - ID do cliente.
 * @param subscriptionId - ID da assinatura a ser removida.
 */
export const removeSubscription = async (
  clientId: string,
  subscriptionId: string
) => {
  return fetchData(
    "DELETE",
    `/clients/${clientId}/subscriptions/${subscriptionId}`,
    "remover assinatura do cliente",
    null
  );
};
