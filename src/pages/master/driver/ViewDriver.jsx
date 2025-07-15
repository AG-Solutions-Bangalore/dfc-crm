import axios from "axios";
import React, { useEffect, useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import BASE_URL, { TEAM_URL } from "../../../base/BaseUrl";
import moment from "moment/moment";
const DetailRow = ({ label, value, downloadUrl }) => (
  <div className="flex justify-between py-2 border-b last:border-b-0">
    <span className="text-sm text-gray-800 font-semibold">{label}</span>
    {downloadUrl ? (
      <a
        href={downloadUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm font-medium text-blue-500 underline"
        download
      >
        Download
      </a>
    ) : (
      <span className="text-sm font-medium text-right">{value}</span>
    )}
  </div>
);
const ViewDriver = ({ driverId }) => {
  const [driver, setDriver] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-driver-by-id/${driverId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDriver(response.data.driver);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Driver View details:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (driverId) {
      fetchVehicleDetails();
    }
  }, [driverId]);

  if (loading) {
    return (
      <div className="p-4 bg-orange-300 border border-yellow-200 rounded">
        <p className="text-black flex items-center animate-pulse">
          <InformationCircleIcon className="w-6 h-6 mr-2  text-black" />
          Loading...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className=" bg-red-50 border border-red-200 rounded">
        <p className="text-red-600 flex items-center">
          <InformationCircleIcon className="w-6 h-6 mr-2 text-red-500" />
          Unable to fetch Driver details
        </p>
      </div>
    );
  }

  if (!driverId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-600 flex items-center">
          <InformationCircleIcon className="w-6 h-6 mr-2 text-yellow-500" />
          No Driver Id selected
        </p>
      </div>
    );
  }
  return (
    <Card className="w-full">
      <CardHeader
        color="blue-gray"
        className="relative p-4 bg-gradient-to-r from-orange-300 via-orange-200 to-orange-100"
      >
        <Typography variant="h5" color="blue-gray">
          {driver.full_name}
        </Typography>
      </CardHeader>

      <CardBody className="max-h-[24rem] overflow-y-auto">
        <div className="space-y-4">
          {/* Vehicle Details Sections */}
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Driver Information
            </Typography>
            <DetailRow label="Branch" value={driver?.user_branch} />
            <DetailRow label="Company" value={driver?.user_company} />
            <DetailRow label="Vehicle Type" value={driver?.vehicle_type} />
            <DetailRow label="Mobile No" value={driver?.mobile} />
            <DetailRow label="Email" value={driver?.email} />
            <DetailRow label="Address" value={driver?.user_address} />
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Vehicle Information
            </Typography>
            <DetailRow label="DL No" value={driver?.dl_no} />
            <DetailRow
              label="DL Expire"
              value={moment(driver?.dl_expiry).format("DD-MMM-YYYY") || ""}
            />
            <DetailRow label="Hazard Lice No" value={driver?.hazard_lice_no} />
            <DetailRow
              label="Hazard Lice Exp"
              value={
                moment(
                  driver?.hazard_lice_expiry || "",
                  "YYYY-MM-DD",
                  true
                ).isValid()
                  ? moment(driver?.hazard_lice_expiry).format("DD-MMM-YYYY")
                  : ""
              }
            />{" "}
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Bank Details
            </Typography>
            <DetailRow label="Bank" value={driver?.user_bank} />
            <DetailRow label="Branch" value={driver?.user_bank_branch} />
            <DetailRow label="IFSC Code" value={driver?.user_ifsc_code} />
            <DetailRow label="Account No" value={driver?.user_account_no} />
            <DetailRow label="Insurance" value={driver?.user_insurance} />
            <DetailRow label="Insurance No" value={driver?.user_insurance_no} />
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Attachment
            </Typography>
            {driver?.user_image && (
              <DetailRow
                label="Photo"
                downloadUrl={`${TEAM_URL}/profiles/${driver?.user_image}`}
              />
            )}
            {driver?.user_adhar_card && (
              <DetailRow
                label="Aadhar Card"
                downloadUrl={`${TEAM_URL}/profiles_document/${driver?.user_adhar_card}`}
              />
            )}
            {driver?.user_pan_card && (
              <DetailRow
                label="Pan Card"
                downloadUrl={`${TEAM_URL}/profiles_document/${driver?.user_pan_card}`}
              />
            )}
            {driver?.user_passbook && (
              <DetailRow
                label="Passbook"
                downloadUrl={`${TEAM_URL}/profiles_document/${driver?.user_passbook}`}
              />
            )}
            {driver?.user_licence && (
              <DetailRow
                label="Licence"
                downloadUrl={`${TEAM_URL}/profiles_document/${driver?.user_licence}`}
              />
            )}
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ViewDriver;
