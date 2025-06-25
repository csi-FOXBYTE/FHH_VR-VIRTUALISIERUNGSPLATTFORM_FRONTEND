import { z } from "zod";

export const filterModelZod = z.object({
  items: z.array(
    z.object({
      id: z.union([z.string(), z.number()]).optional(),
      field: z.string(),
      value: z.any().optional(),
      operator: z.string(), // Needs better typing,
    })
  ),
  logicOperator: z.union([z.literal("and"), z.literal("or")]).optional(),
  quickFilterValues: z.array(z.any()).optional(),
  quickFilterLogicOperator: z
    .union([z.literal("and"), z.literal("or")])
    .optional(),
  quickFilterExcludeHiddenColumns: z.boolean().optional(),
});
export type FilterModelZodType = z.infer<typeof filterModelZod>;


export const paginationModelZod = z.object({
  pageSize: z.number(),
  page: z.number(),
});
export type PaginationModelZodType = z.infer<typeof paginationModelZod>;


export const sortModelZod = z.array(
  z.object({
    sort: z.union([z.literal("asc"), z.literal("desc")]).nullish(),
    field: z.string(),
  })
);
export type SortModelZodType = z.infer<typeof sortModelZod>;

export const dataGridZod = z.object({
  paginationModel: paginationModelZod
    .optional()
    .default({ page: 0, pageSize: 50 }),
  filterModel: filterModelZod.optional().default({
    items: [],
  }),
  sortModel: sortModelZod.optional().default([]),
});
export type DataGridZodType = z.infer<typeof dataGridZod>;