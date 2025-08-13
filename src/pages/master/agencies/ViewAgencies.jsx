import axios from "axios";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import BASE_URL from "../../../base/BaseUrl";

const DetailRow = ({ label, value }) => (
  <div className="flex justify-between py-2 border-b last:border-b-0">
    <span className="text-sm text-gray-800 font-semibold">{label}</span>
    <span className="text-sm font-medium text-right">{value}</span>
  </div>
);
const ViewAgencies = ({ agencyId }) => {
  const [agency, setAgency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchVehicleDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/web-fetch-agencies-by-id/${agencyId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setAgency(response.data.agencies);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching Agency View details:", error);
        setError(error);
        setLoading(false);
      }
    };

    if (agencyId) {
      fetchVehicleDetails();
    }
  }, [agencyId]);

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
          Unable to fetch Agency details
        </p>
      </div>
    );
  }

  if (!agencyId) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
        <p className="text-yellow-600 flex items-center">
          <InformationCircleIcon className="w-6 h-6 mr-2 text-yellow-500" />
          No Agency Id selected
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
          {agency.agency_name}
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
              Agency Information
            </Typography>
            <DetailRow label="Brand" value={agency?.agency_short} />
            <DetailRow label="Branch" value={agency?.agency_branch} />
            <DetailRow
              label="Contact Person"
              value={agency?.agency_contact_person}
            />
            <DetailRow label="Mobile" value={agency?.agency_mobile} />
            <DetailRow label="Email" value={agency?.agency_email} />

            <DetailRow label="RT Km" value={agency?.agency_rt_km} />
            <DetailRow label="City" value={agency?.agency_city} />
            <DetailRow label="State" value={agency?.agency_state} />
            <DetailRow
              label="Bata for Trip 6W"
              value={agency?.agency_bata_for_trip_6W}
            />
            <DetailRow
              label="Bata for Trip 10W"
              value={agency?.agency_bata_for_trip_10W}
            />
            <DetailRow label="Hamali for 6W" value={agency?.agency_hmali} />
            <DetailRow
              label="Hamali for 10W"
              value={agency?.agency_hmali_10W}
            />
          </div>
        </div>
      </CardBody>
    </Card>
  );
};

export default ViewAgencies;
