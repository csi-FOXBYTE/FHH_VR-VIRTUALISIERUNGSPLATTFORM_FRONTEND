import { useSession } from "next-auth/react";

export default function usePermissions() {
  const session = useSession();

  const permissions = session.data?.user.permissions ?? [];

  return permissions;
}