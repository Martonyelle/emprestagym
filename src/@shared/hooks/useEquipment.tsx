// src/@shared/hooks/useEquipment.tsx
import { useState, useEffect } from "react";
import { useDataSource } from "firecms";
import { Equipment, equipmentsCollection } from "../../collections/equipments";
import { Entity } from "firecms";

export const useEquipment = (equipmentId: string) => {
    const dataSource = useDataSource();
    const [equipment, setEquipment] = useState<Equipment | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!equipmentId) {
            setError("ID do equipamento não fornecido.");
            setLoading(false);
            return;
        }

        const fetchEquipment = async () => {
            setLoading(true);
            try {
                const entity: Entity<Equipment> | undefined = await dataSource.fetchEntity({
                    path: "equipments",
                    entityId: equipmentId,
                    collection: equipmentsCollection,
                });

                if (entity) {
                    const equipmentData: Equipment = {
                        ...entity.values,
                        id: entity.id,
                    };
                    setEquipment(equipmentData);
                } else {
                    setError("Equipamento não encontrado.");
                }
            } catch (err: any) {
                console.error("Erro ao buscar equipamento:", err);
                setError("Falha ao carregar equipamento.");
            } finally {
                setLoading(false);
            }
        };

        fetchEquipment();
    }, [equipmentId, dataSource]);

    return { equipment, loading, error };
};
