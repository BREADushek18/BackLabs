import { ParsedQs } from 'qs';

export function buildCourseFilters(query: ParsedQs) {
  const filters: any = {};

  if (query.search) {
    filters.title = { $regex: query.search as string, $options: 'i' };
  }

  if (query.category) {
    filters.category = query.category;
  }

  if (query.level) {
    filters.level = query.level;
  }

  return filters;
}
