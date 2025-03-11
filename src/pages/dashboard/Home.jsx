import React, { useEffect, useState } from "react";
import Layout from "../../layout/Layout";
import BASE_URL from "../../base/BaseUrl";
import axios from "axios";
import { ArrowUpRight, Building, TruckIcon, UserIcon } from "lucide-react";
import { BuildingOfficeIcon } from "@heroicons/react/24/outline";
import moment from "moment";
import { IconInfoCircle } from "@tabler/icons-react";
import dateYear from "../../utils/dateyear";
import { useNavigate } from "react-router-dom";

const Loader = () => {
  return (
    <Layout>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-16 h-16 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
      </div>
    </Layout>
  );
};
// Stylish Dashboard Card Component
const DashboardCard = ({ icon: Icon, label, value, color = "blue", link }) => {
  const navigate = useNavigate();
  return (
    <div
      className={`bg-white shadow-lg rounded-2xl p-5 border-l-4 border-${color}-500 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2`}
    >
      <div
        onClick={() => navigate(`${link}`)}
        className="flex items-center justify-between cursor-pointer"
      >
        <div>
          <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wide ">
            {label}
          </h3>
          <div className="flex items-center space-x-2">
            <p className={`text-3xl font-bold text-${color}-600`}>{value}</p>
          </div>
        </div>
        <div className={` p-3 rounded-full`}>
          <Icon className={`h-8 w-8 text-${color}-600`} />
        </div>
      </div>
    </div>
  );
};

const TableSection = ({ title, columns, data, renderRow }) => (
  <div className="bg-white   border border-gray-200 rounded-lg shadow-sm">
    <div className="px-4 py-3 border-b-2 border-red-500">
      <h3 className="text-lg  flex flex-row items-center  gap-2  text-[black]">
        <IconInfoCircle className="w-4 h-4" />
        <span>{title}</span>
      </h3>
    </div>
    <div className="overflow-x-auto overflow-y-auto h-72">
      <table className="w-full">
        <thead className="bg-[#E1F5FA]  sticky top-0 z-10">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="px-4 py-3  text-left text-xs font-medium text-gray-700 uppercase tracking-wider"
              >
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y text-sm divide-gray-200">
          {data.map((item, index) => renderRow(item, index))}
        </tbody>
      </table>
    </div>
  </div>
);
const Home = () => {
  const [dashboardData, setDashboardData] = useState({
    drivers: 0,
    agencies: 0,
    vehicles: 0,
    branches: 0,
    vehiclesInsurance: [],
    vehiclesFc: [],
    vehiclesIdeal: [],
    currentTrips: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/fetch-dashboard-data-by/${dateYear}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setDashboardData({
          drivers: response.data.driver_count,
          agencies: response.data.agencies_count,
          vehicles: response.data.vehicles_count,
          branches: response.data.branch_count,
          vehiclesInsurance: response.data.vehicles_insurance || [],
          vehiclesFc: response.data.vehicles_fc || [],
          vehiclesIdeal: response.data.vehicles_ideal || [],
          currentTrips: response.data.current_trip || [],
          purchaseTyre: response.data.tyre_purchase || [],
        });
        localStorage.setItem("driver_count", response.data.driver_count);
        localStorage.setItem("agencies_count", response.data.agencies_count);
        localStorage.setItem("vehicles_count", response.data.vehicles_count);
        localStorage.setItem("branch_count", response.data.branch_count);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading)
    return (
      <div>
        <Loader />
      </div>
    );
  return (
    <Layout>
      <div className="container rounded-lg mx-auto px-4 py-6 bg-white">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <DashboardCard
            icon={UserIcon}
            label="Drivers"
            value={dashboardData.drivers}
            color="blue"
            link={"/master/driver-list"}
          />
          <DashboardCard
            icon={BuildingOfficeIcon}
            label="Agencies"
            value={dashboardData.agencies}
            color="green"
            link={"/master/agencies-list"}
          />
          <DashboardCard
            icon={TruckIcon}
            label="Vehicles"
            color="orange"
            value={dashboardData.vehicles}
            link={"/vehicles-list"}
          />
          <DashboardCard
            icon={Building}
            label="Branches"
            color="purple"
            value={dashboardData.branches}
            link={"/master/branch-list"}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 mb-4">
          <TableSection
            title="Recent Purchase Tyres"
            columns={[
              "Date",
              "Company",
              "Branch",
              "Supplier",
              "Bill Ref",
              "Amount",
              "No of Tyres",
            ]}
            data={dashboardData.purchaseTyre}
            renderRow={(item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {moment(item.tyre_date).format("DD-MM-YYYY")}
                </td>
                <td className="px-4 py-3">{item.tyre_company}</td>
                <td className="px-4 py-3">{item.tyre_branch}</td>
                <td className="px-4 py-3">{item.tyre_supplier}</td>
                <td className="px-4 py-3">{item.tyre_bill_ref}</td>
                <td className="px-4 py-3">&#8377;{item.tyre_bill_amount}</td>
                <td className="px-4 py-3">{item.tyre_count}</td>
              </tr>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TableSection
            title="Vehicles Insurance Due"
            columns={["Reg No", "Company", "Branch", "Insurance Due"]}
            data={dashboardData.vehiclesInsurance}
            renderRow={(item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.reg_no}</td>
                <td className="px-4 py-3">{item.vehicle_company}</td>
                <td className="px-4 py-3">{item.vehicle_branch}</td>

                <td className="px-4 py-3">
                  {moment(item.ins_due).format("DD-MM-YYYY")}
                </td>
              </tr>
            )}
          />

          <TableSection
            title="Vehicles FC Due"
            columns={["Reg No", "Company", "Branch", "FC Due"]}
            data={dashboardData.vehiclesFc}
            renderRow={(item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.reg_no}</td>
                <td className="px-4 py-3">{item.vehicle_company}</td>
                <td className="px-4 py-3">{item.vehicle_branch}</td>

                <td className="px-4 py-3">
                  {moment(item.fc_due).format("DD-MM-YYYY")}
                </td>
              </tr>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <TableSection
            title="Idle Vehicles"
            columns={["Reg No", "Company", "Branch"]}
            data={dashboardData.vehiclesIdeal}
            renderRow={(item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.reg_no}</td>
                <td className="px-4 py-3">{item.vehicle_company}</td>
                <td className="px-4 py-3">{item.vehicle_branch}</td>
              </tr>
            )}
          />

          <TableSection
            title="Current Trips"
            columns={["Date", "Reg No", "Branch", "Status"]}
            data={dashboardData.currentTrips}
            renderRow={(item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  {moment(item.trip_date).format("DD-MM-YYYY")}
                </td>
                <td className="px-4 py-3">{item.trip_vehicle}</td>
                <td className="px-4 py-3">{item.trip_branch}</td>
                <td className="px-4 py-3">{item.trip_status}</td>
              </tr>
            )}
          />
        </div>
      </div>
    </Layout>
  );
};

export default Home;