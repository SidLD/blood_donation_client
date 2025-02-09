import { createBrowserRouter, createRoutesFromElements, Navigate, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { PrivateLayout, PublicLayout } from "./module";
import RegisterLayout from "@/layouts/RegisterLayout";
import LoadingScreen from "@/components/loader/loading-screen";
import { auth } from "@/lib/services";

const Home = lazy(() => import("@/pages/home"));
const Event = lazy(() => import("@/pages/events"));
const AboutUs = lazy(() => import("@/pages/about-us"));
const AdminDashboard = lazy(() => import("@/pages/admin/dashboard"));
const ContributorDashboard = lazy(() => import("@/pages/donor/dashboard"));
const SignUpSelection = lazy(() => import("@/pages/sign-up-selection"));
const AdminSignUp = lazy(() => import("@/pages/admin/sign-up"));

const AdminSetting = lazy(() => import("@/pages/admin/setting"));
const DonorSignUp = lazy(() => import("@/pages/donor/sign-up"));
const GuestDonor = lazy(() => import("@/pages/guest-donor"));
const SignInSelection = lazy(() => import("@/pages/sign-in-selection"));
const AdminSignIn = lazy(() => import("@/pages/admin/sign-in"));
const DonorSignIn = lazy(() => import("@/pages/donor/sign-in"));
const SuperAdminSignIn = lazy(() => import("@/pages/super_admin/sign-in"));


const AdminDonorList = lazy(() => import("@/pages/admin/donor-list"));
const AdminBloodSupply = lazy(() => import("@/pages/admin/transaction"));
const AdminCalendar = lazy(() => import("@/pages/admin/calendar"));
const EventsPage = lazy(() => import("@/pages/admin/event"));

const routers = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Public Routes */}
      <Route path="/" element={<PublicLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Home />
            </Suspense>
          }
        />
        <Route
          path="/events"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <Event />
            </Suspense>
          }
        />
          <Route
          path="/about-us"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AboutUs />
            </Suspense>
          }
        />
      </Route>

      {/* Register Routes */}
      <Route path="/register" element={<RegisterLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <SignUpSelection />
            </Suspense>
          }
        />
        <Route
          path="admin"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminSignUp />
            </Suspense>
          }
        />
        <Route
          path="donor"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <DonorSignUp />
            </Suspense>
          }
        />
        <Route
          path="guest-donor"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <GuestDonor />
            </Suspense>
          }
        />
      </Route>

      {/* Login Routes */}
      <Route path="/login" element={<RegisterLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <SignInSelection />
            </Suspense>
          }
        />
        <Route
          path="admin"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminSignIn />
            </Suspense>
          }
        />
        <Route
          path="donor"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <DonorSignIn />
            </Suspense>
          }
        />
        <Route
          path="super-admin"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <SuperAdminSignIn />
            </Suspense>
          }
        />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={<PrivateLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminDashboard />
            </Suspense>
          }
        />
        <Route
          path="calendar"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminCalendar />
            </Suspense>
          }
        />
        <Route
          path="donor-list"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminDonorList />
            </Suspense>
          }
        />
        <Route
          path="blood-supply"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminBloodSupply />
            </Suspense>
          }
        />
        <Route
          path="events"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <EventsPage />
            </Suspense>
          }
        />
       <Route
          path="setting"
          element={
            <Suspense fallback={<LoadingScreen />}>
              <AdminSetting />
            </Suspense>
          }
        />
      </Route>

      {/* Donor Routes */}
      {
        auth.getRole() == 'DONOR' && 
        <Route path="/donor" element={<PrivateLayout />}>
        <Route
          index
          element={
            <Suspense fallback={<LoadingScreen />}>
              <ContributorDashboard />
            </Suspense>
          }
        />
      </Route>
      }

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </>
  )
);

export default routers;
