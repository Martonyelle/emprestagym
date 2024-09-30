import * as config from '../config.json';
import { GoogleAuthProvider, EmailAuthProvider } from "firebase/auth";
import { isLogLevelString } from './@shared/helpers/helpers';

const RUN_LOCAL =  config.runLocal;

let API_URL: string;
switch (config.environment) {
    case 'prod':
        API_URL = config.apiUrl.prod;
        break;
    case 'qa':
        API_URL = config.apiUrl.qa;
        break;
    case 'dev':
        API_URL = config.apiUrl.dev;
        break;
    default:
        API_URL = config.apiUrl.prod;
        break;
}

const LOG_LEVEL = isLogLevelString(config.logLevel) ? config.logLevel: 'silent';

const firebaseConfig = {
    apiKey: config.apiKey,
    authDomain: config.authDomain,
    projectId: config.projectId,
    storageBucket: config.storageBucket,
    messagingSenderId: config.messagingSenderId,
    appId: config.appId,
    measurementId: config.measurementId
};

const DEFAULT_SIGN_IN_OPTIONS = [
    GoogleAuthProvider.PROVIDER_ID,
    EmailAuthProvider.PROVIDER_ID
];


export {
    firebaseConfig,
    DEFAULT_SIGN_IN_OPTIONS,
    API_URL,
    RUN_LOCAL,
    LOG_LEVEL
}