import { $Enums } from "@prisma/client";

export const PERMISSIONS = $Enums.PERMISSIONS;
export const permissions = Object.values(PERMISSIONS);
export type Permissions = keyof typeof PERMISSIONS;
