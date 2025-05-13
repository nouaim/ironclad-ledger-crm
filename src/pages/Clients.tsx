
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Plus, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Client } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Clients = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredClients, setFilteredClients] = useState<Client[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [clientToDelete, setClientToDelete] = useState<Client | null>(null);

  const columns = [
    { header: "Company", accessor: "name" as keyof Client },
    { header: "Industry", accessor: "industry" as keyof Client },
    { header: "Location", accessor: "location" as keyof Client },
    { 
      header: "Employees", 
      accessor: "employees" as keyof Client,
      render: (client: Client) => client.employees.toLocaleString()
    },
  ];

  // Load data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.clients) setClients(parsedData.clients);
      } catch (error) {
        console.error("Failed to parse stored data", error);
      }
    }
  }, []);

  // Filter clients when search query or clients change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredClients(clients);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = clients.filter(
      client =>
        client.name.toLowerCase().includes(lowerCaseQuery) ||
        client.industry.toLowerCase().includes(lowerCaseQuery) ||
        client.location.toLowerCase().includes(lowerCaseQuery)
    );
    
    setFilteredClients(filtered);
  }, [searchQuery, clients]);

  const handleDeleteClient = (client: Client) => {
    setClientToDelete(client);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteClient = () => {
    if (!clientToDelete) return;
    
    const updatedClients = clients.filter(c => c.id !== clientToDelete.id);
    
    // Also need to get and update contacts that belong to this client
    const storedData = localStorage.getItem("crm-data");
    let contacts = [];
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.contacts) {
          contacts = parsedData.contacts.filter((c: any) => c.clientId !== clientToDelete.id);
        }
      } catch (error) {
        console.error("Failed to parse stored data for contacts", error);
      }
    }
    
    // Save updated data
    localStorage.setItem("crm-data", JSON.stringify({
      clients: updatedClients,
      contacts,
    }));
    
    setClients(updatedClients);
    setDeleteDialogOpen(false);
    setClientToDelete(null);
    
    toast({
      title: "Client deleted",
      description: `${clientToDelete.name} has been removed successfully.`,
    });
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Layout>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center">
            <Building className="mr-2" /> Clients
          </h1>
          <p className="text-gray-500">Manage your client companies</p>
        </div>
        <Link to="/clients/new">
          <Button className="flex items-center gap-1">
            <Plus size={16} />
            <span>Add Client</span>
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search clients..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      <DataTable
        data={filteredClients}
        columns={columns}
        keyExtractor={(client) => client.id}
        onDelete={handleDeleteClient}
        detailPath="/clients"
        editPath="/clients/edit"
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteClient}
        title="Delete Client"
        message={`Are you sure you want to delete ${clientToDelete?.name}? This will also delete all associated contacts and cannot be undone.`}
      />
    </Layout>
  );
};

export default Clients;
