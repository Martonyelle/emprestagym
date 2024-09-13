import {Request, Response} from "express";
import {DocumentReference} from "firebase/firestore";
import {db} from "../../config/firebase";
import {handleError} from "../helpers/errorHandler";

/**
 * Módulo responsável por buscar informações de usuário pelo email
 * @param {Request} req Request do Express
 * @param {Response} res Response do Express
 * @author Iago Nuvem
 */
const getUserByEmail = async function(req: Request, res: Response) {
  try {
    const {
      email,
    } = req.body;

    if (!email) {
      throw new Error("Preencha todos os campos obrigatórios");
    }

    const response = await db.collection("users").where("email", "==", req.body.email).get();
    if (response.empty) {
      throw new Error("Nenhum acesso encontrado com o email fornecido");
    }

    if (response.docs.length > 1) {
      throw new Error("Foram encontrados mais de um usuário com o mesmo email");
    }

    const doc = response.docs[0];
    const docData = doc.data();

    const customers: Array<Promise<any>> = docData.customers.map(async (customerReference: DocumentReference) => {
      const project = await db.doc(customerReference.path).get();
      const data:any = project.data();
      const plan = (await db.doc(data.plan_id.path).get()).data();

      return {
        id: customerReference.id,
        name: data.name,
        identifier: data.identifier,
        status: data.status,
        plan: plan ? plan.name : "",
      };
    });

    docData.customers = await Promise.all(customers);

    res.status(200).send(docData);
  } catch (error) {
    handleError(error, res);
  }
};

export {
  getUserByEmail,
};
