import { NextRequest, NextResponse } from "next/server";
import type { Client, ClientStatus, ClientsApiResponse } from "@/app/lib/types";

type InternalClient = Client & { joinedAt: string };

const VALID_STATUSES = new Set<ClientStatus>([
  "active",
  "cancelled",
  "past_due",
]);
const PER_PAGE = 10;

const clients: InternalClient[] = [
  { id: 1,  name: "Alice Brown",       email: "alice.brown@example.com",       status: "active",    joinedAt: "2024-03-15" },
  { id: 2,  name: "Bob Carter",        email: "bob.carter@example.com",        status: "cancelled", joinedAt: "2023-11-20" },
  { id: 3,  name: "Carol Davis",       email: "carol.davis@example.com",       status: "active",    joinedAt: "2025-01-10" },
  { id: 4,  name: "David Evans",       email: "david.evans@example.com",       status: "past_due",  joinedAt: "2024-07-22" },
  { id: 5,  name: "Emma Foster",       email: "emma.foster@example.com",       status: "active",    joinedAt: "2025-04-05" },
  { id: 6,  name: "Frank Grant",       email: "frank.grant@example.com",       status: "cancelled", joinedAt: "2023-08-14" },
  { id: 7,  name: "Grace Harris",      email: "grace.harris@example.com",      status: "active",    joinedAt: "2024-12-01" },
  { id: 8,  name: "Henry Irving",      email: "henry.irving@example.com",      status: "past_due",  joinedAt: "2023-05-30" },
  { id: 9,  name: "Irene Johnson",     email: "irene.johnson@example.com",     status: "active",    joinedAt: "2025-06-18" },
  { id: 10, name: "Jack King",         email: "jack.king@example.com",         status: "cancelled", joinedAt: "2024-02-25" },
  { id: 11, name: "Karen Lee",         email: "karen.lee@example.com",         status: "active",    joinedAt: "2024-09-08" },
  { id: 12, name: "Leo Martin",        email: "leo.martin@example.com",        status: "past_due",  joinedAt: "2023-12-19" },
  { id: 13, name: "Mia Nelson",        email: "mia.nelson@example.com",        status: "active",    joinedAt: "2025-02-14" },
  { id: 14, name: "Nathan Obrien",     email: "nathan.obrien@example.com",     status: "cancelled", joinedAt: "2024-05-31" },
  { id: 15, name: "Olivia Parker",     email: "olivia.parker@example.com",     status: "active",    joinedAt: "2024-10-07" },
  { id: 16, name: "Paul Quinn",        email: "paul.quinn@example.com",        status: "active",    joinedAt: "2025-03-22" },
  { id: 17, name: "Rachel Reed",       email: "rachel.reed@example.com",       status: "cancelled", joinedAt: "2023-09-16" },
  { id: 18, name: "Sam Scott",         email: "sam.scott@example.com",         status: "past_due",  joinedAt: "2024-01-29" },
  { id: 19, name: "Tina Torres",       email: "tina.torres@example.com",       status: "active",    joinedAt: "2025-05-11" },
  { id: 20, name: "Uma Underwood",     email: "uma.underwood@example.com",     status: "cancelled", joinedAt: "2024-06-03" },
  { id: 21, name: "Victor Vale",       email: "victor.vale@example.com",       status: "active",    joinedAt: "2023-07-25" },
  { id: 22, name: "Wendy Walsh",       email: "wendy.walsh@example.com",       status: "past_due",  joinedAt: "2024-11-14" },
  { id: 23, name: "Xander Xu",         email: "xander.xu@example.com",         status: "active",    joinedAt: "2025-01-30" },
  { id: 24, name: "Yvonne Young",      email: "yvonne.young@example.com",      status: "cancelled", joinedAt: "2023-10-08" },
  { id: 25, name: "Zack Zimmerman",    email: "zack.zimmerman@example.com",    status: "active",    joinedAt: "2024-04-17" },
  { id: 26, name: "Amy Adams",         email: "amy.adams@example.com",         status: "past_due",  joinedAt: "2025-02-28" },
  { id: 27, name: "Brian Baker",       email: "brian.baker@example.com",       status: "active",    joinedAt: "2024-08-11" },
  { id: 28, name: "Chloe Chen",        email: "chloe.chen@example.com",        status: "cancelled", joinedAt: "2023-06-24" },
  { id: 29, name: "Daniel Diaz",       email: "daniel.diaz@example.com",       status: "active",    joinedAt: "2025-04-19" },
  { id: 30, name: "Ella Edwards",      email: "ella.edwards@example.com",      status: "past_due",  joinedAt: "2024-03-06" },
  { id: 31, name: "Felix Ford",        email: "felix.ford@example.com",        status: "active",    joinedAt: "2023-04-12" },
  { id: 32, name: "Gina Green",        email: "gina.green@example.com",        status: "cancelled", joinedAt: "2024-07-09" },
  { id: 33, name: "Harry Hunt",        email: "harry.hunt@example.com",        status: "active",    joinedAt: "2025-06-01" },
  { id: 34, name: "Ivy Ingram",        email: "ivy.ingram@example.com",        status: "past_due",  joinedAt: "2023-11-17" },
  { id: 35, name: "Jake James",        email: "jake.james@example.com",        status: "active",    joinedAt: "2024-12-28" },
];

export function GET(request: NextRequest) {
  const sp = request.nextUrl.searchParams;

  const search = (sp.get("search") ?? "").trim().toLowerCase();
  const rawStatus = sp.get("status") ?? "";
  const rawSort = sp.get("sort") ?? "";
  const rawPage = sp.get("page") ?? "";

  const status = VALID_STATUSES.has(rawStatus as ClientStatus)
    ? (rawStatus as ClientStatus)
    : null;

  const sort = rawSort === "joined" ? "joined" : "name";

  let page = parseInt(rawPage, 10);
  if (!Number.isFinite(page) || page < 1) page = 1;

  // Filter
  const filtered = clients.filter((c) => {
    if (
      search &&
      !c.name.toLowerCase().includes(search) &&
      !c.email.toLowerCase().includes(search)
    ) {
      return false;
    }
    if (status !== null && c.status !== status) return false;
    return true;
  });

  // Sort (stable secondary key: id)
  filtered.sort((a, b) => {
    if (sort === "joined") {
      const diff =
        new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      return diff !== 0 ? diff : a.id - b.id;
    }
    const diff = a.name.localeCompare(b.name);
    return diff !== 0 ? diff : a.id - b.id;
  });

  // Paginate
  const total = filtered.length;
  const lastPage = Math.max(1, Math.ceil(total / PER_PAGE));
  page = Math.min(page, lastPage);
  const offset = (page - 1) * PER_PAGE;

  const response: ClientsApiResponse = {
    data: filtered
      .slice(offset, offset + PER_PAGE)
      .map(({ id, name, email, status }) => ({ id, name, email, status })),
    meta: {
      current_page: page,
      total,
      per_page: PER_PAGE,
      last_page: lastPage,
    },
  };

  return NextResponse.json(response);
}
