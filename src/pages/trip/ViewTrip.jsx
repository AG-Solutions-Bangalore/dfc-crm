import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { IconBuilding } from '@tabler/icons-react';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import BASE_URL from '../../base/BaseUrl';
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-sm text-gray-800 font-semibold">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
const ViewTrip = ({tripId}) => {
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchTripDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `${BASE_URL}/api/web-fetch-trip-by-id/${tripId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setTrip(response.data.trip);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching trip View details:", error);
            setError(error);
            setLoading(false);
          }
        };
    
        if (tripId) {
            fetchTripDetails();
        }
      }, [tripId]);
      
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
              Unable to fetch Trip details
            </p>
          </div>
        );
      }
    
      if (!tripId) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-600 flex items-center">
              <InformationCircleIcon className="w-6 h-6 mr-2 text-yellow-500" />
              No Trip Id selected
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
        {trip.trip_vehicle}
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
            Trip Information
          </Typography>
          <DetailRow label="Date" value={trip?.trip_date} />
          <DetailRow label="Company" value={trip?.trip_company} />
          <DetailRow label="Branch" value={`${trip?.trip_branch} - ${trip.trip_branch_salary_type}` } />


          <DetailRow label="Vechile Type" value={trip?.trip_vehicle_type} />
          <DetailRow label="Agency" value={trip?.trip_agency} />
          <DetailRow label="Vendor" value={trip?.trip_supplier} />
          <DetailRow label="Driver" value={`${trip?.trip_driver} - ${trip.trip_driver_no}`} />
          <DetailRow label="Remarks" value={trip?.trip_remarks} />
        
        </div>

        <div>
          <Typography
            variant="h6"
            color="blue-gray"
            className="mb-2 border-b pb-1"
          >
            Trip List
          </Typography>
          
        
        </div>
        <div className="overflow-x-auto">
    <table className="min-w-full border-collapse border border-gray-200">
      <thead>
        <tr className="bg-gray-100 border-b">
          <th className="px-4 py-2 border text-left text-sm font-semibold">KM</th>
          <th className="px-4 py-2 border text-left text-sm font-semibold">Mileage</th>
          <th className="px-4 py-2 border text-left text-sm font-semibold">HSD</th>
          <th className="px-4 py-2 border text-left text-sm font-semibold">HSD Supplied</th>
          <th className="px-4 py-2 border text-left text-sm font-semibold">Himali</th>
          <th className="px-4 py-2 border text-left text-sm font-semibold">Advance</th>
        </tr>
      </thead>
      <tbody>
        <tr className="border-b">
          <td className="px-4 py-2 border text-sm">{trip?.trip_km}</td>
          <td className="px-4 py-2 border text-sm">{trip?.trip_mileage}</td>
          <td className="px-4 py-2 border text-sm">{trip?.trip_hsd}</td>
          <td className="px-4 py-2 border text-sm">{trip?.trip_hsd_supplied}</td>
          <td className="px-4 py-2 border text-sm">{trip?.trip_hmali}</td>
          <td className="px-4 py-2 border text-sm">{trip?.trip_advance}</td>
        </tr>
      </tbody>
    </table>
  </div>
        
      </div>
    </CardBody>
  </Card>
  )
}

export default ViewTrip