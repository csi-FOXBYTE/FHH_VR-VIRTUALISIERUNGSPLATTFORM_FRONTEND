import { Autocomplete, TextField } from "@mui/material";
import proj4 from "proj4";
import proj4List from "proj4-list";
import { useMemo, useState } from "react";

const epsgValues = Object.values(proj4List)
  .map(([epsg, proj4]) => ({
    value: proj4,
    label: epsg,
  }))
  .sort((a, b) => a.label.localeCompare(b.label));

const initialEpsg = epsgValues.find((epsg) => epsg.label === "EPSG:25832");

const srcSRS = "+proj=geocent +datum=WGS84 +units=m +no_defs +type=crs";

export default function CoordinateInput({
  value,
  readOnly = true,
}: {
  value?: { x: number; y: number; z: number };
  onChange?: (value: { x: number; y: number; z: number }) => void;
  readOnly?: boolean;
}) {
  const [selectedEpsg, setSelectedEpsg] = useState<{
    value: string;
    label: string;
  }>(initialEpsg!);

  const transformedValue = useMemo(() => {
    if (!value) return null;

    const transformer = proj4(srcSRS, selectedEpsg.value);

    const result = transformer.forward([value?.x, value.y, value.z]);

    return { x: result[0], y: result[1], z: result[2] };
  }, [value, selectedEpsg.value]);

  return (
    <>
      <Autocomplete
        disablePortal
        renderInput={(params) => <TextField {...params} label="EPSG" />}
        value={selectedEpsg}
        disableClearable
        onChange={(_, newValue) => setSelectedEpsg(newValue)}
        options={epsgValues}
      />
      <TextField value={transformedValue?.x} disabled={readOnly} />
      <TextField value={transformedValue?.y} disabled={readOnly} />
      <TextField value={transformedValue?.z} disabled={readOnly} />
    </>
  );
}
