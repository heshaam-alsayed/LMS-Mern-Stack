import InstructorApplicationDetails from "@/components/admin/instructorApplication/InstructorApplicationDetails";

type Params = { id: string };
export default async function Page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return <InstructorApplicationDetails id={id} />;
}
