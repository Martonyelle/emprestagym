import { LogLevelString } from "@firebase/logger"
import { API_URL } from "../../config";

const accessToken = localStorage.getItem("accessToken");
let selectedCustomerData: any = localStorage.getItem("selectedCustomerData");
if (selectedCustomerData) selectedCustomerData = JSON.parse(selectedCustomerData);

export const fetchData = async (method: string, endpoint: string, errorMessage: string, body?: any) => {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `${accessToken}`;
  }

  if(selectedCustomerData){
    headers["Customer_id"] = `${selectedCustomerData.id}`;
  }

  try {
    const requestOptions: any = {
      method: method,
      headers: headers,
    };

    if (body) {
      requestOptions.body = JSON.stringify({
        ...body
      });
    }

    const response = await fetch(API_URL + endpoint, requestOptions);

    const data = await response.json();

    if (!response.ok) {
      if (data instanceof Error || (data.message)) {
        throw data;
      } else {
        throw new Error(`Falha ao ${errorMessage}`);
      }
    }

    return { success: true, data: data }
  } catch (error) {
    return { success: false, error: error }
  }
};

export function isLogLevelString(level: any): level is LogLevelString {
  return ['debug', 'verbose', 'info', 'warn', 'error', 'silent'].includes(level);
}

export function downloadFileFromURL(url:string, filename: string){
  var opts = {
      headers: {
        'mode':'cors'
      }
  }

  fetch(url, opts).then((response) => {
      response.blob().then((blob) => {
       
          // Creating new object of PDF file
          const fileURL =
              window.URL.createObjectURL(blob);
               
          // Setting various property values
          let alink = document.createElement("a");
          alink.href = fileURL;
          alink.target = 'blank'
          alink.download = filename;
          alink.click();
          document.body.removeChild(alink);
      });
  });
}

export function openLink(url: string, newTab: boolean = false) {
  let alink = document.createElement("a");
  alink.href = url;
  if (newTab) alink.target = 'blank';
  alink.click();
  document.body.removeChild(alink);
}

export function popupAndPrint(title: string, htmlData: any) {
  var mywindow = window.open('', `${title}`, 'height=400,width=600');
  mywindow?.document.write(`<html><head><title> ${title} </title>`);
  /*optional stylesheet*/ //mywindow.document.write('<link rel="stylesheet" href="main.css" type="text/css" />');
  mywindow?.document.write('</head><body >');
  mywindow?.document.write(htmlData);
  mywindow?.document.write('</body></html>');

  mywindow?.print();
  mywindow?.close();

  return true;
}

export function downloadFileFromBinary(binaryData: Blob | ArrayBuffer, filename: string): void {
  // Criar um URL para os dados binários
  const blob = binaryData instanceof Blob ? binaryData : new Blob([binaryData]);
  const url = URL.createObjectURL(blob);

  // Criar um elemento de link para iniciar o download
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;

  // Adicionar o link ao corpo do documento
  document.body.appendChild(link);

  // Disparar o evento de clique para iniciar o download
  link.click();

  // Limpar ao finalizar: remover o link e revogar o URL de objeto
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


/**
* Função para baixar um arquivo usando uma string base64.
* @param base64 A string codificada em base64 representando os dados do arquivo.
* @param filename O nome do arquivo a ser baixado.
*/
export function downloadFileFromBase64(base64: string, filename: string): void {
  // Criar um elemento de link
  const link = document.createElement('a');

  // Definir o URL do link com o dado base64 e especificar o tipo de arquivo se necessário
  link.href = `data:application/octet-stream;base64,${base64}`;

  // Definir o nome do arquivo para o download
  link.download = filename;

  // Adicionar o link ao corpo do documento para garantir a funcionalidade em todos os navegadores
  document.body.appendChild(link);

  // Disparar o evento de clique no link
  link.click();

  // Remover o link após o download para limpeza
  document.body.removeChild(link);
}

/**
* Converte uma string para snake case.
* @param input String de entrada que será convertida para snake case.
* @returns String formatada em snake case.
*/
export function toSnakeCase(input: string): string {
  // Primeiro, remova os espaços no início e no final da string
  const trimmed = input.trim();

  // Substitua os caracteres especiais e espaços por underscores e converta para letras minúsculas
  // Os caracteres especiais são removidos ou substituídos por underscore, dependendo de sua natureza
  return trimmed
      .replace(/\s+/g, '_') // Substitui espaços consecutivos por um underscore
      .replace(/[^\w\s]/g, '') // Remove caracteres não alfanuméricos exceto underscore
      .toLowerCase(); // Converte tudo para minúsculo
}

export function capitalizeFLetter(str: string) {
  return str[0].toUpperCase() + str.slice(1);
}

export function normalizePhone(phone: string) {
  if(phone && typeof phone == 'string'){
      const split = phone.split(' ');
      split[0][0] == '+' ? split[0].slice(1) : null;

      return split.join('').replace('(','').replace(')','').replace('-','');
  } else {
      return '';
  }   
}

export function copyToClipboard(text: string) {
  try {
    navigator.clipboard.writeText(text).then(() => {
      return text;
    }, (err) => {
      return null;
    });
  } catch (err) {
    // console.error('Erro ao acessar a área de transferência:', err);
    return null;
  }
};

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
