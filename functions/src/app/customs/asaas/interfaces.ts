import {AsaasBillingCycle, AsaasBillingType, AsaasFineType} from "./enum";

/**
 * Reference: https://docs.asaas.com/reference/criar-novo-cliente
 */
export interface AsaasCustomer {
    // Campos obrigatórios
    name: string; // Nome do cliente
    cpfCnpj: string; // CPF ou CNPJ do cliente

    // Campos opcionais
    email?: string; // E-mail do cliente
    phone?: string; // Telefone do cliente
    mobilePhone?: string; // Telefone celular do cliente
    address?: string; // Endereço do cliente
    addressNumber?: string; // Número do endereço
    complement?: string; // Complemento do endereço
    province?: string; // Bairro do cliente
    postalCode?: string; // CEP do endereço
    externalReference?: string; // Referência externa (ID do cliente em outro sistema)
    notificationDisabled?: boolean; // Desabilitar notificações automáticas por e-mail
    additionalEmails?: string; // E-mails adicionais para envio de notificações, separados por vírgula
    municipalInscription?: string; // Inscrição municipal
    stateInscription?: string; // Inscrição estadual
    observations?: string; // Observações

    groupName?: string;
    company?: string;
    // Campos para Pessoa Jurídica (quando cpfCnpj for CNPJ)
    companyName?: string; // Razão social (para Pessoa Jurídica)
    tradingName?: string; // Nome fantasia (para Pessoa Jurídica)

    // Outros campos opcionais podem ser adicionados aqui conforme a documentação do Asaas
}

/**
 * Reference: https://docs.asaas.com/reference/tokenizacao-de-cartao-de-credito
 */
export interface AsaasCreditCard {
    holderName: string; // Nome impresso no cartão
    number: string; // Número do cartão
    expiryMonth: string; // Mês de expiração (ex: 06)
    expiryYear: string; // Ano de expiração com 4 dígitos (ex: 2019)
    ccv: string; // Código de segurança
}
/**
 * Reference: https://docs.asaas.com/reference/tokenizacao-de-cartao-de-credito
 */
export interface AsaasCCHolderInfo {
    name: string; // Nome do titular do cartão
    email: string; // Email do titular do cartão
    cpfCnpj: string; // CPF ou CNPJ do titular do cartão
    postalCode: string; // CEP do titular do cartão
    addressNumber: string; // Número do endereço do titular do cartão
    addressComplement?: string; // Complemento do endereço do titular do cartão (opcional)
    phone: string; // Fone com DDD do titular do cartão
    mobilePhone?: string; // Fone celular do titular do cartão (opcional)
}
/**
 * Reference: https://docs.asaas.com/reference/criar-nova-cobranca
 */
export interface AsaasSplit {
    walletId: string; // Identificador da carteira Asaas que será transferido
    fixedValue?: number; // Valor fixo a ser transferido para a conta quando a cobrança for recebida
    percentualValue?: number; // Percentual sobre o valor líquido da cobrança a ser transferido quando for recebida
    totalFixedValue?: number; // (Somente parcelamentos) Valor que será feito split referente ao valor total que será parcelado
}

export interface AsaasDiscount {
    value: number; // Valor percentual ou fixo de desconto a ser aplicado sobre o valor da cobrança
    dueDateLimitDays: number; // Dias antes do vencimento para aplicar desconto
    type: string; // Tipo de desconto
}
export interface AsaasInterest {
    value: number; // Percentual de juros ao mês sobre o valor da cobrança para pagamento após o vencimento
}

export interface AsaasFine {
    value: number;
    type: AsaasFineType; // Assumindo que os tipos de multa são 'PERCENTUAL' ou 'FIXO'
}

export interface AsaasCallback {
    successUrl: string; // URL para redirecionamento após o pagamento com sucesso
    autoRedirect?: boolean; // Se o cliente será redirecionado automaticamente. Padrão é true.
}


export interface AsaasPayment {
    customer: string; // Identificador único do cliente no Asaas
    billingType: AsaasBillingType; // Forma de pagamento
    value: number; // Valor da cobrança
    dueDate: Date; // Data de vencimento da cobrança
    description?: string; // Descrição da cobrança (máx. 500 caracteres)
    daysAfterDueDateToCancellationRegistration?: number; // Dias após o vencimento para cancelamento do registro (somente para boleto bancário)
    externalReference?: string; // Campo livre para busca
    installmentCount?: number; // Número de parcelas (somente no caso de cobrança parcelada)
    totalValue?: number; // Valor total de uma cobrança que será parcelada (somente no caso de cobrança parcelada)
    installmentValue?: number; // Valor de cada parcela (somente no caso de cobrança parcelada)
    discount?: AsaasDiscount; // Informações de desconto
    interest?: AsaasInterest; // Informações de juros para pagamento após o vencimento
    fine?: AsaasFine; // Informações de multa para pagamento após o vencimento
    postalService?: boolean; // Define se a cobrança será enviada via Correios
    split?: AsaasSplit[]; // Configurações do split
    callback?: AsaasCallback; // Informações de redirecionamento automático após pagamento na tela de fatura
    id?: string;
}

