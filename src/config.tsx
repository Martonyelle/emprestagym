import * as config from '../config.json'; // Certifique-se de que o caminho esteja correto
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { isLogLevelString } from './@shared/helpers/helpers';

// Como não temos ambientes específicos, usaremos apiUrl diretamente
const API_URL: string = config.apiUrl;

const LOG_LEVEL = isLogLevelString(config.logLevel) ? config.logLevel : 'silent';

// Configuração do Firebase simplificada sem ambientes específicos
const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
};

// Opções padrão de login
const DEFAULT_SIGN_IN_OPTIONS = [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID
];

// Configuração da Algolia simplificada sem ambientes específicos
const algoliaConfig = {
    appId: config.algolia.appId,
    apiKey: config.algolia.apiKey
}

// Exportando as configurações para uso em outros locais do projeto
export {
    firebaseConfig,
    algoliaConfig,
    DEFAULT_SIGN_IN_OPTIONS,
    API_URL,
    LOG_LEVEL
};
