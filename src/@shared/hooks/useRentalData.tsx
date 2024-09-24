import { useState, useEffect } from "react";
import useCollectionData from "./collectionData";
import { allocationsCollection } from "../../collections/allocation";
import { RentalItem } from "../interface/interfaces";
import { WhereFilterOp } from "firecms";

export const useRentalData = (clientFilter?: string) => {
  const [data, setData] = useState<RentalItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const filter: Partial<Record<string, [WhereFilterOp, any]>> | undefined = clientFilter
    ? { client: ["==", clientFilter] as [WhereFilterOp, any] }
    : undefined;

  const { getData } = useCollectionData<RentalItem>({
    path: "allocations",
    collection: allocationsCollection,
    filter,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getData();
        setData(result.map(entity => ({
          ...entity.values,
          id: entity.id,
        })));
      } catch (err) {
        console.error("Erro ao buscar alocações:", err);
        setError("Falha ao carregar alocações.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [clientFilter, getData]);

  return { data, loading, error };
};
