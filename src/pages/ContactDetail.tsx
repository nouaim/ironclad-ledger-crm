
import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Edit, ArrowLeft, Mail, Phone, Building, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Layout from "@/components/Layout";
import { Contact, Client } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

const ContactDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [contact, setContact] = useState<Contact | null>(null);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const data = localStorage.getItem("crm-data");
    if (data) {
      try {
        const parsedData = JSON.parse(data);
        
        if (parsedData.contacts) {
          const foundContact = parsedData.contacts.find((c: Contact) => c.id === id);
          if (foundContact) {
            setContact(foundContact);
            
            // Find associated client
            if (parsedData.clients) {
              const foundClient = parsedData.clients.find(
                (c: Client) => c.id === foundContact.clientId
              );
              if (foundClient) {
                setClient(foundClient);
              }
            }
          } else {
            toast({
              title: "Error",
              description: "Contact not found",
              variant: "destructive",
            });
            navigate("/contacts");
          }
        }
      } catch (error) {
        console.error("Failed to parse stored data", error);
      }
    }
  }, [id, navigate, toast]);

  if (!contact) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <p>Loading contact details...</p>
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
          onClick={() => navigate("/contacts")}
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Contacts
        </Button>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold flex items-center">
              <User className="mr-2" /> {contact.name}
            </h1>
            <p className="text-gray-500">{contact.position}</p>
          </div>
          <Link to={`/contacts/edit/${contact.id}`}>
            <Button variant="outline" className="flex items-center gap-1">
              <Edit size={16} />
              <span>Edit</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold mb-4">Contact Information</h2>
          <dl className="space-y-2">
            {client && (
              <div className="flex items-start">
                <dt className="text-gray-500 w-1/3">Company:</dt>
                <dd className="flex items-center">
                  <Building className="mr-1 h-4 w-4 text-gray-400" />
                  <Link 
                    to={`/clients/${client.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    {client.name}
                  </Link>
                </dd>
              </div>
            )}
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Position:</dt>
              <dd>{contact.position || "Not specified"}</dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Email:</dt>
              <dd className="flex items-center">
                {contact.email ? (
                  <>
                    <Mail className="mr-1 h-4 w-4 text-gray-400" />
                    <a 
                      href={`mailto:${contact.email}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.email}
                    </a>
                  </>
                ) : (
                  "Not specified"
                )}
              </dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Phone:</dt>
              <dd className="flex items-center">
                {contact.phone ? (
                  <>
                    <Phone className="mr-1 h-4 w-4 text-gray-400" />
                    <a 
                      href={`tel:${contact.phone}`}
                      className="text-blue-600 hover:underline"
                    >
                      {contact.phone}
                    </a>
                  </>
                ) : (
                  "Not specified"
                )}
              </dd>
            </div>
            <div className="flex items-start">
              <dt className="text-gray-500 w-1/3">Added:</dt>
              <dd>
                {new Date(contact.createdAt).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 lg:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Notes</h2>
          <p className="text-gray-700 whitespace-pre-wrap">{contact.notes || "No notes available."}</p>
        </div>
      </div>
    </Layout>
  );
};

export default ContactDetail;
