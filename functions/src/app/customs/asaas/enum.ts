export enum AsaasFineType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
}

export enum AsaasSubscriptionStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  EXPIRED = "EXPIRED"
}

export enum AsaasBillingType {
  UNDEFINED = "UNDEFINED",
  BOLETO = "BOLETO",
  CREDIT_CARD = "CREDIT_CARD",
  PIX = "PIX"
}

export enum AsaasBillingCycle {
  WEEKLY = "WEEKLY",
  BIWEEKLY = "BIWEEKLY",
  MONTHLY = "MONTHLY",
  BIMONTHLY = "BIMONTHLY",
  QUARTERLY = "QUARTERLY",
  SEMIANNUALLY = "SEMIANNUALLY",
  YEARLY = "YEARLY"
}

export enum AsaasPaymentStatus {
  PENDING = "PENDING",
  RECEIVED = "RECEIVED",
  CONFIRMED = "CONFIRMED",
  OVERDUE = "OVERDUE",
  REFUNDED = "REFUNDED",
  RECEIVED_IN_CASH = "RECEIVED_IN_CASH",
  REFUND_REQUESTED = "REFUND_REQUESTED",
  REFUND_IN_PROGRESS = "REFUND_IN_PROGRESS",
  CHARGEBACK_REQUESTED = "CHARGEBACK_REQUESTED",
  CHARGEBACK_DISPUTE = "CHARGEBACK_DISPUTE",
  AWAITING_CHARGEBACK_REVERSAL = "AWAITING_CHARGEBACK_REVERSAL",
  DUNNING_REQUESTED = "DUNNING_REQUESTED",
  DUNNING_RECEIVED = "DUNNING_RECEIVED",
  AWAITING_RISK_ANALYSIS = "AWAITING_RISK_ANALYSIS"
}
