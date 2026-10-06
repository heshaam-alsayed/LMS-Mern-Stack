import Header from "@/components/shared/Header";
import UserSupportTickets from "@/components/user/support/UserSupportTickets";

export default function UserSupportPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Header />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 sm:px-6">
        <UserSupportTickets />
      </main>
    </div>
  );
}