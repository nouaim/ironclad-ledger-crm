
export interface Client {
  id: string;
  name: string;
  industry: string;
  location: string;
  website: string;
  revenue: string;
  employees: number;
  notes: string;
  createdAt: string;
}

export interface Contact {
  id: string;
  clientId: string;
  name: string;
  position: string;
  email: string;
  phone: string;
  notes: string;
  createdAt: string;
}
