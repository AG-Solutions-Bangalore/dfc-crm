import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";

// Loading Component
import LoadingSpinner from "./components/LoadingSpinner";

// Pages (Auth)
import SignIn from "./pages/auth/SignIn";

import ForgetPassword from "./pages/auth/ForgetPassword";

// Pages (Dashboard)
const Home = lazy(() => import("./pages/dashboard/Home"));
import Maintenance from "./pages/maintenance/Maintenance";
import AgenciesReportForm from "./pages/reports/agencies/AgenciesReportForm";
import AgenciesReportView from "./pages/reports/agencies/AgenciesReportView";
import DriverReportView from "./pages/reports/driver/DriverReportView";
import DriverReportForm from "./pages/reports/driver/DriverReportForm";
import PaymentReportForm from "./pages/reports/payment/PaymentReportForm";
import PaymentReportView from "./pages/reports/payment/PaymentReportView";
import SalaryReportMultipleView from "./pages/reports/salary/SalaryReportMultipleView";
import SalaryReportView from "./pages/reports/salary/SalaryReportView";
import SalaryReportForm from "./pages/reports/salary/SalaryReportForm";
import ServiceReportForm from "./pages/reports/service/ServiceReportForm";
import ServiceReportView from "./pages/reports/service/ServiceReportView";
import ServiceReportDetailsView from "./pages/reports/service/ServiceReportDetailsView";
import TeamReportForm from "./pages/reports/team/TeamReportForm";
import TeamReportView from "./pages/reports/team/TeamReportView";
import TripReportMultipleView from "./pages/reports/trip/TripReportMultipleView";
import TripReportView from "./pages/reports/trip/TripReportView";
import TripReportForm from "./pages/reports/trip/TripReportForm";
import TyreReportForm from "./pages/reports/tyre/TyreReportForm";
import TyreReportView from "./pages/reports/tyre/TyreReportView";
import TyreReportDetailsView from "./pages/reports/tyre/TyreReportDetailsView";
import VechilesReportForm from "./pages/reports/vechiles/VechilesReportForm";
import VechilesReportView from "./pages/reports/vechiles/VechilesReportView";
import VechilesDetailsReportForm from "./pages/reports/vechilesDetails/VechilesDetailsReportForm";
import VehicleReportView from "./pages/reports/vechilesDetails/VehicleReportView";
import VendorReportView from "./pages/reports/vendor/VendorReportView";
import VendorReportForm from "./pages/reports/vendor/VendorReportForm";
import DisableRightClick from "./components/common/DisableRightClick";
import FittedTyreReport from "./pages/reports/fitted-tyre/FittedTyreReport";
import ServiceR from "./pages/reports/servicer/ServiceR";

// Pages (Profile)
const Profile = lazy(() => import("./pages/profile/Profile"));
const ChangePassword = lazy(() => import("./pages/profile/ChangePassword"));

// Master Page
const CompanyList = lazy(() => import("./pages/master/company/CompanyList"));
const CreateCompany = lazy(() =>
  import("./pages/master/company/CreateCompany")
);
const CompanyEdit = lazy(() => import("./pages/master/company/CompanyEdit"));
const BranchList = lazy(() => import("./pages/master/branch/BranchList"));
const CreateBranch = lazy(() => import("./pages/master/branch/CreateBranch"));
const BrandEdit = lazy(() => import("./pages/master/branch/BrandEdit"));
const TyrePositionList = lazy(() =>
  import("./pages/master/tyrePosition/TyrePositionList")
);
const TyreMakeList = lazy(() => import("./pages/master/tyreMake/TyreMakeList"));
const CreateTyreMake = lazy(() =>
  import("./pages/master/tyreMake/CreateTyreMake")
);
const EditTyreMake = lazy(() => import("./pages/master/tyreMake/EditTyreMake"));
const ServiceTypeList = lazy(() =>
  import("./pages/master/serviceType/ServiceTypeList")
);
const CreateServiceType = lazy(() =>
  import("./pages/master/serviceType/CreateServiceType")
);
const EditServiceType = lazy(() =>
  import("./pages/master/serviceType/EditServiceType")
);
const TeamList = lazy(() => import("./pages/master/team/TeamList"));
const CreateTeam = lazy(() => import("./pages/master/team/CreateTeam"));
const EditTeam = lazy(() => import("./pages/master/team/EditTeam"));
const DriverList = lazy(() => import("./pages/master/driver/DriverList"));
const CreateDriver = lazy(() => import("./pages/master/driver/CreateDriver"));
const EditDriver = lazy(() => import("./pages/master/driver/EditDriver"));
const AgenciesList = lazy(() => import("./pages/master/agencies/AgenciesList"));
const CreateAgencies = lazy(() =>
  import("./pages/master/agencies/CreateAgencies")
);
const EditAgencies = lazy(() => import("./pages/master/agencies/EditAgencies"));
const VendorList = lazy(() => import("./pages/master/vendor/VendorList"));
const CreateVendor = lazy(() => import("./pages/master/vendor/CreateVendor"));
const EditVendor = lazy(() => import("./pages/master/vendor/EditVendor"));

