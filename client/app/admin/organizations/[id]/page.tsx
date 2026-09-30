import OrganizationDetails from "@/components/admin/organizationDetails/OrganizationDetails";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return <OrganizationDetails id={id} />;
}
