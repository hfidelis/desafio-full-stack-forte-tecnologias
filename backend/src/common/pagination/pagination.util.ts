/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export interface PaginatedResult<T> {
  page: number;
  page_size: number;
  count: number;
  results: T[];
}

export async function paginate<T>(
  model: any,
  args: {
    page?: number;
    page_size?: number;
    where?: any;
    select?: any;
    include?: any;
    orderBy?: any;
  },
): Promise<PaginatedResult<T>> {
  const page = args.page && args.page > 0 ? args.page : 1;
  const page_size =
    args.page_size && args.page_size > 0 && args.page_size <= 1000
      ? args.page_size
      : 10;

  const skip = (page - 1) * page_size;

  const [results, count] = await Promise.all([
    model.findMany({
      skip,
      take: page_size,
      where: args.where,
      select: args.select,
      include: args.include,
      orderBy: args.orderBy,
    }),
    model.count({ where: args.where }),
  ]);

  return {
    page,
    page_size,
    count,
    results,
  };
}
