// useRentalData.tsx

import { useState, useEffect, useMemo } from "react";
import useCollectionData from "./collectionData";
import { allocationsCollection } from "../../collections/allocation";
import { RentalItem } from "../interface/interfaces";
import { WhereFilterOp } from "firecms";

export const useRentalData = (clientFilter?: string) => {
  const [data, setData] = useState<RentalItem[]>([]);
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await getData();
        setData(
          result.map((entity) => ({
            ...entity.values,
            id: entity.id,
          }))
        );
      } catch (err) {
        console.error("Erro ao buscar alocações:", err);
        setError("Falha ao carregar alocações.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [getData]);

  return { data, loading, error };
};
