export const buildCommentFilters = (query: any, lessonId: string) => {
  const {
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const filter: any = { lesson: lessonId };
  if (search) {
    filter.text = { $regex: search, $options: 'i' };
  }

  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const pagination = {
    page: +page,
    limit: +limit,
    skip: (+page - 1) * +limit,
  };

  return { filter, sort, pagination };
};
