// src/@shared/hooks/collectionData.tsx
import { FetchCollectionProps, useDataSource, WhereFilterOp } from "firecms";
import { useCallback } from "react";

interface CollectionDataHookParams<M extends Record<string, any> = any> {
  path: string;
  collection: any;
  filter?: Partial<Record<string, [WhereFilterOp, any]>>;
  limit?: number;
  startAfter?: any[];
  orderBy?: string;
  searchString?: string;
  order?: "desc" | "asc";
}

function useCollectionData<M extends Record<string, any> = any>(
  params: CollectionDataHookParams<M>
) {
  const dataSource = useDataSource();

  const getData = useCallback(async () => {
    if (typeof dataSource.fetchCollection !== "function") {
      throw new Error("fetchCollection is not a function on dataSource");
    }

    return await dataSource.fetchCollection({
      path: params.path,
      collection: params.collection,
      order: params.order || "asc",
      orderBy: params.orderBy,
      filter: params.filter,
      limit: params.limit,
      startAfter: params.startAfter,
      searchString: params.searchString,
    });
  }, [
    dataSource,
    params.path,
    params.collection,
    params.order,
    params.orderBy,
    params.filter,
    params.limit,
    params.startAfter,
    params.searchString,
  ]);

  const saveData = useCallback(
    async (
      data: M,
      id?: string,
      status: "new" | "existing" = "new"
    ) => {
      return await dataSource.saveEntity({
        path: params.path,
        collection: params.collection,
        values: data,
        entityId: id,
        status: status,
      });
    },
    [dataSource, params.path, params.collection]
  );

  return { getData, saveData };
}

export default useCollectionData;