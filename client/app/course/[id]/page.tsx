import CourseDetailS from "@/components/courseDetails/CourseDetailS";
import Header from "@/components/shared/Header";

type Params = {
  id: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return (
    <>
      <Header />
      <CourseDetailS id={id} />
    </>
  );
}
