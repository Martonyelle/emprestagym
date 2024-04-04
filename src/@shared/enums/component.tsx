import { EnumValues } from "firecms";

const brStatesEnum: EnumValues = {
    AC: { id: 'AC', label: 'Acre', color: 'grayLight' },
    AL: { id: 'AL', label: 'Alagoas', color: 'grayLight' },
    AP: { id: 'AP', label: 'Amapá', color: 'grayLight' },
    AM: { id: 'AM', label: 'Amazonas', color: 'grayLight' },
    BA: { id: 'BA', label: 'Bahia', color: 'grayLight' },
    CE: { id: 'CE', label: 'Ceará', color: 'grayLight' },
    DF: { id: 'DF', label: 'Distrito Federal', color: 'grayLight' },
    ES: { id: 'ES', label: 'Espírito Santo', color: 'grayLight' },
    GO: { id: 'GO', label: 'Goiás', color: 'grayLight' },
    MA: { id: 'MA', label: 'Maranhão', color: 'grayLight' },
    MT: { id: 'MT', label: 'Mato Grosso', color: 'grayLight' },
    MS: { id: 'MS', label: 'Mato Grosso do Sul', color: 'grayLight' },
    MG: { id: 'MG', label: 'Minas Gerais', color: 'grayLight' },
    PA: { id: 'PA', label: 'Pará', color: 'grayLight' },
    PB: { id: 'PB', label: 'Paraíba', color: 'grayLight' },
    PR: { id: 'PR', label: 'Paraná', color: 'grayLight' },
    PE: { id: 'PE', label: 'Pernambuco', color: 'grayLight' },
    PI: { id: 'PI', label: 'Piauí', color: 'grayLight' },
    RJ: { id: 'RJ', label: 'Rio de Janeiro', color: 'grayLight' },
    RN: { id: 'RN', label: 'Rio Grande do Norte', color: 'grayLight' },
    RS: { id: 'RS', label: 'Rio Grande do Sul', color: 'grayLight' },
    RO: { id: 'RO', label: 'Rondônia', color: 'grayLight' },
    RR: { id: 'RR', label: 'Roraima', color: 'grayLight' },
    SC: { id: 'SC', label: 'Santa Catarina', color: 'grayLight' },
    SP: { id: 'SP', label: 'São Paulo', color: 'grayLight' },
    SE: { id: 'SE', label: 'Sergipe', color: 'grayLight' },
    TO: { id: 'TO', label: 'Tocantins', color: 'grayLight' }
};

const statusEnum: EnumValues = {
    active: { id: 'active', label: 'Ativo', color: 'greenDarker' },
    inactive: { id: 'inactive', label: 'Inativo', color: 'redDark' }
}

export {
    brStatesEnum,
    statusEnum,
}