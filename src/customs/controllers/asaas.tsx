// import { User } from "@firebase/auth";

import { fetchData } from "../../@shared/helpers/helpers";
import { AsaasSubscriptionReq } from "../../@shared/interface/asaas";
import { APIResponse } from "../../@shared/interface/common";


export const getMonthStatement = async (date: Date, offset?: number) => {
    date.setDate(1);
    const currentMonth = date.getMonth();

    const startDate = date;
    const endDate = new Date();
    endDate.setDate(1);
    endDate.setFullYear(startDate.getFullYear());

    if(currentMonth == 11){ // If is December, updates to January next year
        endDate.setMonth(0);
        endDate.setFullYear(startDate.getFullYear()+1);
    } else {
        endDate.setMonth(currentMonth+1)
    }

    const parsedStartDate = startDate.toISOString().split('T')[0];
    const parsedEndDate = endDate.toISOString().split('T')[0];

    const postData:any = {
        start_date: parsedStartDate,
        end_date: parsedEndDate
    }

    if(offset) postData.offset = offset;

    return fetchData('POST', '/financial/getStatement', 'buscar extrato', postData);
}

export const getMonthFinancialStatistics = async (date: Date) => {
    date.setDate(1);
    const currentMonth = date.getMonth();

    const startDate = date;
    const endDate = new Date();
    endDate.setDate(1);
    endDate.setFullYear(startDate.getFullYear());

    if(currentMonth == 11){ // If is December, updates to January next year
        endDate.setMonth(0);
        endDate.setFullYear(startDate.getFullYear()+1);
    } else {
        endDate.setMonth(currentMonth+1)
    }

    const parsedStartDate = startDate.toISOString().split('T')[0];
    const parsedEndDate = endDate.toISOString().split('T')[0];

    const postData:any = {
        start_date: parsedStartDate,
        end_date: parsedEndDate
    }

    return fetchData('POST', '/financial/getFinancialInfo', 'buscar Informações financeiras', postData);
}

export const createAsaasCustomer = async (asaasCustomerData: any) => {
    const postData:any = {
        name: asaasCustomerData.name,
        email: asaasCustomerData.email,
        cpfCnpj: asaasCustomerData.cpfCnpj,
        external_reference: asaasCustomerData.external_reference,
        phone: asaasCustomerData.phone,
    }

    if(asaasCustomerData.address) postData.address = asaasCustomerData.address.address;

    return fetchData('POST', '/asaas/customer/new', 'criar cliente no provedor de pagamentos', postData);
}

export const createAsaasSubAccount = async (asaasCustomerData: any) => {
    const postData:any = {
        name: asaasCustomerData.name,
        email: asaasCustomerData.email,
        birth_date: asaasCustomerData.birth_date,
        address: asaasCustomerData.address.address,
        address_number: asaasCustomerData.address.address_number,
        postal_code: asaasCustomerData.address.zip_code,
        province: asaasCustomerData.address.state,
        income_value: asaasCustomerData.income_value,
        cpfCnpj: asaasCustomerData.cpfCnpj,
        external_reference: asaasCustomerData.id,
        phone: asaasCustomerData.phone
    }
    
    if(asaasCustomerData.address) postData.address = asaasCustomerData.address.address;

    return fetchData('POST', '/asaas/subaccount/new', 'criar subconta no provedor de pagamentos', postData);
}

export const createAsaasCreditCard = async (customerId: string, asaasCCData: any, asaasCCHolder: any, ip: string) => {
    const postData:any = {
        customer_id: customerId,
        credit_card: asaasCCData,
        credit_card_holder_info: asaasCCHolder,
        ip: ip
    }

    return fetchData('POST', '/asaas/creditcard/new', 'criar token de cartão no provedor de pagamentos', postData);
}

export const createAsaasSubscription = async (useInsuranceData: boolean = false, entityRefPath: string, insuranceId?: string,  customerId?: string, subscriptionData?: AsaasSubscriptionReq, asaasCCData?: any, asaasCCHolder?: any, ip?: string) => {
    const postData:any = {
        reference_path: entityRefPath,
        use_insurance_data: useInsuranceData
    }

    if(insuranceId) postData.insurance_id = insuranceId;
    if(customerId) postData.customer_id = customerId;
    if(subscriptionData) postData.subscription = subscriptionData;
    if(ip) postData.ip = ip;
    if(asaasCCData) postData.credit_card = asaasCCData;
    if(asaasCCHolder) postData.credit_card_holder_info = asaasCCHolder;

    return fetchData('POST', '/asaas/subscription/new', 'criar assinatura no provedor de pagamentos', postData);
}

export const deleteAsaasCustomer = async (customerId?: string): Promise<APIResponse> => {
    const deleteData:any = {
        customer_id: customerId,
    }

    return fetchData('DELETE', '/asaas/customer/delete', 'deletar cliente no provedor de pagamentos', deleteData);
}

export const deleteAsaasSubscription = async (subscriptionId?: string): Promise<APIResponse> => {
    return fetchData('DELETE', `/asaas/subscription/${subscriptionId}`, 'deletar assinatura no provedor de pagamentos', null);
}

export const getSubscriptionPaybook = async (subscriptionId: string, month: number, year: number): Promise<any> => {
    const receiveData:any = {
        month: month,
        year: year
    }

    return fetchData('GET', `/asaas/subscription/${subscriptionId}/paymentBook`, 'imprimir carnê de assinatura', receiveData);
}

export const receivePaymentInCash = async (payment_id: string, value: number, payment_date: Date, payment_negociation?:string, payment_type?: string, notify_customer?: boolean): Promise<APIResponse> => {
    const receiveData:any = {
        payment_id: payment_id,
        value: value,
        payment_date: payment_date.toISOString()
    }

    if(notify_customer) receiveData.notify_customer = notify_customer;
    if(payment_negociation) receiveData.payment_negociation = payment_negociation;
    if(payment_type) receiveData.payment_type = payment_type;

    return fetchData('POST', '/asaas/payment/receiveInCash', 'registrar recebimento de pagamento', receiveData);
}

export const deletePayment = async (payment_id: string): Promise<APIResponse> => {
    return fetchData('DELETE', `/asaas/payment/${payment_id}`, 'deletar pagamento', null);
}