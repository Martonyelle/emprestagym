import {DocumentReference} from "firebase-admin/firestore";
import {AsaasPayment, AsaasPaymentCC, AsaasSubscription, AsaasSubscriptionCC} from "../customs/asaas/interfaces";
import {Asaas} from "../customs/asaas/main";
import {db} from "../../config/firebase";
import { AsaasPaymentStatus } from "../customs/asaas/enum";
import { mergeObjects, removeNullProps } from "./common";


export interface HelperResponse {
  success: boolean;
  data?: any;
  error?: any;
}

/**
 * Cria assinatura com cartao de credito
 * @param {Asaas} asaas Asaas instance
 * @param {AsaasSubscriptionCC} subscriptionCCData Credit card subscription data
 * @return {Promise<HelperResponse>} Operation Result
 */
export const createCCSubscriptionHandler = async (asaas: Asaas, subscriptionCCData: AsaasSubscriptionCC) : Promise<HelperResponse> => {
  const createCCSubscription = await asaas.generateSubscriptionCC(subscriptionCCData);
  if (createCCSubscription.success) {
    return {success: true, data: createCCSubscription.data};
  } else {
    return {success: false, data: createCCSubscription.data};
  }
};

/**
 * Cria uma assinatura
 * @param {Asaas} asaas Asaas instance
 * @param {AsaasSubscription} subscriptionData Subscription data
 * @return {Promise<HelperResponse>} Operation Result
 */
export const createSubscriptionHandler = async (asaas: Asaas, subscriptionData: AsaasSubscription) : Promise<HelperResponse> => {
  const createSubscription = await asaas.generateSubscription(subscriptionData);
  if (createSubscription.success) {
    return {success: true, data: createSubscription.data};
  } else {
    return {success: false, data: createSubscription.data};
  }
};

/**
 * Cria novo pagamento
 * @param {Asaas} asaas Asaas instance
 * @param {AsaasPayment} paymentData Payment data
 * @return {Promise<HelperResponse>} Operation Result
 */
export const createPaymentHandler = async (asaas: Asaas, paymentData: AsaasPayment) : Promise<HelperResponse> => {
  const createPayment = await asaas.createPayment(paymentData);
  if (createPayment.success) {
    return {success: true, data: createPayment.data};
  } else {
    return {success: false, data: createPayment.data};
  }
};

/**
 * Cria novo pagamento com cartao de credito
 * @param {Asaas} asaas Asaas instance
 * @param {AsaasPayment} paymentData Payment data
 * @return {Promise<HelperResponse>} Operation Result
 */
export const createCCPaymentHandler = async (asaas: Asaas, paymentData: AsaasPaymentCC) : Promise<HelperResponse> => {
  const createPayment = await asaas.createPayment(paymentData);
  if (createPayment.success) {
    return {success: true, data: createPayment.data};
  } else {
    return {success: false, data: createPayment.data};
  }
};

/**
 * Retorna o dia de vencimento correto formatado como string
 * @param {number} day Dia de vencimento
 * @return {string} Formated next due date
 */
export const getNextDueDateStr = (day:number) => {
  const dueDate = new Date();
  const now = new Date();
  if (now.getDate() > day) {
    dueDate.setMonth(now.getMonth() + 1);
    dueDate.setDate(day);
  } else {
    dueDate.setDate(day);
  }

  return dueDate.toISOString().split("T")[0];
};

/**
 * Atualiza dados de um pagamento
 * @param {any | AsaasPayment | AsaasPaymentCC} newPaymentData Novos dados de pagamento
 * @param {string} type Tipo de atualizacao
 * @return {Promise<HelperResponse>} Operation Result
 */
export const updatePaymentData = async (newPaymentData: any | AsaasPayment | AsaasPaymentCC, type: "delete" | "update" | "create") => {
  try {
    if (!newPaymentData.externalReference) throw new Error("Referencia de pagamento inexistente: externalReference");
    if (!newPaymentData.id) throw new Error("Referencia de pagamento inexistente: id");

    const externalReferenceSplit = newPaymentData.externalReference.split("/");
    const itemId = newPaymentData.id;

    const refEntity = await db.doc(`${externalReferenceSplit[0]}/${externalReferenceSplit[1]}`).get();
    const refEntityData = refEntity.data();

    const field = type === "create" ? "payments" : externalReferenceSplit[2];

    let updatedField:any[] | null = null;

    switch (type) {
    case "create":
      updatedField = (refEntityData && refEntityData[`${field}`]) ? refEntityData[`${field}`].filter((item: any) => {
        return item.id !== itemId;
      }) : [];
      updatedField?.push(newPaymentData);
      break;
    case "delete":
      updatedField = (refEntityData && refEntityData[`${field}`]) ? refEntityData[`${field}`].filter((item: any) => {
        return item.id !== itemId;
      }) : null;
      break;
    default:
      updatedField = (refEntityData && refEntityData[`${field}`]) ? refEntityData[`${field}`].map((item: any) => {
        if (item.id === itemId) return mergeObjects(newPaymentData, item, "first");
        return item;
      }) : null;
      break;
    }

    const setParams: any = {};

    const isOverdue = updatedField ? updatedField.findIndex((item:any) => item.status?.toString().toUpperCase() === AsaasPaymentStatus.OVERDUE) >= 0 : null;
    if (updatedField) {
      setParams[`${field}`] = updatedField;
    }
    if (isOverdue) {
      setParams.status = "overdue";
    }
    if (!isOverdue && refEntityData?.status !== "canceled") {
      setParams.status = "active";
    }

    await Promise.all([
      refEntity.ref.set(setParams, {merge: true}),
    ]);

    return {success: true, data: updatedField};
  } catch (error) {
    return {success: false, data: error};
  }
};

