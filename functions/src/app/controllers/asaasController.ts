import {Request, Response} from "express";
import {handleError} from "../helpers/errorHandler";

import {AsaasCCHolderInfo, AsaasCreditCard, AsaasCustomer, AsaasSubAccount, AsaasSubscription, AsaasSubscriptionCC, AsaasSubscriptionPaymentbookQueryParams} from "../customs/asaas/interfaces";
import {Asaas} from "../customs/asaas/main";
import {asaasConfig} from "../../config/config";
import {AsaasBillingCycle, AsaasBillingType} from "../customs/asaas/enum";
import {db} from "../../config/firebase";
import {Timestamp} from "firebase-admin/firestore";
import {updatePaymentData, updateSubscriptionExternalReference} from "../helpers/asaas";
import {mergeObjects} from "../helpers/common";

/**
 * Registra um pagamento em dinheiro
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const receiveInCash = async function(req: Request, res: Response) {
  try {
    const requestObj:any = req;
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const {
      payment_id,
      value,
      payment_date,
      payment_negociation, // OPCIONAL
      payment_type, // OPCIONAL
      notify_customer,
    } = req.body;

    if (!payment_id || !value || !payment_date ) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios",
      };
      throw err;
    }

    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });

    const date = new Date(payment_date);
    const notify = notify_customer ? true : false;

    const extraProps: any = {
      responsible: {
        name: requestObj.user?.name,
        email: requestObj.user?.email,
        picture: requestObj.user?.picture,
        user_id: requestObj.user?.user_id,
        auth_time: requestObj.user?.auth_time,
      },
      date: Timestamp.fromDate(new Date()),
    };

    if (payment_negociation) extraProps.negociation = payment_negociation;
    if (payment_type) extraProps.type = payment_type;

    const receiveRes = await asaas.receiveCashPayment(payment_id, value, date, notify);
    if (receiveRes.success) {
      const newPaymentData = mergeObjects(receiveRes.data, {manualPaymentExtras: extraProps}, "first");
      const updatePaymentRes = await updatePaymentData(newPaymentData, "update");
      if (!updatePaymentRes.success) throw new Error(`${updatePaymentRes.data}`);
      res.status(200).send(receiveRes.data);
      return;
    } else {
      throw new Error(JSON.stringify(receiveRes.data));
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Cria um novo cliente no Asaas
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const createCustomer = async function(req: Request, res: Response) {
  try {
    const requestObj:any = req;
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const {
      name,
      email,
      phone,
      cpfCnpj,
      external_reference,
    } = req.body;

    if (!cpfCnpj || !name || !external_reference) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios",
      };
      throw err;
    }

    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });

    const asaasCustomerObj: AsaasCustomer = {
      name: name,
      cpfCnpj: cpfCnpj,
      externalReference: external_reference,
      groupName: "doutor.ai",
    };

    if (email) asaasCustomerObj.email = email;
    if (phone) {
      asaasCustomerObj.phone = phone;
      asaasCustomerObj.mobilePhone = phone;
    }

    const createAsaasCustomer = await asaas.createCustomer(asaasCustomerObj);
    if (createAsaasCustomer.success) {
      res.status(201).send(createAsaasCustomer.data);
      return;
    } else {
      throw createAsaasCustomer.data;
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Deleta um cliente no Asaas
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const deleteCustomer = async function(req: Request, res: Response) {
  try {
    const requestObj:any = req;
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const {
      customer_id,
    } = req.body;

    if (!customer_id) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios",
      };
      throw err;
    }
    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });

    const deleteAsaasCustomer = await asaas.deleteCustomer(customer_id.toString());
    if (deleteAsaasCustomer.success) {
      res.status(201).send(deleteAsaasCustomer.data);
      return;
    } else {
      throw deleteAsaasCustomer.data;
    }
  } catch (error) {
    handleError(error, res);
  }
};


/**
 * Cria um novo cliente no Asaas
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const createSubAccount = async function(req: Request, res: Response) {
  try {
    // const requestObj:any = req;
    // const reqUserData = requestObj['user'];

    const {
      name,
      birth_date,
      address,
      address_number,
      province,
      postal_code,
      income_value,
      email,
      phone,
      cpfCnpj,
      external_reference,
    } = req.body;

    if (!cpfCnpj || !name || !email || !external_reference || !birth_date || !address || !address_number || !income_value || !province || !postal_code) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios",
      };
      throw err;
    }

    // TO-DO: Ter a opcao de criar subconta para o cliente ou subconta geral
    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasConfig.accessToken, // TO-DO: Pegar access token da clinica
    });

    const asaasSubAccountObj: AsaasSubAccount = {
      name: name,
      cpfCnpj: cpfCnpj,
      email: email,
      birthDate: birth_date,
      externalReference: external_reference,
      incomeValue: income_value,
      address: address,
      addressNumber: address_number,
      province: province,
      postalCode: postal_code,
      phone: phone,
      mobilePhone: phone,
    };

    const createAsaasSubAccount = await asaas.createSubAccount(asaasSubAccountObj);
    if (createAsaasSubAccount.success) {
      // TO-DO: Criar webhooks para verificar cobranças
      res.status(201).send(createAsaasSubAccount.data);
      return;
    } else {
      throw createAsaasSubAccount.data;
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Cria um novo token de cartão no Asaas
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const createCCToken = async function(req: Request, res: Response) {
  try {
    const requestObj:any = req;
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const {
      customer_id,
      credit_card,
      credit_card_holder_info,
      ip,
    } = req.body;

    if (!customer_id || !credit_card || !credit_card_holder_info || !ip) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios",
      };
      throw err;
    }

    if (!credit_card.number ||
            !credit_card.expiry_month ||
            !credit_card.expiry_year ||
            !credit_card.holder_name ||
            !credit_card.ccv
    ) {
      const err: Error = {
        name: "badRequest",
        message: "Forneça corretamente os dados do cartão de crédito",
      };
      throw err;
    }

    if (!credit_card_holder_info.name ||
            !credit_card_holder_info.email ||
            !credit_card_holder_info.cpf_cnpj ||
            !credit_card_holder_info.postal_code ||
            !credit_card_holder_info.phone ||
            !credit_card_holder_info.address_number
    ) {
      const err: Error = {
        name: "badRequest",
        message: "Forneça corretamente os dados do titular do cartão",
      };
      throw err;
    }

    const cardData:AsaasCreditCard = {
      holderName: credit_card.holder_name,
      number: credit_card.number,
      expiryMonth: credit_card.expiry_month,
      expiryYear: credit_card.expiry_year,
      ccv: credit_card.ccv,
    };

    const holderData:AsaasCCHolderInfo = {
      name: credit_card_holder_info.name,
      email: credit_card_holder_info.email,
      cpfCnpj: credit_card_holder_info.cpf_cnpj,
      postalCode: credit_card_holder_info.postal_code,
      addressNumber: credit_card_holder_info.address_number,
      phone: credit_card_holder_info.phone,
    };

    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });


    const createAsaasCCToken = await asaas.tokenizeCreditCard(customer_id, cardData, holderData, ip);
    if (createAsaasCCToken.success) {
      res.status(201).send(createAsaasCCToken.data);
      return;
    } else {
      throw createAsaasCCToken.data;
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Deleta uma assinatura
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const deleteSubscription = async function(req: Request, res: Response) {
  try {
    const requestObj:any = req;
    // const reqUserData = requestObj['user']; // TO-DO: Registrar Logs
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const {
      subscription_id,
    } = req.body;

    if (!subscription_id) {
      const err: Error = {
        name: "missingParams",
        message: "Forneça o id da assinatura",
      };
      throw err;
    }

    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });

    const deleteRes = await asaas.deleteSubscription(subscription_id);
    if (!deleteRes?.success) throw deleteRes?.data;

    res.status(204).send(deleteRes.data);
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * retorna o carnê de uma assinatura
 * @param {Request} req Express request instance
 * @param {Response} res Express response instance
 */
