import OrganizationOrdersAnalytics from "@/components/admin/organizationDetails/ordersAnalytics/OrganizationOrdersAnalytics";

type Params = {
  id: string;
};

export default async function page({ params }: { params: Promise<Params> }) {
  const { id } = await params;

  return <OrganizationOrdersAnalytics id={id} />;
}
