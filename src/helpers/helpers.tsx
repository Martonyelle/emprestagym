import { LogLevelString } from "@firebase/logger";
import { Observable } from "rxjs";
import { API_URL } from "../config";
import { getAuthToken } from "./authHelpers";
import { APIResponse } from "../@shared/interface/common";
import Asaas from "asaas";

// Função para converter um Map em JSON
export const mapToJson = (map: Map<any, any>) => {
  return JSON.parse(JSON.stringify(Object.fromEntries(map)));
};

// Função para verificar se uma string é base64
export function isBase64(str: string): boolean {
  try {
    return btoa(atob(str)) === str;
  } catch (err) {
    return false;
  }
}

// Função para decodificar base64
export function decodeBase64(base64: string): string {
  return atob(base64);
}

// Função para fazer requisições HTTP usando Observable
export function fetchData(
  method: string,
  endpoint: string,
  errorMessage: string,
  body?: any
): Observable<APIResponse> {
  return new Observable<APIResponse>((observer: { error: (arg0: { success: boolean; error: any; }) => void; next: (arg0: { success: boolean; data: any; }) => void; complete: () => void; }) => {
    (async () => {
      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        // Obtenha o token de acesso de forma segura
        const accessToken = await getAuthToken();

        if (accessToken) {
          headers["Authorization"] = `Bearer ${accessToken}`;
        }

        const url = new URL(API_URL + endpoint);

        const requestOptions: RequestInit = {
          method: method,
          headers: headers,
        };

        // Adicionar parâmetros à URL para requisições GET e não incluir body
        if (method === "GET" && body) {
          Object.keys(body).forEach((key) => {
            if (body[key] !== undefined) {
              url.searchParams.append(key, body[key]);
            }
          });
        } else if (body) {
          requestOptions.body = JSON.stringify(body);
        }

        const response = await fetch(url.toString(), requestOptions);
        const contentType = response.headers.get("Content-Type");

        let data: any = null;
        if (response.status !== 204) {
          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            const textData = await response.text();
            data = textData;
          }
        }

        if (!response.ok) {
          const errorData =
            data && data.message ? data : new Error(`Falha ao ${errorMessage}`);
          observer.error({ success: false, error: errorData });
        } else {
          observer.next({ success: true, data: data });
          observer.complete();
        }
      } catch (error) {
        observer.error({ success: false, error: error });
      }
    })();
  });
}

/**
 * Função para buscar dados de endpoint como EventSource - Útil para barras de carregamento
 * @param endpoint
 * @param errorMessage
 * @param body
 * @returns Observable
 */
export function fetchAndWatch(
  endpoint: string,
  errorMessage: string,
  body?: any
): Observable<any | APIResponse> {
  return new Observable<APIResponse | any>((observer: { next: (arg0: { progress: number; }) => void; error: (arg0: { success: boolean; error: unknown; }) => void; complete: () => void; }) => {
    (async () => {
      try {
        // Obtenha o token de acesso de forma segura
        const accessToken = await getAuthToken();

        let queryParams = "";

        if (accessToken) {
          if (!body) body = {};
          body["token"] = accessToken;
        }

        if (body) {
          queryParams = new URLSearchParams(body).toString();
        }

        let progress = 0;
        const initialProgress = setInterval(() => {
          // Emitindo o início da requisição
          progress++;
          observer.next({ progress: progress });
        }, 250);

        const evtSource = new EventSource(`${API_URL + endpoint}?${queryParams}`);
        evtSource.onmessage = function (event) {
          clearInterval(initialProgress);
          const data = JSON.parse(event.data);
          if (data.success !== undefined) {
            if (data.success) {
              observer.next(data);
            } else {
              observer.error(data);
            }
            evtSource.close();
            observer.complete();
          } else {
            observer.next(data);
          }
        };

        evtSource.onerror = function (error) {
          clearInterval(initialProgress);
          console.error("Erro no EventSource:", error);
          observer.error({ success: false, error: error });
          evtSource.close();
          observer.complete();
        };
      } catch (error) {
        observer.error({ success: false, error: error });
      }
    })();
  });
}

