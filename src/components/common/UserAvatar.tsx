import { Avatar, AvatarProps } from "@mui/material";
import { useSession } from "next-auth/react";

export default function UserAvatar({ alt, src, name, ...props }: AvatarProps & { name?: string }) {
  const session = useSession();

  return (
    <Avatar
      alt={alt ?? session.data?.user.name ?? undefined}
      src={src ?? session.data?.user.image ?? undefined}
      sx={theme => ({
        background: theme.palette.primary.main,
      })}
      {...props}
    >
      {(name ?? session.data?.user.name)
        ?.split(" ")
        .map((p) => p[0])
        .join("")}
    </Avatar>
  );
}
