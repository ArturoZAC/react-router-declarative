import NoChatSelectedPage from "@/chat/pages/NoChatSelectedPage";
import { getClient } from "@/data/fake.data";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { ContactInfoSkeleton } from "./ContactInfoSkeleton";
import { ContactInfo } from "./ContactInfo";

export const ContactDetails = () => {

  const { clientId } = useParams();

  const { data: client, isLoading } = useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClient(clientId ?? ''),
    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
  });

  if( !clientId ){
    return <NoChatSelectedPage />;
  }

  if( isLoading && !client ){
    return <ContactInfoSkeleton />;
  }

  if( client ){
    return <ContactInfo client={client}/>;
  }

  return <div>No contact found</div>;
};
