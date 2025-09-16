"use client";

import { Close } from "@mui/icons-material";
import {
  Box,
  Dialog,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { useLocale } from "next-intl";
import PageContainer from "../common/PageContainer";
import HelpDE from "./translations/de.mdx";
import HelpEN from "./translations/en.mdx";

import { MDXComponents } from "mdx/types";

export default function Help({
  open,
  close,
}: {
  open: boolean;
  close: () => void;
}) {
  return (
    <Dialog fullScreen open={open} onClose={close}>
      <PageContainer>
        <LocaleSwitch />
        <IconButton
          onClick={close}
          sx={{ position: "fixed", top: 16, right: 16 }}
        >
          <Close />
        </IconButton>
      </PageContainer>
    </Dialog>
  );
}

const components = {
  wrapper: (props) => (
    <Grid
      {...props}
      container
      flexDirection="column"
      sx={{ padding: 4 }}
      spacing={0}
      gap={0}
    />
  ),
  blockquote: (props) => <Box {...props} sx={theme => ({ padding: "16px 32px", marginTop: 2, marginBottom: 2, backgroundColor: theme.palette.grey[300] })} />,
  img: (props) => (
    <img
      // sizes="100vw"
      style={{ width: "100%", height: "auto" }}
      // unoptimized
      {...props}
    />
  ),
  hr: (props) => <Divider {...props} />,
  p: (props) => <Typography component="p" textAlign="justify" {...props} />,
} satisfies MDXComponents;

function LocaleSwitch() {
  const locale = useLocale();

  switch (locale) {
    case "en":
      return <HelpEN components={components} />;
    case "de":
      return <HelpDE components={components} />;
  }
}
