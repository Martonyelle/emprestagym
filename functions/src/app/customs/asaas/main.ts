import {asaasConfig} from "../../../config/config";
import {handleErrorNoRes} from "../../helpers/errorHandler";
import {request, requestBuffer} from "../../helpers/httpsClient";

// Interfaces
import {
  AsaasCCHolderInfo,
  AsaasConstructor,
  AsaasCreditCard,
  AsaasCustomer,
  AsaasPayment,
  AsaasPaymentStatisticsQueryParams,
  AsaasSubAccount,
  AsaasSubscription,
  AsaasSubscriptionCC,
  AsaasSubscriptionPaymentbookQueryParams,
  AsaasSubscriptionQueryParams,
} from "./interfaces";

/**
 * Classe padrão do Asaas
 */
export class Asaas {
  private apiVersion = "v3"; // USAR Versao 3 como padrao
  private apiUrl = `https://api.asaas.com/${this.apiVersion}/`;
  private accessToken: string = asaasConfig.accessToken;

  /**
   * Construtor da classe
   * @param {AsaasConstructor} options Parametros de construcao da classe
   */
  constructor(options?: AsaasConstructor) {
    if (options?.apiVersion) {
      this.apiVersion = options?.apiVersion;
    }

    if (options?.sandbox) {
      this.apiUrl = `https://sandbox.asaas.com/api/${this.apiVersion}/`;
    }

    if (options?.accessToken) {
      this.accessToken = options.accessToken;
    }
  }

  /**
   * Retorna os headers padrão
   * @return {any}
   */
  private getHeaders() {
    return {
      "accept": "application/json",
      "content-type": "application/json",
      "access_token": this.accessToken,
    };
  }

  /**
     * -------------------------------------------
     * COBRANÇAS
     * -------------------------------------------
     */
  /**
     * Cria uma cobrança
     * @param {AsaasPayment} paymentData Dados da cobrança
     * @return {Promise<any>}
     */
  createPayment = async (paymentData: AsaasPayment) => {
    try {
      if (!paymentData) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça os dados corretos para gerar a cobrança",
        };
        throw err;
      }

      const url = this.apiUrl + "/payments";
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
   * Atualiza um pagamento
   * @param {string} paymentId Id do pagamento
   * @param {AsaasPayment} paymentData Dados do pagamento
   * @return {Promise<any>}
   */
  updatePayment = async (paymentId: string, paymentData: AsaasPayment) => {
    try {
      if (!paymentId || !paymentData) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça os dados corretos para alterar a cobrança",
        };
        throw err;
      }

