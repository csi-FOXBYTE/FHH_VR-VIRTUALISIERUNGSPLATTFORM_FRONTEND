import { InfoOutlined, Note, TransformOutlined } from "@mui/icons-material";
import { Grid, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { TabPanel } from "../common/TabPanel";
import ObjectInfo from "./ObjectInfo";
import TransformSwitch from "./TransformSwitch";
import { useSelectedObject } from "./ViewerProvider";

export default function ObjectProperties() {
  const [selectedTab, setSelectedTab] = useState(0);
  const selectedObject = useSelectedObject();

  return (
    <Grid flex={1} container width="100%" height="100%">
      <Tabs
        style={{ padding: 0, borderRight: "1px solid black", height: "100%" }}
        orientation="vertical"
        variant="scrollable"
        value={selectedTab}
      >
        <Tab
          disabled={selectedObject === null}
          style={{ padding: 0, minWidth: 0, width: 48 }}
          label={<InfoOutlined />}
          onClick={() => setSelectedTab(0)}
          value={0}
        />
        <Tab
          disabled={selectedObject === null}
          style={{ padding: 0, minWidth: 0, width: 48 }}
          label={<TransformOutlined />}
          onClick={() => setSelectedTab(1)}
          value={1}
        />
        <Tab
          disabled={
            selectedObject === null || selectedObject.type !== "PROJECT_OBJECT"
          }
          style={{ padding: 0, minWidth: 0, width: 48 }}
          label={<Note />}
          onClick={() => setSelectedTab(2)}
          value={2}
        />
      </Tabs>
      <TabPanel
        visible={selectedObject === null}
        index={selectedTab}
        value={selectedTab}
      >
        Please select a entity...
      </TabPanel>
      <TabPanel visible={selectedObject !== null} index={0} value={selectedTab}>
        <ObjectInfo selectedObject={selectedObject!} />
      </TabPanel>
      <TabPanel visible={selectedObject !== null} index={1} value={selectedTab}>
        <TransformSwitch selectedObject={selectedObject!} />
      </TabPanel>
      <TabPanel
        visible={selectedObject !== null}
        index={2}
        value={selectedTab}
      ></TabPanel>
    </Grid>
  );
}
