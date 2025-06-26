import { lazy, Suspense } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import { AuthLayout } from "./auth/layout/AuthLayout";
import { LoginPage } from "./auth/pages/LoginPage";
import { RegisterPage } from "./auth/pages/RegisterPage";
import { sleep } from "./lib/sleep";
import { PrivateRoute } from "./auth/components/PrivateRoute";
import { useQuery } from "@tanstack/react-query";
import { checkAuth } from "./data/fake.data";

const ChatLayout = lazy( async () => {
  await sleep(1500);
  return import('@/chat/layout/ChatLayout')
});

const ChatPage = lazy( async() => import('@/chat/pages/ChatPage'));
const NoChatSelectedPage = lazy( async() => import('@/chat/pages/NoChatSelectedPage'));

export const AppRouter = () => {

  const { data: user, isLoading/* , isError, error  */} = useQuery({
    queryKey: ['user'],
    queryFn: () => {
      const token = localStorage.getItem('token');
      if( !token ){
        throw new Error('No token found');
      }

      return checkAuth(token);
    },
    retry: 0,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }


  return(
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout/>}>
          <Route path="/auth/login" element={<LoginPage/>}/>
          <Route path="/auth/register" element={<RegisterPage />}/>
          <Route path="/auth" element={<Navigate to='/auth/login'/>}/>
        </Route>


        <Route path="/chat" element={
          <Suspense
            fallback={
              <div className="flex h-screen w-full items-center justify-center bg-background">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
              </div>
            }
          > 
            <PrivateRoute isAuthenticated={!!user}>
              <ChatLayout />
            </PrivateRoute>
          </Suspense>
        }>
          <Route index element={<NoChatSelectedPage/>}/>
          <Route path="/chat/:clientId" element={<ChatPage/>}/>
        </Route>

        <Route path="/" element={<Navigate to='/auth'/>}/>
        <Route path="/*" element={<Navigate to='/auth'/>}/>
      </Routes>
    </BrowserRouter>
  )
};