// Vehicles Routes
const VehiclesList = lazy(() => import("./pages/vehicles/VehiclesList"));
const AddVechiles = lazy(() => import("./pages/vehicles/AddVechiles"));
const AddTyre = lazy(() => import("./pages/vehicles/AddTyre"));
const EditVechiles = lazy(() => import("./pages/vehicles/EditVechiles"));
const ViewVechile = lazy(() => import("./pages/vehicles/ViewVechile"));
const ChangeTyre = lazy(() => import("./pages/vehicles/ChangeTyre"));
const ChangePkm = lazy(() => import("./pages/vehicles/ChangePkm"));
const TruckView = lazy(() => import("./pages/vehicles/TruckView"));
const ChangeSpkm = lazy(() => import("./pages/vehicles/ChangeSpkm"));

// Tyre Pages
const PurchaseTyreList = lazy(() =>
  import("./pages/tyre/purchase/PurchaseTyreList")
);
const AddPurchaseTyre = lazy(() =>
  import("./pages/tyre/purchase/AddPurchaseTyre")
);
const EditPurchaseTyre = lazy(() =>
  import("./pages/tyre/purchase/EditPurchaseTyre")
);
const ViewPurchaseTyre = lazy(() =>
  import("./pages/tyre/purchase/ViewPurchaseTyre")
);
const StockTyreList = lazy(() => import("./pages/tyre/stock/StockTyreList"));
const AssignTypeTyreList = lazy(() =>
  import("./pages/tyre/assignType/AssignTypeTyreList")
);
const AssignTypeTyreView = lazy(() =>
  import("./pages/tyre/assignType/AssignTypeTyreView")
);
const UnassignTypeTyreList = lazy(() =>
  import("./pages/tyre/unassignType/UnassignTypeTyreList")
);
const InspectionTyreList = lazy(() =>
  import("./pages/tyre/inspection/InspectionTyreList")
);
const TyreHistroy = lazy(() => import("./pages/tyre/tyreHistroy/tyreHistroy"));

// Services Pages
const ServicesList = lazy(() => import("./pages/services/ServicesList"));
const AddServices = lazy(() => import("./pages/services/AddServices"));
const EditServices = lazy(() => import("./pages/services/EditServices"));
const ViewServices = lazy(() => import("./pages/services/ViewServices"));

// Trip Pages
const FormTrip = lazy(() => import("./pages/trip/FormTrip"));
const AddTrip = lazy(() => import("./pages/trip/AddTrip"));
const EditTrip = lazy(() => import("./pages/trip/EditTrip"));
const TripList = lazy(() => import("./pages/trip/TripList"));

// Payment Pages
const BranchPaymentList = lazy(() =>
  import("./pages/payment/branch/BranchPaymentList")
);
const EditBranchPayment = lazy(() =>
  import("./pages/payment/branch/EditBranchPayment")
);
const AddBranchPayment = lazy(() =>
  import("./pages/payment/branch/AddBranchPayment")
);
const AdvancePaymentList = lazy(() =>
  import("./pages/payment/advance/AdvancePaymentList")
);
const AddAdvacnePayment = lazy(() =>
  import("./pages/payment/advance/AddAdvacnePayment")
);
const EditAdvancePayment = lazy(() =>
  import("./pages/payment/advance/EditAdvancePayment")
);
const DetailsPaymentList = lazy(() =>
  import("./pages/payment/details/DetailsPaymentList")
);
const AddDetailsPayment = lazy(() =>
  import("./pages/payment/details/AddDetailsPayment")
);
const EditDetailsPayment = lazy(() =>
  import("./pages/payment/details/EditDetailsPayment")
);

// Todo Routes
const TodoList = lazy(() => import("./pages/todo/TodoList"));
const CreateTodo = lazy(() => import("./pages/todo/CreateTodo"));
const EditTodo = lazy(() => import("./pages/todo/EditTodo"));

