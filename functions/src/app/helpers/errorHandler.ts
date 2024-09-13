import {Response} from "express";

const handleError = (error: any, res: Response) => {
  // FOR Debug
  console.log(error);

  if (error instanceof Error || (error.name && error.message)) {
    switch (error.name) {
    case "missingParams":
      res.status(400).json({
        title: "Erro de processamento",
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

export {
  handleError,
};
