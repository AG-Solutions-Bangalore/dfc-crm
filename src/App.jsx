import { Route, Routes } from "react-router-dom";
import Home from "./pages/dashboard/Home";
import SignIn from "./pages/auth/SignIn";
import SIgnUp from "./pages/auth/SIgnUp";
import Maintenance from "./pages/maintenance/Maintenance";
import ForgetPassword from "./pages/auth/ForgetPassword";
import Profile from "./pages/profile/Profile";
import ChangePassword from "./pages/profile/ChangePassword";
import CompanyList from "./pages/master/company/CompanyList";
import BranchList from "./pages/master/branch/BranchList";
import TyrePositionList from "./pages/master/tyrePosition/TyrePositionList";
import TyreMakeList from "./pages/master/tyreMake/TyreMakeList";
import ServiceTypeList from "./pages/master/serviceType/ServiceTypeList";
import TeamList from "./pages/master/team/TeamList";
import DriverList from "./pages/master/driver/DriverList";
import AgenciesList from "./pages/master/agencies/AgenciesList";
import VendorList from "./pages/master/vendor/VendorList";
import VehiclesList from "./pages/vehicles/VehiclesList";
import PurchaseTyreList from "./pages/tyre/purchase/PurchaseTyreList";
import StockTyreList from "./pages/tyre/stock/StockTyreList";
import AssignTypeTyreList from "./pages/tyre/assignType/AssignTypeTyreList";
import UnassignTypeTyreList from "./pages/tyre/unassignType/UnassignTypeTyreList";
import InspectionTyreList from "./pages/tyre/inspection/InspectionTyreList";
import ServicesList from "./pages/services/ServicesList";
import TripList from "./pages/trip/TripList";
import TodoList from "./pages/todo/TodoList";
import AdvancePaymentList from "./pages/payment/advance/AdvancePaymentList";
import BranchPaymentList from "./pages/payment/branch/BranchPaymentList";
import DetailsPaymentList from "./pages/payment/details/DetailsPaymentList";
import CreateTodo from "./pages/todo/CreateTodo";
import EditTodo from "./pages/todo/EditTodo";
import AddBranchPayment from "./pages/payment/branch/AddBranchPayment";
import EditBranchPayment from "./pages/payment/branch/EditBranchPayment";
import AddAdvacnePayment from "./pages/payment/advance/AddAdvacnePayment";
import EditAdvancePayment from "./pages/payment/advance/EditAdvancePayment";
import AddDetailsPayment from "./pages/payment/details/AddDetailsPayment";
import EditDetailsPayment from "./pages/payment/details/EditDetailsPayment";
import AssignTypeTyreView from "./pages/tyre/assignType/AssignTypeTyreView";
import AddPurchaseTyre from "./pages/tyre/purchase/AddPurchaseTyre";
import EditPurchaseTyre from "./pages/tyre/purchase/EditPurchaseTyre";
import ViewPurchaseTyre from "./pages/tyre/purchase/ViewPurchaseTyre";
import AddServices from "./pages/services/AddServices";
import { Toaster } from "sonner";
import EditServices from "./pages/services/EditServices";
import ViewServices from "./pages/services/ViewServices";
import AddVechiles from "./pages/vehicles/AddVechiles";
import AddTyre from "./pages/vehicles/AddTyre";
import EditVechiles from "./pages/vehicles/EditVechiles";
import CreateCompany from "./pages/master/company/CreateCompany";
import CompanyEdit from "./pages/master/company/CompanyEdit";
import CreateBranch from "./pages/master/branch/CreateBranch";
import BrandEdit from "./pages/master/branch/BrandEdit";
import CreateTyreMake from "./pages/master/tyreMake/CreateTyreMake";
import EditTyreMake from "./pages/master/tyreMake/EditTyreMake";
import AgenciesReportForm from "./pages/reports/agencies/AgenciesReportForm";
import TeamReportForm from "./pages/reports/team/TeamReportForm";
import DriverReportForm from "./pages/reports/driver/DriverReportForm";
import VechilesReportForm from "./pages/reports/vechiles/VechilesReportForm";
import VendorReportForm from "./pages/reports/vendor/VendorReportForm";
import VechilesDetailsReportForm from "./pages/reports/vechilesDetails/VechilesDetailsReportForm";
import TyreReportForm from "./pages/reports/tyre/TyreReportForm";
import ServiceReportForm from "./pages/reports/service/ServiceReportForm";
import TripReportForm from "./pages/reports/trip/TripReportForm";
import SalaryReportForm from "./pages/reports/salary/SalaryReportForm";
import PaymentReportForm from "./pages/reports/payment/PaymentReportForm";
import AgenciesReportView from "./pages/reports/agencies/AgenciesReportView";
import TeamReportView from "./pages/reports/team/TeamReportView";
import DriverReportView from "./pages/reports/driver/DriverReportView";
import VendorReportView from "./pages/reports/vendor/VendorReportView";
import VechilesReportView from "./pages/reports/vechiles/VechilesReportView";

