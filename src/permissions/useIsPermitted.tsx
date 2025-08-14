"use client";

import { useMemo } from "react";
import { Permissions } from "@/constants/permissions";
import usePermissions from "./usePermissions";

export function useIsPermitted(neededPermissions: Permissions[]) {
  const permissions = usePermissions();

  const isPermitted = useMemo(() => {
    return neededPermissions.every((neededPermission) =>
      permissions.includes(neededPermission)
    );
  }, [neededPermissions, permissions]);

  return isPermitted;
}