export const getPaymentBook = async function(req: Request, res: Response) {
  try {
    const requestObj:any = req;
    // const reqUserData = requestObj['user']; // TO-DO: Registrar Logs
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const subscriptionId = req.params.id;

    const {
      month,
      year,
    } = req.query;

    if (!subscriptionId) {
      const err: Error = {
        name: "missingParams",
        message: "Forneça o id da assinatura",
      };
      throw err;
    }

    if (!month || !year) {
      const err: Error = {
        name: "missingParams",
        message: "Forneça o mês e ano para gerar o carnê",
      };
      throw err;
    }

    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });

    const queryParams: AsaasSubscriptionPaymentbookQueryParams = {
      month: parseInt(month.toString()),
      year: parseInt(year.toString()),
    };

    const paymentBook = await asaas.getSubscriptionPaymentbook(subscriptionId, queryParams);

    if (!paymentBook?.success) throw paymentBook?.data;


    const buffer = Buffer.from(paymentBook.data);

    // Enviar o Buffer
    res.status(200).send(buffer.toString("base64"));
  } catch (error) {
    handleError(error, res);
  }
};


/**
 * Cria uma Assinatura
 * @param {Request} req Express Request instance
 * @param {Response} res Express Response instance
 */
// TO-DO: CODESMELL - Isso aqui era pra estar no controller de financial
export const createSubscription = async function(req: Request, res: Response) {
  try {
    const requestObj: any = req;
    // const reqUserData = requestObj['user']; // TO-DO: Registrar Logs
    const asaasAccessToken = requestObj["asaas_access_token"];

    if (!asaasAccessToken) throw new Error("Token de acesso ao provedor de pagamentos não fornecido!");

    const {
      customer_id,
      reference_path,
      subscription,
      ip,
      credit_card,
      credit_card_holder_info,
    } = req.body;

    if (!customer_id || !reference_path) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios",
      };
      throw err;
    }

    const asaas = new Asaas({
      apiVersion: "v3",
      sandbox: asaasConfig.sandbox,
      accessToken: asaasAccessToken,
    });

    const refEntity = await db.doc(reference_path).get();
    if (!refEntity.exists) throw new Error("Não foi possivel associar a assinatura");

    const refEntityData = refEntity.data();
    const subscriptionIndexToInsert = (refEntityData?.subscriptions && refEntityData.subscriptions.length > 0) ? (refEntityData?.subscriptions.length) : 0;

    const subscriptionData: AsaasSubscription = {
      customer: customer_id,
      billingType: AsaasBillingType.UNDEFINED,
      cycle: AsaasBillingCycle.MONTHLY,
      nextDueDate: "",
      value: 0,
      externalReference: `${reference_path}/subscriptions/${subscriptionIndexToInsert}`,
    };

    const handleCreditCard = async (billingType: AsaasBillingType, cycle: AsaasBillingCycle, dueDate: string, value: number, description?: string) => {
      const subscriptionCCData: AsaasSubscription = {
        ...subscriptionData,
        billingType: billingType,
        cycle: cycle,
        value: value,
        nextDueDate: dueDate,
      };
      description ? subscriptionCCData.description = description : null;

      if (!ip || !credit_card || !credit_card_holder_info) {
        // Cria link de pagamento
        const asaasRes = await handleBoletoPixCCLink(billingType, cycle, dueDate, subscription.value);
        return asaasRes;
      } else {
        // Não forneceu token, precisa de todos os dados do cartão
        if (!credit_card.token && (!credit_card.holder_name || !credit_card.number || !credit_card.expiry_month || !credit_card.expiry_year || !credit_card.ccv)) {
          const err: Error = {
            name: "badRequest",
            message: "Forneça os parametros obrigatórios do cartão de crédito: holder_name, number, expiry_month, expiry_year, ccv.",
          };
          throw err;
        }

        const subscriptionCCDataWithCard: AsaasSubscriptionCC = {
          ...subscriptionCCData,
          creditCard: credit_card.token ? credit_card.token : {
            holderName: credit_card.holder_name,
            number: credit_card.number,
            expiryMonth: credit_card.expiry_month,
            expiryYear: credit_card.expiry_year,
            ccv: credit_card.ccv,
          },
          creditCardHolderInfo: {
            name: credit_card_holder_info.name,
            email: credit_card_holder_info.email,
            cpfCnpj: credit_card_holder_info.cpf_cnpj,
            postalCode: credit_card_holder_info.postal_code,
            phone: credit_card_holder_info.phone,
            addressNumber: credit_card_holder_info.address_number,
          },
          remoteIp: ip,
        };

        if (credit_card.token) subscriptionCCDataWithCard.creditCardToken = credit_card.token;

        const createAsaasSubscriptionCC = await asaas.generateSubscriptionCC(subscriptionCCDataWithCard);
        return createAsaasSubscriptionCC;
      }
    };

    const handleBoletoPixCCLink = async (billingType: AsaasBillingType, cycle: AsaasBillingCycle, dueDate: string, value: number, description?: string) => {
      subscriptionData.billingType = billingType;
      subscriptionData.cycle = cycle;
      subscriptionData.value = value;
      subscriptionData.nextDueDate = dueDate;
      subscriptionData.externalReference = `${reference_path}/subscriptions/${subscriptionIndexToInsert}`;

      description ? subscriptionData.description = description : null;

      const createAsaasSubscription = await asaas.generateSubscription(subscriptionData);
      return createAsaasSubscription;
    };

    if (!subscription) {
      const err: Error = {
        name: "missingParams",
        message: "Preencha todos os campos obrigatórios: subscription",
      };
      throw err;
    }

    if (!subscription.value || !subscription.next_due_date || !subscription.cycle || !subscription.billing_type) {
      const err: Error = {
        name: "badRequest",
        message: "O parâmetro subscription precisa ter as seguintes propriedades: value, next_due_date, cycle, billing_type",
      };
      throw err;
    }

    const billingType: AsaasBillingType | string = subscription.billing_type?.toString().toUpperCase();
    if (!(billingType in AsaasBillingType)) {
      const err: Error = {
        name: "badRequest",
        message: "O parâmetro subscription.billing_type precisa ser do tipo AsaasBillingType",
      };
      throw err;
    }

    const cycle: AsaasBillingCycle | any = subscription.cycle?.toString().toUpperCase();
    if (!(cycle in AsaasBillingCycle)) {
      const err: Error = {
        name: "badRequest",
        message: "O parâmetro subscription.cycle precisa ser do tipo AsaasBillingCycle",
      };
      throw err;
    }
    const dueDate = new Date(subscription.next_due_date).toISOString().split("T")[0];

    if (billingType === AsaasBillingType.CREDIT_CARD) {
      const asaasRes = await handleCreditCard(billingType, cycle, dueDate, subscription.value);
      if (!asaasRes?.success) throw asaasRes?.data;
      const updatedSubscription = await updateSubscriptionExternalReference(asaas, refEntity.ref, asaasRes.data);

      res.status(201).send(updatedSubscription.data);
      return;
    }

    if (billingType === AsaasBillingType.BOLETO || billingType === AsaasBillingType.PIX) {
      const asaasRes = await handleBoletoPixCCLink(billingType, cycle, dueDate, subscription.value);
      if (!asaasRes?.success) throw asaasRes?.data;
      const updatedSubscription = await updateSubscriptionExternalReference(asaas, refEntity.ref, asaasRes.data);

      res.status(201).send(updatedSubscription.data);
      return;
    }
  } catch (error) {
    handleError(error, res);
  }
};

