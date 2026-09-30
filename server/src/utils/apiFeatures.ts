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
    // Remove fields that are not allowed. A range key such as
    // "price[gte]" is allowed when its base field ("price") is allowed.
    Object.keys(queryObj).forEach((field) => {
      const baseField = field.replace(/\[(gte|gt|lte|lt)\]$/, "");

      if (!fields.includes(field) && !fields.includes(baseField)) {
        delete queryObj[field];
      }
    });

    // The app uses the extended query parser, so "price[gte]=10" arrives as
    // { price: { gte: "10" } } while a literal "price[gte]" key is also
    // supported. Both are converted into real mongo range operators, e.g.
    // { price: { $gte: 10 } }.
    const rangeOperators = ["gte", "gt", "lte", "lt"];

    // Range values are always numeric. A value that cannot be parsed is
    // dropped instead of being forwarded, so a malformed query string can
    // never reach mongoose casting and blow up with a 500.
    const toNumeric = (value: any) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }

      const numericValue = Number(value);

      return Number.isNaN(numericValue) ? null : numericValue;
    };

    const filterQuery: Record<string, any> = {};

    Object.keys(queryObj).forEach((field) => {
      const rawValue = queryObj[field];

      const rangeMatch = field.match(/^(.+)\[(gte|gt|lte|lt)\]$/);

      if (rangeMatch) {
        const fieldPath = rangeMatch[1];
        const numericValue = toNumeric(rawValue);

        if (numericValue !== null) {
          if (!filterQuery[fieldPath]) {
            filterQuery[fieldPath] = {};
          }

          filterQuery[fieldPath][`$${rangeMatch[2]}`] = numericValue;
        }

        return;
      }

      const isPlainObject =
        !!rawValue &&
        typeof rawValue === "object" &&
        !Array.isArray(rawValue);

      if (isPlainObject) {
        const operators: Record<string, any> = {};

        Object.keys(rawValue).forEach((key) => {
          if (rangeOperators.includes(key)) {
            const numericValue = toNumeric(rawValue[key]);

            if (numericValue !== null) {
              operators[`$${key}`] = numericValue;
            }
          }
        });

        // Keys that are not range operators are ignored so query string
        // values cannot inject arbitrary mongo operators such as $ne.
        if (Object.keys(operators).length > 0) {
          filterQuery[field] = operators;
        }

        return;
      }

      filterQuery[field] = rawValue;
    });

    // Apply filter to mongoose query
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
