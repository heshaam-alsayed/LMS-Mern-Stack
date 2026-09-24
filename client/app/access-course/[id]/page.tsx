import EnrolledContentCourse from "@/components/ContentCourse/EnrolledContentCourse";
import Header from "@/components/shared/Header";

type Params = {
  id: string;
};
export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return <div className="lg:container lg:mx-auto">
    <Header/>
    <EnrolledContentCourse id={id} />
  </div>;
}
