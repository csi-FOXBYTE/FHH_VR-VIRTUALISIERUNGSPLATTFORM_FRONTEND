import {
  Divider,
  Grid2,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import UserAvatar from "../common/UserAvatar";
import {
  AdminPanelSettingsOutlined,
  DesktopWindows,
  Logout,
  PersonOutlined,
} from "@mui/icons-material";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "@/server/i18n/routing";

export default function ProfileMenu({
  anchorEl,
  close,
}: {
  anchorEl: HTMLElement | null;
  close: () => void;
}) {
  const session = useSession();

  const handleLogout = () => {
    signOut();
  };

  const t = useTranslations();

  return (
    <Menu
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      onClose={close}
      onClick={close}
      open={anchorEl !== null}
      anchorEl={anchorEl}
    >
      <MenuItem style={{ display: "flex", gap: 8 }}>
        <UserAvatar />
        <Grid2>
          <Typography variant="body1">{session.data?.user.name}</Typography>
          <Typography variant="caption">{session.data?.user.email}</Typography>
        </Grid2>
      </MenuItem>
      <Divider />
      <MenuItem>
        <ListItemIcon>
          <DesktopWindows />
        </ListItemIcon>
        <Grid2>
          <Typography variant="body1">{t("navbar.system-version")}</Typography>
          <Typography variant="caption">v{process.env.version}</Typography>
        </Grid2>
      </MenuItem>
      <Divider />
      <MenuItem component={Link} href="/profile">
        <ListItemIcon>
          <PersonOutlined />
        </ListItemIcon>
        {t("navbar.profile")}
      </MenuItem>
      <MenuItem component={Link} href="/project-management">
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        {t("navbar.project-management")}
      </MenuItem>
      <MenuItem component={Link} href="/collaboration">
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        {t("navbar.collaboration")}
      </MenuItem>
      <MenuItem component={Link} href="/administration">
        <ListItemIcon>
          <AdminPanelSettingsOutlined />
        </ListItemIcon>
        {t("navbar.administration")}
      </MenuItem>
      <Divider />
      <MenuItem onClick={handleLogout}>
        <ListItemIcon>
          <Logout />
        </ListItemIcon>
        {t("navbar.sign-out")}
      </MenuItem>
    </Menu>
  );
}