// Função para normalizar números de telefone
export function normalizePhone(phone: string) {
  if (phone && typeof phone == "string") {
    const normalizedPhone = phone
      .replace(/\s+/g, "")
      .replace(/[()\-]/g, "")
      .replace(/^\+/, "");
    return normalizedPhone;
  } else {
    return "";
  }
}

// Função para copiar texto para a área de transferência
export function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text).then(
      () => {
        return text;
      },
      (err) => {
        return null;
      }
    );
  } catch (err) {
    return null;
  }
}

// Função para verificar se o nível de log é válido
export function isLogLevelString(level: any): level is LogLevelString {
  return ["debug", "verbose", "info", "warn", "error", "silent"].includes(level);
}

// Função para baixar um arquivo a partir de uma URL
export function downloadFileFromURL(url: string, filename: string) {
  fetch(url, { mode: "cors" })
    .then((response) => response.blob())
    .then((blob) => {
      const fileURL = window.URL.createObjectURL(blob);
      const alink = document.createElement("a");
      alink.href = fileURL;
      alink.target = "_blank";
      alink.download = filename;
      document.body.appendChild(alink);
      alink.click();
      document.body.removeChild(alink);
    })
    .catch((error) => {
      console.error("Erro ao baixar o arquivo:", error);
    });
}

// Função para abrir um link
export function openLink(url: string, newTab: boolean = false) {
  const alink = document.createElement("a");
  alink.href = url;
  if (newTab) alink.target = "_blank";
  document.body.appendChild(alink);
  alink.click();
  document.body.removeChild(alink);
}

// Função para baixar um arquivo a partir de dados binários
export function downloadFileFromBinary(
  binaryData: Blob | ArrayBuffer,
  filename: string
): void {
  const blob = binaryData instanceof Blob ? binaryData : new Blob([binaryData]);
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Função para baixar um arquivo a partir de uma string base64
export function downloadFileFromBase64(base64: string, filename: string): void {
  const link = document.createElement("a");
  link.href = `data:application/octet-stream;base64,${base64}`;
  link.download = filename;

  document.body.appendChild(link);
  link.click();

  document.body.removeChild(link);
}

// Função para converter uma string para snake_case
export function toSnakeCase(input: string): string {
  const trimmed = input.trim();
  return trimmed
    .replace(/\s+/g, "_")
    .replace(/[^\w\s]/g, "")
    .toLowerCase();
}

// Função para calcular a idade a partir de uma data de nascimento
export function calcularIdade(dataNascimento: Date): number {
  const hoje: Date = new Date();
  let idade: number = hoje.getFullYear() - dataNascimento.getFullYear();
  const m: number = hoje.getMonth() - dataNascimento.getMonth();

  if (m < 0 || (m === 0 && hoje.getDate() < dataNascimento.getDate())) {
    idade--;
  }

  return idade;
}

// Função para integrar cliente ao Asaas usando Observable
export function addClientToAsaas(clientData: any): Observable<APIResponse> {
  return new Observable<APIResponse>((observer) => {
    (async () => {
      try {
        const asaasAccessToken = await getAuthToken();

        if (!asaasAccessToken) {
          throw new Error("Token de acesso ao Asaas não fornecido!");
        }

        const asaas = new Asaas({
          apiVersion: "v3",
          sandbox: false, // Defina conforme necessário
          accessToken: asaasAccessToken,
        });

        const asaasCustomerObj = {
          name: clientData.name,
          cpfCnpj: clientData.cpfCnpj,
          email: clientData.email,
          phone: normalizePhone(clientData.phone),
          mobilePhone: normalizePhone(clientData.mobilePhone),
          externalReference: clientData.id,
          address: clientData.address?.street,
          addressNumber: clientData.address?.number,
          complement: clientData.address?.complement,
          province: clientData.address?.city,
          postalCode: clientData.address?.postalCode,
        };

        const createAsaasCustomer = await asaas.createCustomer(asaasCustomerObj);

        if (createAsaasCustomer.success) {
          observer.next({ success: true, data: createAsaasCustomer.data });
          observer.complete();
        } else {
          throw new Error(
            `Erro ao criar cliente no Asaas: ${JSON.stringify(
              createAsaasCustomer.data
            )}`
          );
        }
      } catch (error) {
        observer.error({ success: false, error: error });
      }
    })();
  });
}