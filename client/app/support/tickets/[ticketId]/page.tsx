import TicketDetails from "@/components/support/ticketDetails/TicketDetails";

type Params = {
  ticketId: string;
};

export default async function Page({ params }: { params: Promise<Params> }) {
  const { ticketId } = await params;

  return <TicketDetails ticketId={ticketId} />;
}