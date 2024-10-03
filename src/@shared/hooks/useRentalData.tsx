import { useState, useEffect, useMemo } from "react";
import useCollectionData from "./collectionData";
import { allocationsCollection } from "../../collections/allocation";
import { RentalItem } from "../interface/interfaces";
import { WhereFilterOp, Entity } from "firecms";

export interface EnhancedRentalItem extends RentalItem {
  clientName: string;
}

export const useRentalData = (clientFilter?: string) => {
  const [data, setData] = useState<EnhancedRentalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filter = useMemo(() => {
    return clientFilter
      ? { client: ["==", clientFilter] as [WhereFilterOp, any] }
      : undefined;
  }, [clientFilter]);

  const memoizedParams = useMemo(
    () => ({
      path: "allocations",
      collection: allocationsCollection,
      filter,
    }),
    [filter]
  );

  const { getData } = useCollectionData<RentalItem>(memoizedParams);
  
  const clientsParams = useMemo(
    () => ({
      path: "allocations",
      collection: allocationsCollection,
      filter,
    }),
    [filter]
  );

  const { getData: getClientsData } = useCollectionData<{ name: string }>(clientsParams);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const rentals: Entity<RentalItem>[] = await getData();
        const clients: Entity<{ name: string }>[] = await getClientsData();

        const clientMap: Record<string, string> = {};
        clients.forEach((client) => {
          clientMap[client.id] = client.values.name;
        });

        const enhancedRentals: EnhancedRentalItem[] = rentals.map((rental) => ({
          ...rental.values,
          id: rental.id,
          clientName: clientMap[rental.values.client.id] || "Nome não encontrado",
        }));

        setData(enhancedRentals);
      } catch (err) {
        console.error("Erro ao buscar alocações ou clientes:", err);
        setError("Falha ao carregar alocações.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getData, getClientsData]);

  return { data, loading, error };
};
