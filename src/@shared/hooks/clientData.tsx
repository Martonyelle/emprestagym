import { useState, useEffect } from "react";
import useCollectionData from "./collectionData";
import { clientsCollection } from "../../collections/client/client";
import { ClientData } from "../interface/interfaces";

export const useClients = () => {
  const [clients, setClients] = useState<ClientData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { getData } = useCollectionData({
    path: "clients",
    collection: clientsCollection,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const result = await getData();
        setClients(result);
      } catch (err) {
        console.error("Erro ao buscar clientes:", err);
        setError("Falha ao carregar clientes.");
      } finally {
        setLoading(false);
      }
    };
    fetchClients();
  }, []);

  return { clients, loading, error };
};
