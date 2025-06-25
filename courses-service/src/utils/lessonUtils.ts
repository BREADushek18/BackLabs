export const buildLessonFilters = (query: any) => {
  const {
    courseId,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    limit = 10,
  } = query;

  const filter: any = {};
  if (courseId) filter.course = courseId;
  if (search) filter.title = { $regex: search, $options: 'i' };

  const sort: any = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const pagination = {
    page: +page,
    limit: +limit,
    skip: (+page - 1) * +limit,
  };

  return { filter, sort, pagination };
};
