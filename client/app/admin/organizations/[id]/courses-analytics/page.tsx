import OrganizationCoursesAnalytics from "@/components/admin/organizationDetails/coursesAnalytics/OrganizationCoursesAnalytics";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return <OrganizationCoursesAnalytics id={id} />;
}
