export const generatePaginationQuery = ({
  page = 1,
  perPage = 15,
}: {
  page?: number | string;
  perPage?: number | string;
}) => {
  const pageNum = Number(page) || 1;
  const perPageNum = Number(perPage) || 15;

  return {
    take: perPageNum,
    skip: (pageNum - 1) * perPageNum,
  };
};

type PaginationMetaArgs = {
  page?: number;
  perPage?: number;
  count: number;
};

export const generatePaginationMeta = ({
  page = 1,
  perPage = 15,
  count,
}: PaginationMetaArgs) => ({
  meta: {
    currentPage: page,
    itemsPerPage: perPage,
    totalItems: count,
    totalPages: Math.ceil(count / perPage),
  },
});
