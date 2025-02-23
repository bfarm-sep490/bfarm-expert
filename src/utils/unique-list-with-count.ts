export const getUniqueListWithCount = <TData = any>(props: { list: TData[]; field: string }) => {
  const { list, field } = props;

  const uniqueList = list.reduce(
    (acc, item: TData) => {
      const key = item[field as keyof TData] as unknown as string;
      if (!acc[key]) {
        acc[item[field as keyof TData] as unknown as string] = {
          ...item,
          count: 1,
        };
      } else {
        (acc[item[field as keyof TData] as unknown as string] as TData & { count: number }).count +=
          1;
      }
      return acc;
    },
    {} as Record<string, TData & { count: number }>,
  );

  return Object.values(uniqueList);
};
