
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Building, Users, ChartBar, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import StatCard from "@/components/StatCard";
import Layout from "@/components/Layout";
import DataTable from "@/components/DataTable";
import { Client, Contact } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

// Mock data
const MOCK_CLIENTS: Client[] = [
  {
    id: "1",
    name: "Acme Industries",
    industry: "Manufacturing",
    location: "Chicago, IL",
    website: "acme.com",
    revenue: "$5M-$10M",
    employees: 120,
    notes: "Key account with long history",
    createdAt: "2022-03-15T08:00:00Z",
  },
  {
    id: "2",
    name: "TechSolutions Inc",
    industry: "Technology",
    location: "San Francisco, CA",
    website: "techsolutions.com",
    revenue: "$1M-$5M",
    employees: 45,
    notes: "Rapidly growing startup",
    createdAt: "2023-01-10T10:15:00Z",
  },
];

const MOCK_CONTACTS: Contact[] = [
  {
    id: "1",
    clientId: "1",
    name: "John Smith",
    position: "Operations Director",
    email: "john@acme.com",
    phone: "312-555-1234",
    notes: "Primary decision maker",
    createdAt: "2022-05-20T14:30:00Z",
  },
  {
    id: "2",
    clientId: "1",
    name: "Sarah Johnson",
    position: "Procurement Manager",
    email: "sarah@acme.com",
    phone: "312-555-5678",
    notes: "Handles all purchasing",
    createdAt: "2022-06-12T11:45:00Z",
  },
  {
    id: "3",
    clientId: "2",
    name: "Michael Chen",
    position: "CEO",
    email: "michael@techsolutions.com",
    phone: "415-555-9876",
    notes: "Prefers email communication",
    createdAt: "2023-01-15T09:20:00Z",
  },
];

const Dashboard = () => {
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [contacts, setContacts] = useState<Contact[]>(MOCK_CONTACTS);
  
  const clientColumns = [
    { header: "Company", accessor: "name" as keyof Client },
    { header: "Industry", accessor: "industry" as keyof Client },
    { header: "Location", accessor: "location" as keyof Client },
  ];
  
  const contactColumns = [
    { header: "Name", accessor: "name" as keyof Contact },
    { 
      header: "Company", 
      accessor: "clientId" as keyof Contact,
      render: (contact: Contact) => {
        const client = clients.find(c => c.id === contact.clientId);
        return client ? client.name : "Unknown";
      }
    },
    { header: "Position", accessor: "position" as keyof Contact },
    { header: "Email", accessor: "email" as keyof Contact },
  ];

  useEffect(() => {
    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.clients) setClients(parsedData.clients);
        if (parsedData.contacts) setContacts(parsedData.contacts);
      } catch (error) {
        console.error("Failed to parse stored data", error);
      }
    }
  }, []);

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-gray-500">Welcome to IndustrialCRM</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Clients"
          value={clients.length}
          icon={<Building className="h-6 w-6 text-gray-700" />}
        />
        <StatCard
          title="Total Contacts"
          value={contacts.length}
          icon={<Users className="h-6 w-6 text-gray-700" />}
        />
        <StatCard
          title="Avg. Employees"
          value={clients.length > 0 ? Math.round(clients.reduce((sum, client) => sum + client.employees, 0) / clients.length) : 0}
          icon={<ChartBar className="h-6 w-6 text-gray-700" />}
        />
        <StatCard
          title="Contacts per Client"
          value={(clients.length > 0 ? (contacts.length / clients.length).toFixed(1) : "0")}
          icon={<ChartLine className="h-6 w-6 text-gray-700" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Clients</h2>
            <Link to="/clients">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <DataTable
            data={clients.slice(0, 5)}
            columns={clientColumns}
            keyExtractor={(client) => client.id}
            detailPath="/clients"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Recent Contacts</h2>
            <Link to="/contacts">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <DataTable
            data={contacts.slice(0, 5)}
            columns={contactColumns}
            keyExtractor={(contact) => contact.id}
            detailPath="/contacts"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