export interface AsaasPaymentCC extends AsaasPayment {
    creditCard: AsaasCreditCard; // Dados do cartão de crédito
    creditCardHolderInfo: AsaasCCHolderInfo; // Dados do titular do cartão
    remoteIp: string;
    // OPCIONAIS
    creditCardToken?: string;
    authorizeOnly?: boolean;
}

/**
 * Reference: https://docs.asaas.com/reference/criar-nova-assinatura
 */
export interface AsaasSubscription {
    // Campos obrigatórios
    customer: string; // Identificação do cliente no Asaas
    billingType: AsaasBillingType; // Tipo de cobrança
    nextDueDate: string; // Data de vencimento da primeira cobrança (formato 'YYYY-MM-DD')
    value: number; // Valor da cobrança
    cycle: AsaasBillingCycle; // Ciclo da cobrança

    // Campos opcionais
    endDate?: number; // Data limite para vencimento das mensalidades
    description?: string; // Descrição da assinatura
    installments?: number; // Número de parcelas (para cobranças parceladas)
    maxOverdueDays?: number; // Número máximo de dias em atraso permitido
    fine?: number; // Multa para pagamento após o vencimento (em %)
    interest?: number; // Juros por atraso por mês (em %)
    discount?: {
        value: number; // Valor do desconto
        dueDateLimitDays: number; // Limite de dias para aplicação do desconto
    };
    postalService?: boolean; // Indica se será enviado boleto impresso pelos correios
    split?: AsaasSplit[]
    // Outros campos opcionais podem ser adicionados aqui conforme a documentação do Asaas
    externalReference?: string
    id?: string
}

export interface AsaasSubscriptionCC extends AsaasSubscription {
    // Campos para cobrança via cartão de crédito
    creditCard: AsaasCreditCard;
    creditCardHolderInfo: AsaasCCHolderInfo;
    remoteIp: string; // IP de onde o cliente está fazendo a compra. Não deve ser informado o IP do seu servidor.
    creditCardToken?: string;
}

export type AsaasWebhook = {
    url: string; // URL que receberá as informações de sincronização
    email: string; // Email para receber as notificações em caso de erros na fila
    apiVersion: number; // Versão utilizada da API. Utilize "3" para a versão v3
    enabled: boolean; // Habilitar ou não o webhook
    interrupted: boolean; // Situação da fila de sincronização
    authToken?: string; // Token de autenticação (opcional)
    type: string; // Tipo de Webhook
};

export interface AsaasSubAccount extends AsaasCustomer {
    // Campos herdados de AsaasCustomer que são obrigatórios ou opcionais já estão incluídos.
    // Sobrescrevemos ou adicionamos campos específicos para a subconta abaixo:
    loginEmail?: string; // Email para login da subconta, opcional
    companyType?: string; // Tipo da empresa, opcional, somente Pessoa Jurídica
    site?: string; // URL do site da conta filha, opcional
    incomeValue: number; // Faturamento/Renda mensal
    webhooks?: AsaasWebhook[]; // Configurações de Webhooks desejadas, opcional
    birthDate: string; // Data de nascimento
    address: string;
    addressNumber: string;
    province: string;
    postalCode: string;
    mobilePhone: string;
    // Campos específicos da subconta que não estão em AsaasCustomer podem ser adicionados aqui
}

export interface AsaasSubscriptionQueryParams {
    customer?: string; // Filtrar pelo Identificador único do cliente
    customerGroupName?: string; // Filtrar pelo nome do grupo de cliente
    billingType?: string; // Filtrar por forma de pagamento
    status?: string; // Filtrar pelo status
    deletedOnly?: string; // Envie "true" para retornar somente as assinaturas removidas
    includeDeleted?: string; // Envie "true" para recuperar também as assinaturas removidas
    externalReference?: string; // Filtrar pelo Identificador do seu sistema
    order?: string; // Ordem crescente ou decrescente
    sort?: string; // Por qual campo será ordenado
    offset?: number; // Elemento inicial da lista
    limit?: number; // Número de elementos da lista (max: 100)
}

export interface AsaasSubscriptionPaymentbookQueryParams {
    month: number; // Mês final para geração do carnê, representado por um número inteiro.
    year: number; // Ano final para geração do carnê, representado por um número inteiro.
    sort?: string; // Nome da coluna para filtro, opcional.
    order?: string; // Ordenação da coluna, "asc" para ascendente ou "desc" para descendente, opcional.
}

export interface AsaasPaymentStatisticsQueryParams {
    customer?: string; // Filtrar pelo Identificador único do cliente
    billingType?: string; // Filtrar por forma de pagamento
    status?: string; // Filtrar por status
    anticipated?: string; // Filtrar registros antecipados ou não
    "dateCreated[ge]"?: string; // Filtrar a partir da data de criação inicial
    "dateCreated[le]"?: string; // Filtrar a partir da data de criação final
    "dueDate[ge]"?: string; // Filtrar a partir da data de vencimento inicial
    "dueDate[le]"?: string; // Filtrar a partir da data de vencimento final
    "estimatedCreditDate[ge]"?: string; // Filtrar a partir da data estimada de crédito inicial
    "estimatedCreditDate[le]"?: string; // Filtrar a partir da data estimada de crédito final
    externalReference?: string; // Filtrar pelo Identificador do seu sistema
}

export interface AsaasConstructor {
    sandbox?: boolean;
    apiVersion?: string;
    accessToken: string;
}
