import CourseDetailS from "@/components/courseDetails/CourseDetailS";
type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return <CourseDetailS id={id} />;
}
