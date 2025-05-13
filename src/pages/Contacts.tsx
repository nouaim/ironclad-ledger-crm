
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Layout from "@/components/Layout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Contact, Client } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const Contacts = () => {
  const { toast } = useToast();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const columns = [
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
    { header: "Phone", accessor: "phone" as keyof Contact }
  ];

  // Load data from localStorage
  useEffect(() => {
    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.contacts) setContacts(parsedData.contacts);
        if (parsedData.clients) setClients(parsedData.clients);
      } catch (error) {
        console.error("Failed to parse stored data", error);
      }
    }
  }, []);

  // Filter contacts when search query or contacts change
  useEffect(() => {
    if (!searchQuery) {
      setFilteredContacts(contacts);
      return;
    }
    
    const lowerCaseQuery = searchQuery.toLowerCase();
    const filtered = contacts.filter(contact => {
      const client = clients.find(c => c.id === contact.clientId);
      const clientName = client ? client.name.toLowerCase() : "";
      
      return (
        contact.name.toLowerCase().includes(lowerCaseQuery) ||
        contact.position.toLowerCase().includes(lowerCaseQuery) ||
        contact.email.toLowerCase().includes(lowerCaseQuery) ||
        contact.phone.toLowerCase().includes(lowerCaseQuery) ||
        clientName.includes(lowerCaseQuery)
      );
    });
    
    setFilteredContacts(filtered);
  }, [searchQuery, contacts, clients]);

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContact = () => {
    if (!contactToDelete) return;
    
    const updatedContacts = contacts.filter(c => c.id !== contactToDelete.id);
    
    // Save updated data
    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        parsedData.contacts = updatedContacts;
        localStorage.setItem("crm-data", JSON.stringify(parsedData));
      } catch (error) {
        console.error("Failed to parse stored data", error);
      }
    } else {
      localStorage.setItem("crm-data", JSON.stringify({ contacts: updatedContacts, clients }));
    }
    
    setContacts(updatedContacts);
    setDeleteDialogOpen(false);
    setContactToDelete(null);
    
    toast({
      title: "Contact deleted",
      description: `${contactToDelete.name} has been removed successfully.`,
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
            <Users className="mr-2" /> Contacts
          </h1>
          <p className="text-gray-500">Manage your contacts</p>
        </div>
        <Link to="/contacts/new">
          <Button className="flex items-center gap-1">
            <Plus size={16} />
            <span>Add Contact</span>
          </Button>
        </Link>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search contacts..."
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      <DataTable
        data={filteredContacts}
        columns={columns}
        keyExtractor={(contact) => contact.id}
        onDelete={handleDeleteContact}
        detailPath="/contacts"
        editPath="/contacts/edit"
      />

      <ConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={confirmDeleteContact}
        title="Delete Contact"
        message={`Are you sure you want to delete ${contactToDelete?.name}? This action cannot be undone.`}
      />
    </Layout>
  );
};

export default Contacts;
