"use client";



export default function CourseNavigation() {
  return (
    <div className="flex justify-end border-t pt-5">
      <button
        type="submit"
        className="rounded-md bg-blue-900 px-10 text-white py-2.5 text-sm font-medium  transition-opacity hover:opacity-90"
      >
        Next
      </button>
    </div>
  );
}