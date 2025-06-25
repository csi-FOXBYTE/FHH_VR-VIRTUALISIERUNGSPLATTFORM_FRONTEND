import { Prisma } from "@prisma/client";
import { FilterModelZodType, SortModelZodType } from "./zodTypes";
import {
  createDateTimeFilter,
  createNumberFilter,
  createStringFilter,
} from "./gridFilterServerSideHelpers";

export function createFilters(
  modelName: string,
  quickFilterableFields: string[],
  filterModel: FilterModelZodType
) {
  const model = Prisma.dmmf.datamodel.models.find(
    (model) => model.name === modelName
  );

  if (!model)
    throw new Error(
      `Found no model for ${model}, available models are "${Prisma.dmmf.datamodel.models
        .map((model) => model.dbName ?? model.name)
        .join(", ")}"`
    );

  const where: any = {};

  let filters: any[] = [];
  if ((filterModel.logicOperator ?? "or") === "or") {
    where.OR = [];
    filters = where.OR;
  } else {
    where.AND = [];
    filters = where.AND;
  }

  for (const filterItem of filterModel.items) {
    if (!filterItem.field) continue;

    const accessor = filterItem.field.split(".");

    if (accessor.length > 1) continue;

    const field = model.fields.find((field) => field.name === filterItem.field);

    if (!field) throw new Error("Found no matching field!");

    switch (field.type) {
      case "String":
        filters.push({ [field.name]: createStringFilter(filterItem) });
        break;
      case "Float":
        filters.push({ [field.name]: createNumberFilter(filterItem) });
        break;
      case "DateTime":
        filters.push({ [field.name]: createDateTimeFilter(filterItem) });
        break;
    }
  }

  const whereOr: any[] = [];

  for (const quickFilterValue of filterModel.quickFilterValues ?? []) {
    whereOr.push(
      ...quickFilterableFields.map((quickFilterableValue) => ({
        [quickFilterableValue]: { contains: quickFilterValue },
      }))
    );
  }

  if (whereOr.length > 0) where.OR = whereOr;

  if (where.OR?.length === 0) delete where.OR;

  return where;
}

export function createSort(modelName: string, sortModel: SortModelZodType) {
    const model = Prisma.dmmf.datamodel.models.find(
        (model) => model.name === modelName
      );
    
      if (!model)
        throw new Error(
          `Found no model for ${model}, available models are "${Prisma.dmmf.datamodel.models
            .map((model) => model.dbName ?? model.name)
            .join(", ")}"`
        );

    const orderBy: Record<string, any> = {};

    for (const sortItem of sortModel) {
        if (!sortItem.sort) continue;

        const accessor = sortItem.field.split(".");

        if (accessor.length > 1) continue;

        const field = model.fields.find(field => field.name === sortItem.field);

        if (!field) throw new Error("Found no matching field!");

        orderBy[sortItem.field] = sortItem.sort;
    }

    return orderBy;
}
