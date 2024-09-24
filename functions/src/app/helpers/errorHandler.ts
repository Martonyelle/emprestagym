import {Response} from "express";

const handleError = (error: any, res: Response) => {
  // FOR Debug
  console.log("handleError:", JSON.stringify(error));

  if (error instanceof Error || (error.name && error.message)) {
    switch (error.name) {
    case "missingAuth":
      res.status(401).json({
        title: "Não autorizado",
        message: error.message,
      });
      return;
    case "missingParams":
      res.status(400).json({
        title: "Erro de processamento",
        message: error.message,
      });
      return;
    case "badRequest":
      res.status(422).json({
        title: "Requisição Inválida",
        message: error.message,
      });
      return;
    case "notFound":
      res.status(404).json({
        title: "Não Encontrado!",
        message: error.message,
      });
      return;
    default:
      res.status(500).json({
        title: "Erro!",
        message: error.message,
      });
      break;
    }
  } else {
    if (error.message) {
      res.status(500).send(error.message);
    } else {
      res.status(500).send(error);
    }
  }
};

const handleErrorNoRes = (error: any) => {
  // FOR Debug
  console.log("handleErrorNoRes:", error);

  if (error instanceof Error || (error.name && error.message)) {
    switch (error.name) {
    case "missingAuth":
      return {
        status: 401,
        title: "Não autorizado",
        message: error.message,
      };
    case "missingParams":
      return {
        status: 400,
        title: "Erro de processamento",
        message: error.message,
      };
    case "badRequest":
      return {
        status: 422,
        title: "Requisição Inválida",
        message: error.message,
      };
    case "notFound":
      return {
        status: 404,
        title: "Não Encontrado!",
        message: error.message,
      };
    default:
      return {
        status: 500,
        title: "Erro!",
        message: error.message,
      };
    }
  } else {
    if (error.message) {
      return error.message;
    } else {
      return error;
    }
  }
};

export {
  handleError,
  handleErrorNoRes,
};
