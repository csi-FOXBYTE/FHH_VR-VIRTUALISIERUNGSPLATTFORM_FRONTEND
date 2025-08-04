import { Box, Grid, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { TabPanel } from "../common/TabPanel";
import ObjectInfo from "./ObjectInfo";
import TransformSwitch from "./TransformSwitch";
import { useSelectedObject } from "./ViewerProvider";
import { useTranslations } from "next-intl";

export default function ObjectProperties() {
  const [selectedTab, setSelectedTab] = useState(0);
  const selectedObject = useSelectedObject();

  const t = useTranslations();

  return (
    <Grid flex={1} container flexDirection="column" width="100%" padding={2}>
      <Box
        sx={(theme) => ({
          padding: 2,
          backgroundColor: "white !important",
          boxShadow: theme.shadows[2],
        })}
      >
        <Tabs orientation="horizontal" variant="fullWidth" value={selectedTab}>
          <Tab
            disabled={selectedObject === null}
            style={{ padding: 0, minWidth: 0, width: 48 }}
            label={t('editor.informations')}
            onClick={() => setSelectedTab(0)}
            value={0}
          />
          <Tab
            disabled={selectedObject === null || selectedObject.type === "CLIPPING_POLYGON" || selectedObject.type === "TILE_3D"}
            style={{ padding: 0, minWidth: 0, width: 48 }}
            label={t('editor.transform')}
            onClick={() => setSelectedTab(1)}
            value={1}
          />
        </Tabs>
        <TabPanel
          style={{ paddingTop: 16 }}
          visible={selectedObject === null}
          index={selectedTab}
          value={selectedTab}
        ></TabPanel>
        <TabPanel
          style={{ paddingTop: 16 }}
          visible={selectedObject !== null}
          index={0}
          value={selectedTab}
        >
          <ObjectInfo selectedObject={selectedObject!} />
        </TabPanel>
        <TabPanel
          style={{ paddingTop: 16 }}
          visible={selectedObject !== null}
          index={1}
          value={selectedTab}
        >
          <TransformSwitch selectedObject={selectedObject!} />
        </TabPanel>
      </Box>
    </Grid>
  );
}
