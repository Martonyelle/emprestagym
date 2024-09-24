import {Response} from "express";

export const zeroPad = (num: number, places: number) => {
  const zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
};

export const writeChunk = (data: any, res: Response): void => {
  res.write(`data: ${JSON.stringify(data)}\n\n`);
};

export const removeNullProps = <T extends object>(obj: T): T => {
  const objNotNull: Partial<T> = {};

  Object.keys(obj).forEach((chave) => {
    if (obj[chave as keyof T] !== null) {
      objNotNull[chave as keyof T] = obj[chave as keyof T];
    }
  });

  return objNotNull as T;
};

/**
 * Faz Merge em dois objetos quaisquer, setando qual deve ser priorizado para substituição em caso de conflitos de chaves
 * @param {any} obj1 Objeto Qualquer
 * @param {any} obj2 Objeto Qualquer
 * @param {string} priority Qual objeto deve ser priorizado - 'first' | 'second'
 * @return {any} mergedObject
 */
export function mergeObjects(obj1: any, obj2: any, priority: "first" | "second"): any {
  // Retorna um novo objeto combinado com as propriedades de ambos os objetos
  // A ordem do spread determina a prioridade de substituição
  if (priority === "first") {
    return {...obj2, ...obj1}; // obj1 tem prioridade
  } else {
    return {...obj1, ...obj2}; // obj2 tem prioridade
  }
}

export const daysToMilliseconds = (days: number): number => {
  const millisecondsInADay = 24 * 60 * 60 * 1000;
  return days * millisecondsInADay;
};

/**
 * Seta a resposta como event-stream
 * @param {Response} res Response do Express
 */
export const setupSSEHeaders = (res: Response): void => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
};
