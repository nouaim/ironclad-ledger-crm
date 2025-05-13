
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Edit, Plus, Users, ArrowLeft, Map, Globe, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import DataTable from "@/components/DataTable";
import ConfirmDialog from "@/components/ConfirmDialog";
import { Client, Contact } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const ClientDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [client, setClient] = useState<Client | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState<Contact | null>(null);

  const contactColumns = [
    { header: "Name", accessor: "name" as keyof Contact },
    { header: "Position", accessor: "position" as keyof Contact },
    { header: "Email", accessor: "email" as keyof Contact },
    { header: "Phone", accessor: "phone" as keyof Contact },
  ];

  useEffect(() => {
    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        
        if (parsedData.clients) {
          const foundClient = parsedData.clients.find((c: Client) => c.id === id);
          if (foundClient) {
            setClient(foundClient);
          } else {
            toast({
              title: "Error",
              description: "Client not found",
              variant: "destructive",
            });
            navigate("/clients");
          }
        }
        
        if (parsedData.contacts) {
          const clientContacts = parsedData.contacts.filter(
            (c: Contact) => c.clientId === id
          );
          setContacts(clientContacts);
        }
      } catch (error) {
        console.error("Failed to parse stored data", error);
      }
    }
  }, [id, navigate, toast]);

  const handleDeleteContact = (contact: Contact) => {
    setContactToDelete(contact);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteContact = () => {
    if (!contactToDelete) return;

    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        
        if (parsedData.contacts) {
          const updatedContacts = parsedData.contacts.filter(
            (c: Contact) => c.id !== contactToDelete.id
          );
          parsedData.contacts = updatedContacts;
          localStorage.setItem("crm-data", JSON.stringify(parsedData));
          
          // Update local state
          setContacts(contacts.filter(c => c.id !== contactToDelete.id));
          
          toast({
            title: "Contact deleted",
            description: `${contactToDelete.name} has been removed successfully.`,
          });
        }
      } catch (error) {
        console.error("Failed to parse stored data", error);
        toast({
          title: "Error",
          description: "Failed to delete contact",
          variant: "destructive",
        });
      }
    }
    
    setDeleteDialogOpen(false);
    setContactToDelete(null);
  };

  if (!client) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading client details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="mb-6">
        <Button
          variant="outline"
          className="mb-4"
          onClick={() => navigate("/clients")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Clients
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <Building className="mr-2" /> {client.name}
            </h1>
            <p className="text-gray-500">{client.industry}</p>
          </div>
          <Link to={`/clients/edit/${client.id}`}>
            <Button variant="outline" className="flex items-center gap-1">
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Company Details</h2>
          <dl className="space-y-2">
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Industry:</dt>
              <dd>{client.industry || "Not specified"}</dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Location:</dt>
              <dd className="flex items-center">
                {client.location ? (
                  <>
                    <Map className="mr-1 h-4 w-4 text-gray-400" />
                    {client.location}
                  </>
                ) : (
                  "Not specified"
                )}
              </dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Website:</dt>
              <dd className="flex items-center">
                {client.website ? (
                  <>
                    <Globe className="mr-1 h-4 w-4 text-gray-400" />
                    <a 
                      href={client.website.startsWith('http') ? client.website : `https://${client.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {client.website}
                    </a>
                  </>
                ) : (
                  "Not specified"
                )}
              </dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Revenue:</dt>
              <dd>{client.revenue || "Not specified"}</dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Employees:</dt>
              <dd>{client.employees.toLocaleString()}</dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{client.notes || "No notes available."}</p>
        </div>
      </div>
      
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold flex items-center">
            <Users className="mr-2" /> Contacts
          </h2>
          <Link to={`/contacts/new/${client.id}`}>
            <Button className="flex items-center gap-1">
              <Plus size={16} />
              <span>Add Contact</span>
            </Button>
          </Link>
        </div>
        
        <DataTable
          data={contacts}
          columns={contactColumns}
          keyExtractor={(contact) => contact.id}
          onDelete={handleDeleteContact}
          detailPath="/contacts"
          editPath="/contacts/edit"
        />
      </div>
      
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

export default ClientDetail;
