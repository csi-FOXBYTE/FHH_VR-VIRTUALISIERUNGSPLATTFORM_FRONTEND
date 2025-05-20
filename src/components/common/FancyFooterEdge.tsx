import { useTheme } from "@mui/material";
import { CSSProperties } from "react";

export default function FancyFooterEdge({ style = {} }: { style?: CSSProperties }) {
  const theme = useTheme();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="56.876 186.7614 340 93.6424"
      width="324.756px"
      height="93.6424px"
      style={style}
    >
      <path
        style={{ fill: theme.palette.primary.main, filter: "drop-shadow(2px 2px 4px rgba(0, 0, 0, 0.5))" }}
        d="M 56.876 187.607 C 56.876 187.607 380.221 186.031 381.579 187.182 C 383.508 188.817 332.271 277.586 308.15 278.439 C 224.442 281.399 56.876 280.136 56.876 280.136 L 56.876 187.607 Z"
        id="object-0"
        transform="matrix(1, 0, 0, 1, 0, 7.105427357601002e-15)"
      />
    </svg>
  );
}