const App = () => {
  return (
    <>
      <Toaster richColors position="top-right" />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/register" element={<SIgnUp />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/maintenance" element={<Maintenance />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/change-password" element={<ChangePassword />} />
        {/* master  */}
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

        <Route path="/master/servicetype-list" element={<ServiceTypeList />} />
        <Route path="/master/team-list" element={<TeamList />} />
        <Route path="/master/driver-list" element={<DriverList />} />
        <Route path="/master/agencies-list" element={<AgenciesList />} />
        <Route path="/master/vendor-list" element={<VendorList />} />

        {/* vechiles  */}
        <Route path="/vechiles-list" element={<VehiclesList />} />
        <Route path="/createVechiles" element={<AddVechiles />} />
        <Route path="/createTyre" element={<AddTyre />} />
        <Route path="/vechile-edit/:id" element={<EditVechiles />} />
        {/* tyre  */}
        {/* purchase tyre  */}
        <Route path="/tyre/purchase-list" element={<PurchaseTyreList />} />
        <Route path="/tyre/createPurchase" element={<AddPurchaseTyre />} />
        <Route path="/tyre/purchase-edit/:id" element={<EditPurchaseTyre />} />
        <Route path="/tyre/purchase-view/:id" element={<ViewPurchaseTyre />} />

        {/* stock list */}
        <Route path="/tyre/stock-list" element={<StockTyreList />} />
        {/* assign tyre  */}
        <Route path="/tyre/assign-list" element={<AssignTypeTyreList />} />
        <Route path="/tyre/assign-view/:id" element={<AssignTypeTyreView />} />
        {/* unassign tyre */}
        <Route path="/tyre/unassign-list" element={<UnassignTypeTyreList />} />
        <Route path="/tyre/inspection-list" element={<InspectionTyreList />} />
        {/* services  */}
        <Route path="/service-list" element={<ServicesList />} />
        <Route path="/createService" element={<AddServices />} />
        <Route path="/service-edit/:id" element={<EditServices />} />
        <Route path="/service-view/:id" element={<ViewServices />} />
        {/* trip  */}
        <Route path="/trip-list" element={<TripList />} />
        {/* payment  */}
        {/* payment branch  */}
        <Route path="/payment/branch-list" element={<BranchPaymentList />} />
        <Route
          path="/payment/edit-branchpay/:id"
          element={<EditBranchPayment />}
        />
        <Route path="/payment/createBranchPay" element={<AddBranchPayment />} />
        {/* payment advance  */}
        <Route path="/payment/advance-list" element={<AdvancePaymentList />} />
        <Route path="/payment/createAdvance" element={<AddAdvacnePayment />} />
        <Route
          path="/payment/edit-advance/:id"
          element={<EditAdvancePayment />}
        />
        {/* payment details  */}
        <Route path="/payment/details-list" element={<DetailsPaymentList />} />
        <Route path="/payment/createDetails" element={<AddDetailsPayment />} />
        <Route
          path="/payment/edit-details/:id"
          element={<EditDetailsPayment />}
        />
        {/* todo  */}
        <Route path="/todo-list" element={<TodoList />} />
        <Route path="/edit-todo/:id" element={<EditTodo />} />
        <Route path="/createTodo" element={<CreateTodo />} />

        {/* //Report */}
        {/* //agencies */}
        <Route path="/report-agencies-form" element={<AgenciesReportForm />} />
        <Route
          path="/report-agencies-form/view"
          element={<AgenciesReportView />}
        />
        {/* //team */}
        <Route path="/report-team-form" element={<TeamReportForm />} />
        <Route path="/report-team-form/view" element={<TeamReportView />} />
        {/* //driver */}
        <Route path="/report-driver-form" element={<DriverReportForm />} />
        <Route path="/report-driver-form/view" element={<DriverReportView />} />
        {/* //vendor */}
        <Route path="/report-vendor-form" element={<VendorReportForm />} />
        <Route path="/report-vendor-form/view" element={<VendorReportView />} />
        <Route path="/report-vechiles-form" element={<VechilesReportForm />} />
        <Route path="/report-vechiles-form/view" element={<VechilesReportView />} />
        <Route
          path="/report-vdetails-form"
          element={<VechilesDetailsReportForm />}
        />
        <Route path="/report-tyre-form" element={<TyreReportForm />} />
        <Route path="/report-services-form" element={<ServiceReportForm />} />
        <Route path="/report-trip-form" element={<TripReportForm />} />
        <Route path="/report-salary-form" element={<SalaryReportForm />} />
        <Route path="/report-payment-form" element={<PaymentReportForm />} />
      </Routes>
    </>
  );
};

export default App;
