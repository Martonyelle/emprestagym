import { AsaasBillingCycle, AsaasBillingType, AsaasPaymentStatus } from "../enums/asaas";

export interface AsaasSubscriptionReq {
    cycle: AsaasBillingCycle;
    type: AsaasBillingType;
    value: number;
    next_due_date: string;
}

export interface AsaasPayment {
    id: string;
    value: number;
    netValue: number;
    status: AsaasPaymentStatus;
    dateCreated: string;
    dueDate: string;
    description: string;
    invoiceUrl?: string;
    invoiceNumber?: string;
    billingType: string;
    object: string;
    originalDueDate?: any;
    fine?: any;
    discount?: any;
    interest?: any;
    anticipated?: boolean;
    deleted?: boolean;
    postalService?: boolean;
    externalReference?: string;
    cycle?: AsaasBillingCycle | string;
    transactionReceiptUrl?: string;
    subscription?: string;
    creditCard?: AsaasCreditCardToken;
}

export interface AsaasSubscription {
    id: string;
    value: number;
    netValue: number;
    status: AsaasPaymentStatus;
    dateCreated: string;
    dueDate: string;
    description: string;
    invoiceUrl?: string;
    invoiceNumber?: string;
    billingType: string;
    object: string;
    originalDueDate?: any;
    fine?: any;
    discount?: any;
    interest?: any;
    anticipated?: boolean;
    deleted?: boolean;
    postalService?: boolean;
    externalReference?: string;
    cycle?: AsaasBillingCycle | string;
    transactionReceiptUrl?: string;
}

export interface AsaasCreditCardToken{
    creditCardBrand: string;
    creditCardNumber: string;
    creditCardToken: string;
}