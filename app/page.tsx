'use server'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from './api/auth/[...nextauth]/route';
import LandingPage from './components/sections/landing/landingPage';
import LandingPageWrapper from './components/wrappers/landingPageWrapper';

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }
  return (
    <LandingPageWrapper>
      <LandingPage/>
    </LandingPageWrapper>
  )
}