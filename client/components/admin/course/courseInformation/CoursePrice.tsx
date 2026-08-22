"use client";

type Props = {
  price: string;
  estimatedPrice: string;
  setPrice: (value: string) => void;
  setEstimatedPrice: (value: string) => void;
};

export default function CoursePrice({
  price,
  estimatedPrice,
  setPrice,
  setEstimatedPrice,
}: Props) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      <div className="space-y-2">
        <label htmlFor="price" className="text-sm font-medium text-foreground">
          Price
        </label>

        <input
          id="price"
          type="number"
          min={0}
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Enter current price"
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <label
          htmlFor="estimatedPrice"
          className="text-sm font-medium text-foreground">
          Estimated Price
        </label>

        <input
          id="estimatedPrice"
          type="number"
          min={0}
          value={estimatedPrice}
          onChange={(e) => setEstimatedPrice(e.target.value)}
          placeholder="Enter original price"
          required
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
        />
      </div>
    </div>
  );
}
