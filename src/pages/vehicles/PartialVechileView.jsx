import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import { InformationCircleIcon, TruckIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import BASE_URL from "../../base/BaseUrl";
import { CheckCircleIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { VechilesPVGototyre } from "../../components/buttonIndex/ButtonComponents";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b last:border-b-0">
    <span className="text-sm text-gray-800 font-semibold">{label}</span>
    <span className="text-sm font-medium text-right">{value}</span>
  </div>
);

const PartialVechileView = ({ vehicleId }) => {
  const [vehicle, setVehicle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tyre, setTyre] = useState({});
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-vehicles-by-id/${vehicleId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setVehicle(response.data.vehicles);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Vehicle View details:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (vehicleId) {
      fetchVehicleDetails();
    }
  }, [vehicleId]);
  useEffect(() => {
    const fetchTyreVechile = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-vehicles-tyre-sub/${vehicle?.reg_no}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setTyre(response.data.vehiceltyresub);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Vechile partial View details:", error);
        setLoading(false);
      }
    };

    if (vehicle?.reg_no) {
      fetchTyreVechile();
    }
  }, [vehicle?.reg_no]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <TruckIcon className="w-12 h-12 animate-pulse text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className=" bg-red-50 border border-red-200 rounded">
        <p className="text-red-600 flex items-center">
          <InformationCircleIcon className="w-6 h-6 mr-2 text-red-500" />
          Unable to fetch vehicle details
        </p>
      </div>
    );
  }

  if (!vehicle) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-600 flex items-center">
          <InformationCircleIcon className="w-6 h-6 mr-2 text-yellow-500" />
          No vehicle selected
        </p>
      </div>
    );
  }
  const renderTyreIcons = () => {
    let tyreFields = [];
    if (vehicle.vehicle_type === "Car") {
      tyreFields = [
        "tyre_assign_1_front_left_no",
        "tyre_assign_2_front_right_no",
        "tyre_assign_3_back_left_no",
        "tyre_assign_5_back_right_no",
      ];
    } else if (vehicle.vehicle_type === "6W Truck") {
      tyreFields = [
        "tyre_assign_1_front_left_no",
        "tyre_assign_2_front_right_no",
        "tyre_assign_3_back_left_no",
        "tyre_assign_4_back_left_no",
        "tyre_assign_5_back_right_no",
        "tyre_assign_6_back_right_no",
      ];
    } else if (vehicle.vehicle_type === "10W Truck") {
      tyreFields = [
        "tyre_assign_1_front_left_no",
        "tyre_assign_2_front_right_no",
        "tyre_assign_3_back_housing_left_no",
        "tyre_assign_4_back_housing_left_no",
        "tyre_assign_5_back_dummy_left_no",
        "tyre_assign_6_back_dummy_left_no",
        "tyre_assign_7_back_housing_right_no",
        "tyre_assign_8_back_housing_right_no",
        "tyre_assign_9_back_dummy_right_no",
        "tyre_assign_10_back_dummy_right_no",
      ];
    }

    const validCount = tyreFields.filter((field) => tyre[field]).length;
    if (validCount == 0) {
      return <span className="text-sm font-medium text-gray-700">0</span>;
    }
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: validCount }).map((_, index) => (
          <CheckCircleIcon
            key={index}
            className="w-5 h-5 text-black"
            aria-label="Tyre Available"
          />
        ))}
      </div>
    );
  };
  return (
    <Card className="w-full">
      <CardHeader
        color="blue-gray"
        className="relative p-4 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-100"
      >
        <Typography variant="h5" color="blue-gray">
          {vehicle.reg_no}
        </Typography>
      </CardHeader>

      <CardBody className="max-h-[24rem] overflow-y-auto">
        <div className="space-y-4">
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Vehicle Information
            </Typography>
            <DetailRow label="Branch" value={vehicle?.vehicle_branch} />
            <DetailRow label="Company" value={vehicle?.vehicle_company} />
            <DetailRow label="Vehicle Type" value={vehicle?.vehicle_type} />
            <DetailRow label="Model Year" value={vehicle?.mfg_year} />
            <DetailRow label="Vechile Status" value={vehicle?.vehicle_status} />
            {}
            <DetailRow label="Total Tyres" value={renderTyreIcons()} />

            {/* <button  className="p-1 border text-black bg-orange-500 text-[10px] border-black rounded-lg"   onClick={() => window.open(`/vechile-view/${vehicleId}`, '_blank')} >Go to Tyre Page</button> */}
            <VechilesPVGototyre
              className="p-1 border text-black bg-orange-500 text-[10px] border-black rounded-lg"
              onClick={() =>
                window.open(`/vechile-view/${vehicleId}`, "_blank")
              }
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Technical Details
            </Typography>
            <DetailRow label="Open KM" value={vehicle?.vehicle_open_km} />
            <DetailRow label="Open HSD" value={vehicle?.vehicle_hsd_open} />
            <DetailRow label="Mileage" value={vehicle?.vehicle_mileage} />
            <DetailRow
              label="No. of Cylinders"
              value={vehicle?.no_of_gas_cylinder}
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Regulatory Details
            </Typography>
            <DetailRow
              label="Insurance Due"
              value={
                vehicle?.ins_due
                  ? moment(vehicle.ins_due).format("DD-MMMM-YYYY")
                  : "N/A"
              }
            />
            <DetailRow
              label="Permit Due"
              value={
                vehicle?.permit_due
                  ? moment(vehicle.permit_due).format("DD-MMMM-YYYY")
                  : "N/A"
              }
            />
            <DetailRow
              label="FC Due"
              value={
                vehicle?.fc_due
                  ? moment(vehicle.fc_due).format("DD-MMMM-YYYY")
                  : "N/A"
              }
            />
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Driver Information
            </Typography>
            <DetailRow
              label="Driver"
              value={
                vehicle?.vehicle_driver && vehicle?.vehicle_driver_no
                  ? `${vehicle.vehicle_driver} - ${vehicle.vehicle_driver_no}`
                  : "N/A"
              }
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default PartialVechileView;
