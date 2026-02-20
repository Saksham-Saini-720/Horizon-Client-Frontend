import React from "react";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient(); 

const QueryProvider = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;