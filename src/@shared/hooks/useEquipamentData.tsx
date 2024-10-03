import { useState, useEffect } from "react";
import { Equipment, equipmentsCollection } from "../../collections/equipments";
import { Entity } from "firecms";
import useCollectionData from "./collectionData";
import { WhereFilterOp } from "firecms";

export const useEquipmentData = (equipmentId?: string) => {
    const [data, setData] = useState<Equipment[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const filter: Partial<Record<string, [WhereFilterOp, any]>> | undefined = equipmentId
        ? { id: ["==", equipmentId] as [WhereFilterOp, any] }
        : undefined;

    const { getData } = useCollectionData<Equipment>({
        path: "equipments",
        collection: equipmentsCollection,
        filter,
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const result: Entity<Equipment>[] = await getData();
                const equipments = result.map((entity) => ({
                    ...entity.values,
                    id: entity.id,
                }));
                setData(equipments);
            } catch (err) {
                console.error("Erro ao buscar equipamentos:", err);
                setError("Falha ao carregar equipamentos.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [equipmentId, getData]);

    return { data, loading, error };
};
