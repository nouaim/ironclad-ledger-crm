
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Clients from "./pages/Clients";
import ClientDetail from "./pages/ClientDetail";
import Contacts from "./pages/Contacts";
import ContactDetail from "./pages/ContactDetail";
import ClientForm from "./components/ClientForm";
import ContactForm from "./components/ContactForm";
import NotFound from "./pages/NotFound";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import { Client, Contact } from "./lib/types";
import { useState, useEffect } from "react";

const queryClient = new QueryClient();

// Client Routes
const NewClient = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (clientData: Omit<Client, "id" | "createdAt">) => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        // Get existing data
        const storedData = localStorage.getItem("crm-data");
        let existingData: { clients: Client[], contacts: Contact[] } = { clients: [], contacts: [] };
        
        if (storedData) {
          existingData = JSON.parse(storedData);
        }

        // Create new client
        const newClient: Client = {
          ...clientData,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };

        // Add to existing data
        existingData.clients = [...(existingData.clients || []), newClient];
        
        // Save back to localStorage
        localStorage.setItem("crm-data", JSON.stringify(existingData));
        
        toast({
          title: "Success",
          description: "Client created successfully",
        });
        
        navigate("/clients");
      } catch (error) {
        console.error("Error saving client:", error);
        toast({
          title: "Error",
          description: "Failed to create client",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Client</h1>
      <ClientForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
};

// Edit Client Route
const EditClient = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [client, setClient] = useState<Client | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("crm-data");
    if (storedData && id) {
      try {
        const parsedData = JSON.parse(storedData);
        const foundClient = parsedData.clients?.find((c: Client) => c.id === id);
        
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
      } catch (error) {
        console.error("Error parsing data:", error);
        toast({
          title: "Error",
          description: "Failed to load client data",
          variant: "destructive",
        });
      }
    }
  }, [id, toast, navigate]);

  const handleSubmit = (clientData: Omit<Client, "id" | "createdAt">) => {
    if (!client) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const storedData = localStorage.getItem("crm-data");
        if (!storedData) {
          throw new Error("No data found");
        }
        
        const parsedData = JSON.parse(storedData);
        
        // Update the client
        const updatedClients = parsedData.clients.map((c: Client) =>
          c.id === client.id ? { ...c, ...clientData } : c
        );
        
        parsedData.clients = updatedClients;
        
        // Save back to localStorage
        localStorage.setItem("crm-data", JSON.stringify(parsedData));
        
        toast({
          title: "Success",
          description: "Client updated successfully",
        });
        
        navigate(`/clients/${client.id}`);
      } catch (error) {
        console.error("Error updating client:", error);
        toast({
          title: "Error",
          description: "Failed to update client",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate API call
  };

  if (!client) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading client data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Client</h1>
      <ClientForm 
        client={client} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

// Contact Routes
const NewContact = () => {
  const { clientId } = useParams<{ clientId?: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Load clients from localStorage
    const storedData = localStorage.getItem("crm-data");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        if (parsedData.clients) {
          setClients(parsedData.clients);
        }
      } catch (error) {
        console.error("Error parsing data:", error);
      }
    }
  }, []);

  const handleSubmit = (contactData: Omit<Contact, "id" | "createdAt">) => {
    setIsLoading(true);

    setTimeout(() => {
      try {
        // Get existing data
        const storedData = localStorage.getItem("crm-data");
        let existingData: { clients: Client[], contacts: Contact[] } = { clients: [], contacts: [] };
        
        if (storedData) {
          existingData = JSON.parse(storedData);
        }

        // Create new contact
        const newContact: Contact = {
          ...contactData,
          id: uuidv4(),
          createdAt: new Date().toISOString()
        };

        // Add to existing data
        existingData.contacts = [...(existingData.contacts || []), newContact];
        
        // Save back to localStorage
        localStorage.setItem("crm-data", JSON.stringify(existingData));
        
        toast({
          title: "Success",
          description: "Contact created successfully",
        });
        
        // If this was created from a client detail page, go back there
        if (clientId) {
          navigate(`/clients/${clientId}`);
        } else {
          navigate("/contacts");
        }
      } catch (error) {
        console.error("Error saving contact:", error);
        toast({
          title: "Error",
          description: "Failed to create contact",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate API call
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New Contact</h1>
      <ContactForm 
        clients={clients} 
        onSubmit={handleSubmit} 
        isLoading={isLoading}
        preselectedClientId={clientId}
      />
    </div>
  );
};

// Edit Contact Route
const EditContact = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [contact, setContact] = useState<Contact | undefined>(undefined);
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem("crm-data");
    if (storedData && id) {
      try {
        const parsedData = JSON.parse(storedData);
        const foundContact = parsedData.contacts?.find((c: Contact) => c.id === id);
        
        if (foundContact) {
          setContact(foundContact);
        } else {
          toast({
            title: "Error",
            description: "Contact not found",
            variant: "destructive",
          });
          navigate("/contacts");
        }
        
        if (parsedData.clients) {
          setClients(parsedData.clients);
        }
      } catch (error) {
        console.error("Error parsing data:", error);
        toast({
          title: "Error",
          description: "Failed to load contact data",
          variant: "destructive",
        });
      }
    }
  }, [id, toast, navigate]);

  const handleSubmit = (contactData: Omit<Contact, "id" | "createdAt">) => {
    if (!contact) return;
    
    setIsLoading(true);
    
    setTimeout(() => {
      try {
        const storedData = localStorage.getItem("crm-data");
        if (!storedData) {
          throw new Error("No data found");
        }
        
        const parsedData = JSON.parse(storedData);
        
        // Update the contact
        const updatedContacts = parsedData.contacts.map((c: Contact) =>
          c.id === contact.id ? { ...c, ...contactData } : c
        );
        
        parsedData.contacts = updatedContacts;
        
        // Save back to localStorage
        localStorage.setItem("crm-data", JSON.stringify(parsedData));
        
        toast({
          title: "Success",
          description: "Contact updated successfully",
        });
        
        navigate(`/contacts/${contact.id}`);
      } catch (error) {
        console.error("Error updating contact:", error);
        toast({
          title: "Error",
          description: "Failed to update contact",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }, 500); // Simulate API call
  };

  if (!contact) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p>Loading contact data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Contact</h1>
      <ContactForm 
        contact={contact} 
        clients={clients} 
        onSubmit={handleSubmit} 
        isLoading={isLoading} 
      />
    </div>
  );
};

import { useParams } from "react-router-dom";

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Client Routes */}
          <Route path="/clients" element={<Clients />} />
          <Route path="/clients/:id" element={<ClientDetail />} />
          <Route path="/clients/new" element={<NewClient />} />
          <Route path="/clients/edit/:id" element={<EditClient />} />
          
          {/* Contact Routes */}
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/contacts/:id" element={<ContactDetail />} />
          <Route path="/contacts/new" element={<NewContact />} />
          <Route path="/contacts/new/:clientId" element={<NewContact />} />
          <Route path="/contacts/edit/:id" element={<EditContact />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
