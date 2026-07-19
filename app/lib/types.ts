export type ClientStatus = "active" | "cancelled" | "past_due";

export type Client = {
  id: number;
  name: string;
  email: string;
  status: ClientStatus;
};

export type ApiMeta = {
  current_page: number;
  total: number;
  per_page: number;
  last_page: number;
};

export type ClientsApiResponse = {
  data: Client[];
  meta: ApiMeta;
};
