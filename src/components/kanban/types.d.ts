type Column<D extends Record<any, any>> = {
  title: string;
  key: string;
  render: (record: D) => ReactNode;
};