/**
 * Adiciona pagamento ao responsavel
 * @param {DocumentReference} owner Reference to the payment owner document
 * @param {AsaasPayment} paymentData Asaas payment
 * @return {Promise<HelperResponse>} Operation Result
 */
export const addPaymentToOwner = async (owner: DocumentReference, paymentData: AsaasPayment | AsaasPaymentCC) => {
  try {
    const ownerData = (await owner.get()).data();
    const payments = ownerData?.payments ? ownerData.payments : [];

    const newPaymentData = {
      ...removeNullProps(paymentData),
      externalReference: `${owner.path}/payments/${paymentData?.id}`,
    };

    payments.push(newPaymentData);

    await Promise.all([
      owner.set({
        payments: payments,
      }, {merge: true}),
    ]);

    return {success: true, data: newPaymentData};
  } catch (error) {
    return {success: false, data: error};
  }
};

/**
 * Atualiza referencia externa de um pagamento
 * @param {Asaas} asaas Instancia do Asaas
 * @param {DocumentReference} owner Referencia para o dono do pagamento
 * @param {AsaasPayment} paymentData Dados do pagamento
 * @return {Promise<HelperResponse>} Operation Result
 */
export const updatePaymentExternalReference = async (asaas: Asaas, owner: DocumentReference, paymentData: AsaasPayment | AsaasPaymentCC) => {
  try {
    if (!paymentData.id) throw new Error("Id do pagamento inexistente");
    const newPaymentData = {
      ...removeNullProps(paymentData),
      externalReference: `${owner.path}/payments/${paymentData?.id}`,
    };

    const updateAsaasPayment = await asaas.updatePayment(paymentData.id, newPaymentData);
    if (!updateAsaasPayment.success) throw new Error(`${updateAsaasPayment.data}`);

    const addPayment = await addPaymentToOwner(owner, newPaymentData);
    if (!addPayment.success) throw new Error(`${addPayment.data}`);

    return {success: true, data: newPaymentData};
  } catch (error) {
    return {success: false, data: error};
  }
};

/**
 * Atualiza as referencias externas de assinaturas no asaas
 * @param {Asaas} asaas Objeto da classe do Asaas
 * @param {DocumentReference} owner Dono da Assinatura
 * @param {AsaasSubscription} subscriptionData Dados da assinatura
 * @return {Promise<HelperResponse>} Operation Result
 */
export const updateSubscriptionExternalReference = async (asaas: Asaas, owner: DocumentReference, subscriptionData: AsaasSubscription | AsaasSubscriptionCC) => {
  try {
    const ownerData = (await owner.get()).data();
    const subscriptions = ownerData?.subscriptions ? ownerData.subscriptions.filter((s:any) => s.id !== subscriptionData.id) : [];

    const newSubscriptionData : AsaasSubscription | AsaasSubscriptionCC = {
      ...removeNullProps(subscriptionData),
      externalReference: `${owner.path}/subscriptions/${subscriptionData?.id}`,
    };

    const subscriptionId = subscriptionData.id || "";
    if (!subscriptionId) throw new Error("Id da assinatura inexistente");
    const updateRes = await asaas.updateSubscription(subscriptionId, newSubscriptionData);
    if (!updateRes.success) throw new Error(`${updateRes.data}`);

    subscriptions.push(newSubscriptionData);

    await Promise.all([
      owner.set({
        subscriptions: subscriptions,
      }, {merge: true}),
    ]).then(async () => {
      await updateSubscriptionPayments(asaas, owner, subscriptionId);
    });

    return {success: true, data: newSubscriptionData};
  } catch (error) {
    return {success: false, data: error};
  }
};

/**
 * Atualiza os pagamentos de uma assinatura
 * @param {Asaas} asaas Instancia da classe do Asaas
 * @param {DocumentReference} owner Proprietario da Assinatura
 * @param {string} subscriptionId id da assinatura
 * @return {Promise<HelperResponse>} Operation Result
 */
export const updateSubscriptionPayments = async (asaas: Asaas, owner: DocumentReference, subscriptionId: string) => {
  try {
    const ownerData = (await owner.get()).data();
    // const subscriptions: any[] = ownerData?.subscriptions ? ownerData.subscriptions : [];
    const payments: any[] = ownerData?.payments ? ownerData.payments : [];

    // TO-DO: Pegar todas as assinaturas de acordo com a paginação
    const subscriptionPaymentsRes = await asaas.getSubscriptionPayments(subscriptionId);
    if (!subscriptionPaymentsRes.success) throw new Error(`${subscriptionPaymentsRes.data}`);
    const updatedPayments = await Promise.all(subscriptionPaymentsRes.data.data.map(async (payment: any) => {
      if (payment.status === AsaasPaymentStatus.OVERDUE || payment.status === AsaasPaymentStatus.PENDING) {
        const updatePaymentRes = await asaas.updatePayment(payment.id, {
          ...payment,
          externalReference: `${owner.path}/payments/${payment.id}`,
        });
        return updatePaymentRes.data;
      }
      return payment;
    }));

    updatedPayments.map((p) => payments.push(p));

    setTimeout(() => {
      owner.set({
        payments: payments,
      }, {merge: true});
    }, 500);

    return {success: true, data: payments};
  } catch (error) {
    return {success: false, data: error};
  }
};
