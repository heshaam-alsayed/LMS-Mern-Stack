import { Query } from "mongoose";

class ApiFeatures<T> {
  query: Query<any[], T>;
  queryString: Record<string, any>;
  page: number;
  limit: number;

  constructor(query: Query<any[], T>, queryString: Record<string, any>) {
    this.query = query;
    this.queryString = queryString;
    this.page = Number(queryString.page) || 1;
    this.limit = Number(queryString.limit) || 10;
  }

  filter(fields: string[]) {
    // Copy query string so we don't modify the original
    const queryObj = { ...this.queryString };
    // Remove fields that are not allowed
    Object.keys(queryObj).forEach((field) => {
      if (!fields.includes(field)) {
        delete queryObj[field];
      }
    });

    // Convert:
    // gte -> $gte
    // gt  -> $gt
    // lte -> $lte
    // lt  -> $lt
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    // Apply filter to mongoose query
    const filterQuery = JSON.parse(queryStr);
    this.query = this.query.find(filterQuery);

    return this;
  }

  search(fields: string[]) {
    const search = this.queryString.search;

    if (search) {
      this.query = this.query.find({
        $or: fields.map((field) => ({
          [field]: {
            $regex: search,
            $options: "i",
          },
        })),
      });
    }

    return this;
  }

  sort(fields: string[]) {
    const sort = this.queryString.sort;

    // Default sort
    if (!sort) {
      this.query = this.query.sort("-createdAt");

      return this;
    }

    const sortFields = sort.split(",");

    const validSortFields = sortFields.filter((sortField: string) => {
      const field = sortField.startsWith("-")
        ? sortField.substring(1)
        : sortField;

      return fields.includes(field);
    });

    if (validSortFields.length > 0) {
      this.query = this.query.sort(validSortFields.join(" "));
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const skip = (this.page - 1) * this.limit;

    this.query = this.query.skip(skip).limit(this.limit);

    return this;
  }
  getPagination(total: number) {
    const totalPages = Math.ceil(total / this.limit);

    return {
      currentPage: this.page,
      limit: this.limit,
      total,
      totalPages,
      hasNextPage: this.page < totalPages,
      hasPreviousPage: this.page > 1,
    };
  }
}

export default ApiFeatures;