// User Management Routes
const UserPage = lazy(() => import("./pages/userManagement/UserPage"));
const ManagementDashboard = lazy(() =>
  import("./pages/userManagement/ManagementDashboard")
);
const CreatePage = lazy(() => import("./pages/userManagement/CreatePage"));
const CreateButton = lazy(() => import("./pages/userManagement/CreateButton"));
const UserTypeList = lazy(() => import("./pages/userType/UserTypeList"));
const EditUserType = lazy(() => import("./pages/userType/EditUserType"));

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors position="top-right" />

      <Suspense fallback={<LoadingSpinner />}>
        <DisableRightClick />
        <Routes>
          {/* Auth Routes */}
          <Route path="/" element={<SignIn />} />

          <Route path="/forget-password" element={<ForgetPassword />} />

          {/* Dashboard Routes */}
          <Route path="/home" element={<Home />} />
          <Route path="/maintenance" element={<Maintenance />} />

          {/* Profile Routes */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/change-password" element={<ChangePassword />} />

          {/* Master Routes */}
          <Route path="/master/company-list" element={<CompanyList />} />
          <Route path="/master/company-edit/:id" element={<CompanyEdit />} />
          <Route path="/master/createCompany" element={<CreateCompany />} />
          <Route path="/master/branch-list" element={<BranchList />} />
          <Route path="/master/branch-edit/:id" element={<BrandEdit />} />
          <Route path="/master/CreateBranch" element={<CreateBranch />} />
          <Route
            path="/master/tyreposition-list"
            element={<TyrePositionList />}
          />
          <Route path="/master/tyremake-list" element={<TyreMakeList />} />
          <Route path="/master/tyremake-edit/:id" element={<EditTyreMake />} />
          <Route path="/master/createTyremake" element={<CreateTyreMake />} />
          <Route
            path="/master/servicetype-list"
            element={<ServiceTypeList />}
          />
          <Route
            path="/master/servicetype-edit/:id"
            element={<EditServiceType />}
          />
          <Route
            path="/master/createServicetype"
            element={<CreateServiceType />}
          />
          <Route path="/master/team-list" element={<TeamList />} />
          <Route path="/master/team-edit/:id" element={<EditTeam />} />
          <Route path="/master/createTeam" element={<CreateTeam />} />
          <Route path="/master/driver-list" element={<DriverList />} />
          <Route path="/master/driver-edit/:id" element={<EditDriver />} />
          <Route path="/master/createDriver" element={<CreateDriver />} />
          <Route path="/master/agencies-list" element={<AgenciesList />} />
          <Route path="/master/agencies-edit/:id" element={<EditAgencies />} />
          <Route path="/master/createAgency" element={<CreateAgencies />} />
          <Route path="/master/vendor-list" element={<VendorList />} />
          <Route path="/master/vendor-edit/:id" element={<EditVendor />} />
          <Route path="/master/createVendor" element={<CreateVendor />} />

          {/* Vehicles Routes */}
          <Route path="/vehicles-list" element={<VehiclesList />} />
          <Route path="/createVechiles" element={<AddVechiles />} />
          <Route path="/createTyre" element={<AddTyre />} />
          <Route path="/vechile-edit/:id" element={<EditVechiles />} />
          <Route path="/vechile-view/:id" element={<ViewVechile />} />
          <Route path="/changeTyre" element={<ChangeTyre />} />
          <Route path="/changePkm" element={<ChangePkm />} />
          <Route path="/spkm/:id" element={<ChangeSpkm />} />
          <Route path="/truckdetails-viewall/:id" element={<TruckView />} />

          {/* Tyre Routes */}
          <Route path="/tyre/purchase-list" element={<PurchaseTyreList />} />
          <Route path="/tyre/createPurchase" element={<AddPurchaseTyre />} />
          <Route
            path="/tyre/purchase-edit/:id"
            element={<EditPurchaseTyre />}
          />
          <Route
            path="/tyre/purchase-view/:id"
            element={<ViewPurchaseTyre />}
          />
          <Route path="/tyre/stock-list" element={<StockTyreList />} />
          <Route path="/tyre/assign-list" element={<AssignTypeTyreList />} />
          <Route
            path="/tyre/assign-view/:id"
            element={<AssignTypeTyreView />}
          />
          <Route
            path="/tyre/unassign-list"
            element={<UnassignTypeTyreList />}
          />
          <Route
            path="/tyre/inspection-list"
            element={<InspectionTyreList />}
          />
          <Route path="/tyre/histroy" element={<TyreHistroy />} />

          {/* Services Routes */}
          <Route path="/service-list" element={<ServicesList />} />
          <Route path="/createService" element={<AddServices />} />
          <Route path="/service-edit/:id" element={<EditServices />} />
          <Route path="/service-view/:id" element={<ViewServices />} />

          {/* Trip Routes */}
          <Route path="/form-trip" element={<FormTrip />} />
          <Route path="/trip-list" element={<TripList />} />
          <Route path="/createTrip" element={<AddTrip />} />
          <Route path="/edit-trip/:id" element={<EditTrip />} />

          {/* Payment Routes */}
          <Route path="/payment/branch-list" element={<BranchPaymentList />} />
          <Route
            path="/payment/edit-branchpay/:id"
            element={<EditBranchPayment />}
          />
          <Route
            path="/payment/createBranchPay"
            element={<AddBranchPayment />}
          />
          <Route
            path="/payment/advance-list"
            element={<AdvancePaymentList />}
          />
          <Route
            path="/payment/createAdvance"
            element={<AddAdvacnePayment />}
          />
          <Route
            path="/payment/edit-advance/:id"
            element={<EditAdvancePayment />}
          />
          <Route
            path="/payment/details-list"
            element={<DetailsPaymentList />}
          />
          <Route
            path="/payment/createDetails"
            element={<AddDetailsPayment />}
          />
          <Route
            path="/payment/edit-details/:id"
            element={<EditDetailsPayment />}
          />

          {/* Todo Routes */}
          <Route path="/todo-list" element={<TodoList />} />
          <Route path="/edit-todo/:id" element={<EditTodo />} />
          <Route path="/createTodo" element={<CreateTodo />} />

          {/* Report Routes */}
          <Route
            path="/report-agencies-form"
            element={<AgenciesReportForm />}
          />
          <Route
            path="/report-agencies-form/view"
            element={<AgenciesReportView />}
          />
          <Route path="/report-team-form" element={<TeamReportForm />} />
          <Route path="/report-team-form/view" element={<TeamReportView />} />
          <Route path="/report-driver-form" element={<DriverReportForm />} />
          <Route
            path="/report-driver-form/view"
            element={<DriverReportView />}
          />
          <Route path="/report-vendor-form" element={<VendorReportForm />} />
          <Route
            path="/report-vendor-form/view"
            element={<VendorReportView />}
          />
          <Route
            path="/report-vechiles-form"
            element={<VechilesReportForm />}
          />
          <Route
            path="/report-vechiles-form/view"
            element={<VechilesReportView />}
          />
          <Route
            path="/report-vdetails-form"
            element={<VechilesDetailsReportForm />}
          />
          <Route
            path="/report-vdetails-form/view"
            element={<VehicleReportView />}
          />
          <Route path="/report-tyre-form" element={<TyreReportForm />} />
          <Route path="/report-tyre-form/view" element={<TyreReportView />} />
          <Route
            path="/report-tyre-form/details/view"
            element={<TyreReportDetailsView />}
          />
          <Route path="/report-services-form" element={<ServiceReportForm />} />
          <Route
            path="/report-services-form/view"
            element={<ServiceReportView />}
          />
          <Route
            path="/report-services-form/details/view"
            element={<ServiceReportDetailsView />}
          />
          <Route path="/report-trip-form" element={<TripReportForm />} />
          <Route path="/report-trip-form/view" element={<TripReportView />} />
          <Route
            path="/report-trip-form/multiple/view"
            element={<TripReportMultipleView />}
          />
          <Route path="/report-salary-form" element={<SalaryReportForm />} />
          <Route
            path="/report-salary-form/view"
            element={<SalaryReportView />}
          />
          <Route
            path="/report-salary-form/multiple/view"
            element={<SalaryReportMultipleView />}
          />
          <Route path="/report-payment-form" element={<PaymentReportForm />} />
          <Route
            path="/report-payment-form/view"
            element={<PaymentReportView />}
          />
          <Route path="/report-fitted-tyre" element={<FittedTyreReport />} />
          <Route path="/report-service-r" element={<ServiceR />} />

          {/* User Management Routes */}
          <Route path="/userManagement" element={<UserPage />} />
          <Route
            path="/management-dashboard/:id"
            element={<ManagementDashboard />}
          />
          <Route path="/page-management" element={<CreatePage />} />
          <Route path="/button-management" element={<CreateButton />} />
          <Route path="/user-type" element={<UserTypeList />} />
          <Route path="/edit-user-type/:id" element={<EditUserType />} />
        </Routes>
      </Suspense>
    </QueryClientProvider>
  );
};

export default App;