      const url = this.apiUrl + `payments/${paymentId}`;
      const options = {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * -------------------------------------------
     * ASSINATURAS
     * -------------------------------------------
     */
  /**
     * Verifica se a assinatura está ativa
     * @param {string} subscriptionId Id da assinatura no Asaas
     * @return {Promise<any>}
     */
  isSubscriptionActive = async (subscriptionId: string) => {
    try {
      if (!subscriptionId) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça o Id da assinatura",
        };
        throw err;
      }

      const url = this.apiUrl + "/subscriptions/" + subscriptionId;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Cria uma nova assinatura no Asaas
     * @param {AsaasSubscription} subscriptionData Dados da assinatura
     * @return {Promise<any>}
     */
  generateSubscription = async (subscriptionData: AsaasSubscription) => {
    try {
      if (!subscriptionData.customer || !subscriptionData.billingType || !subscriptionData.value || !subscriptionData.nextDueDate) {
        const err: Error = {
          name: "missingParams",
          message: "Preencha todos os campos obrigatórios para criar uma Assinatura",
        };
        throw err;
      }

      const url = this.apiUrl + "/subscriptions";
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(subscriptionData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Cria uma nova assinatura no Asaas com Cartão de crédito
     * @param {AsaasSubscriptionCC} subscriptionData Dados da assinatura
     * @return {Promise<any>}
     */
  generateSubscriptionCC = async (subscriptionData: AsaasSubscriptionCC) => {
    try {
      if (!subscriptionData.customer ||
        !subscriptionData.billingType ||
        !subscriptionData.value ||
        !subscriptionData.nextDueDate ||
        !subscriptionData.creditCard ||
        !subscriptionData.creditCardHolderInfo) {
        const err: Error = {
          name: "missingParams",
          message: "Preencha todos os campos obrigatórios para criar uma Assinatura com cartão de crédito",
        };
        throw err;
      }

      const url = this.apiUrl + "/subscriptions";
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(subscriptionData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Deleta uma assinatura existente.
     * @param {string} subscriptionId ID da assinatura
     * @return {Promise<any>}
     */
  deleteSubscription = async (subscriptionId: string) => {
    try {
      const url = this.apiUrl + `subscriptions/${subscriptionId}`;
      const options = {
        method: "DELETE",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Atualiza uma assinatura existente.
     * @param {string} subscriptionId ID da assinatura
     * @param {AsaasSubscription} subscriptionData dados da assinatura
     * @return {Promise<any>}
     */
  updateSubscription = async (subscriptionId: string, subscriptionData: AsaasSubscription | AsaasSubscriptionCC) => {
    try {
      const url = this.apiUrl + `subscriptions/${subscriptionId}`;
      const options = {
        method: "PUT",
        headers: this.getHeaders(),
        body: JSON.stringify(subscriptionData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Retorna os pagamentos de uma assinatura
     * @param {string} subscriptionId ID da assinatura
     * @return {Promise<any>}
     */
  getSubscriptionPayments = async (subscriptionId: string) => {
    try {
      const url = this.apiUrl + `subscriptions/${subscriptionId}/payments`;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Cria configuração para emissão de notas fiscais para assinaturas.
     * @param {any} invoiceConfig Dados da configuração da nota fiscal
     * @return {Promise<any>}
     */
  createInvoiceConfig = async (invoiceConfig: any) => {
    try {
      // Substitua 'any' por um tipo mais específico conforme necessário
      const url = this.apiUrl + "invoiceConfig"; // Substitua pela URL correta da API
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(invoiceConfig), // Adapte os dados conforme a API
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
    * Busca dados de assinatura.
    * @param {AsaasSubscriptionQueryParams} subscriptionQueryParams Filtros de busca
    * @return {Promise<any>}
    */
  getSubscriptionData = async (subscriptionQueryParams: AsaasSubscriptionQueryParams) => {
    try {
      const queryParams = Object.entries(subscriptionQueryParams).map((param) => (`${param[0]}=${param[1]}`)).join("&");
      const url = this.apiUrl + `subscriptions?${queryParams}`;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };
      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
    * Gera carnê pra uma assinatura.
    * @param {string} subscriptionId Id da assinatura
    * @param {AsaasSubscriptionPaymentbookQueryParams} paymentbookQueryParams Filtros de busca
    * @return {Promise<any>}
    */
  getSubscriptionPaymentbook = async (subscriptionId: string, paymentbookQueryParams: AsaasSubscriptionPaymentbookQueryParams) => {
    try {
      const queryParams = Object.entries(paymentbookQueryParams).map((param) => (`${param[0]}=${param[1]}`)).join("&");
      const url = this.apiUrl + `subscriptions/${subscriptionId}/paymentBook?${queryParams}`;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };
      const res: any = await requestBuffer(url, options);

      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * -------------------------------------------
     * CLIENTES
     * -------------------------------------------
     */
  /**
     * Cria um novo cliente no Asaas
     * @param {AsaasCustomer} customerData Dados do Cliente
     * @return {Promise<any>}
     */
  createCustomer = async (customerData: AsaasCustomer) => {
    try {
      if (!customerData.name || !customerData.cpfCnpj) {
        const err: Error = {
          name: "missingParams",
          message: "Preencha todos os campos obrigatórios para criar um Cliente",
        };
        throw err;
      }

      const url = this.apiUrl + "customers";
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(customerData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Cria um novo cliente no Asaas
     * @param {string} customerId Id do Cliente
     * @return {Promise<any>}
     */
  deleteCustomer = async (customerId: string) => {
    try {
      if (!customerId) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça o id do cliente",
        };
        throw err;
      }

      const url = this.apiUrl + "customers/" + customerId;
      const options = {
        method: "DELETE",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Busca dados de um cliente
     * @param {string} customerId Id do Cliente
     * @return {Promise<any>}
     */
  getCustomerData = async (customerId: string) => {
    try {
      if (!customerId) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça o id do cliente",
        };
        throw err;
      }

      const url = this.apiUrl +"customers/"+ customerId;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  // https://sandbox.asaas.com/api/v3/accounts
  /**
     * Cria um novo cliente no Asaas
     * @param {AsaasSubAccount} subAccount Dados do Cliente
     * @return {Promise<any>}
     */
  createSubAccount = async (subAccount: AsaasSubAccount) => {
    try {
      if (!subAccount.name ||
        !subAccount.email ||
        !subAccount.cpfCnpj ||
        !subAccount.mobilePhone ||
        !subAccount.address ||
        !subAccount.addressNumber ||
        !subAccount.province ||
        !subAccount.postalCode) {
        const err: Error = {
          name: "missingParams",
          message: "Preencha todos os campos obrigatórios para criar uma Subconta",
        };
        throw err;
      }

      const url = this.apiUrl + "accounts";
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(subAccount),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * -------------------------------------------
     * PAGAMENTOS
     * -------------------------------------------
     */
  /**
     * Lista as cobranças.
     * @return {Promise<any>}
     */
  listPayments = async () => {
    try {
      const url = this.apiUrl + "payments";
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Gera QR Code estático (PIX).
     * @param {string} paymentId Id do pagamento para gerar o QR Code
     * @return {Promise<any>}
     */
  generatePixQrCode = async (paymentId: string) => {
    try {
      if (!paymentId) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça o Id do pagamento",
        };
        throw err;
      }

      const url = this.apiUrl + `payments/${paymentId}/pixQrCode`;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Tokeniza um cartão de crédito.
     * @param {string} customerId Id do customer
     * @param {AsaasCreditCard} cardData Dados do cartão de crédito
     * @param {AsaasCCHolderInfo} holderInfo informacoes do titular
     * @param {string} remoteIp endereco ip
     * @return {Promise<any>}
     */
  tokenizeCreditCard = async (customerId: string, cardData: AsaasCreditCard, holderInfo: AsaasCCHolderInfo, remoteIp: string) => {
    try {
      if (!cardData.ccv ||
                !cardData.expiryMonth ||
                !cardData.expiryYear ||
                !cardData.holderName ||
                !cardData.number ||
                !customerId ||
                !holderInfo ||
                !remoteIp
      ) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça todos os dados para tokenizar um cartão",
        };
        throw err;
      }

      const tokenData = {
        customer: customerId,
        creditCard: cardData,
        creditCardHolderInfo: holderInfo,
        remoteIp: remoteIp,
      };

      const url = this.apiUrl + "creditCard/tokenize";
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(tokenData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Receber um pagamento em dinheiro.
     * @param {string} paymentId Id da cobrança
     * @param {number} value Valor do Pagamento
     * @param {Date} date Data do pagamento
     * @param {boolean} notify (OPCIONAL) Deve notificar o cliente? Default: true
     * @return {Promise<any>}
     */
  receiveCashPayment = async (paymentId: string, value: number, date?: Date, notify = true) => {
    try {
      if (!paymentId || !value) {
        const err: Error = {
          name: "missingParams",
          message: "Forneça todos os dados para registrar um pagamento em dinheiro",
        };
        throw err;
      }
      const paymentData = {
        paymentDate: date ? date.toISOString() : new Date().toISOString(),
        value: value,
        notify: notify,
      };

      const url = this.apiUrl + `payments/${paymentId}/receiveInCash`;
      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(paymentData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Recupera o extrato para um dado período de tempo.
     * @param {string} startDate Data de início
     * @param {string} endDate Data de fim
     * @param {number} offset Offset de busca
     * @return {Promise<any>}
     */
  retrieveStatement = async (startDate: string, endDate: string, offset = 0) => {
    try {
      const url = this.apiUrl + `financialTransactions?startDate=${startDate}&finishDate=${endDate}&offset=${offset}`;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * https://docs.asaas.com/reference/estatisticas-de-cobrancas
     * Recupera dados de pagamentos filtrados
     * @param {AsaasPaymentStatisticsQueryParams} paymentStatisticsParams Parametros de busca
     * @return {Promise<any>}
     */
  retrievePaymentStatistics = async (paymentStatisticsParams: AsaasPaymentStatisticsQueryParams) => {
    try {
      const queryParams = Object.entries(paymentStatisticsParams).map((param) => (`${param[0]}=${param[1]}`)).join("&");
      // const url = this.apiUrl + `subscriptions?${queryParams}`;
      const url = this.apiUrl + `finance/payment/statistics?${queryParams}`;
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Recupera dados de splits
     * @return {Promise<any>}
     */
  retrievePaymentSplits = async () => {
    try {
      const url = this.apiUrl + "finance/split/statistics";
      const options = {
        method: "GET",
        headers: this.getHeaders(),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
     * Cria um listener de webhook.
     * @param {string} linkName nome do listener
     * @param {string} contactEmail email de contato para caso de falha na comunicacao
     * @param {string} endpoint endpoint de conexao
     * @param {string[]} events eventos a serem escutados
     * @return {Promise<any>}
     */
  createWebhookListener = async (linkName: string, contactEmail: string, endpoint: string, events: string[]) => {
    try {
      const url = this.apiUrl + "webhooks";

      const webhookData = {
        name: linkName,
        url: endpoint,
        email: contactEmail,
        enabled: true,
        interrupted: false,
        authToken: null,
        sendType: "SEQUENTIALLY",
        events: events,
      };

      const options = {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(webhookData),
      };

      const res: any = await request(url, options);
      return this.handleResponse(res);
    } catch (error) {
      return {success: false, data: handleErrorNoRes(error)};
    }
  };

  /**
   * Lida com as respostas
   * @param {any} res Resposta
   * @return {any}
   */
  private handleResponse(res: any) {
    if (res.status === 200) {
      return {success: true, data: res.data};
    } else {
      return {success: false, data: res};
    }
  }
}