/**
 * Função para lidar com webhook do asaas
 * @param {Request} req Express Request instance
 * @param {Response} res Express Response instance
 */
export const handlePaymentsWebhooks = async function(req: Request, res: Response) {
  try {
    const {
      id,
      event,
      payment,
    } = req.body;

    const webhookRef = await db.collection("asaas_webhooks").where("event_id", "==", id).get();
    if (!webhookRef.empty) {
      // Ja recebeu essa chamada de webhook, retorna 200 e para execução
      res.status(200).send();
      return;
    }

    if (!payment.externalReference) {
      // Recebeu webhook de uma cobrança que nao está LINKADA
      res.status(200).send();
      return;
    }

    const externalReferenceSplit = payment.externalReference.split("/");
    const refEntity = await db.doc(`${externalReferenceSplit[0]}/${externalReferenceSplit[1]}`).get();
    if (!refEntity.exists) {
      // Recebeu webhook de uma cobrança que nao está no sistema
      res.status(200).send();
      return;
    }

    switch (event) {
    case "PAYMENT_DELETED":
      const deletePaymentRes = await updatePaymentData(payment, "delete");
      if (!deletePaymentRes.success) throw new Error(`${deletePaymentRes.data}`);
      break;
    case "PAYMENT_CREATED":
      const createPaymentRes = await updatePaymentData(payment, "create");
      if (!createPaymentRes.success) throw new Error(`${createPaymentRes.data}`);
      break;

    default:
      const updatePaymentRes = await updatePaymentData(payment, "update");
      if (!updatePaymentRes.success) throw new Error(`${updatePaymentRes.data}`);
      break;
    }

    await db.collection("asaas_webhooks").add({
      event_id: id,
      event: event,
      payment: payment,
      collection: refEntity.ref.parent.id,
      reference: refEntity.ref,
      created_at: Timestamp.fromDate(new Date()),
    });

    res.status(200).send();
  } catch (error) {
    handleError(error, res);
  }
};
