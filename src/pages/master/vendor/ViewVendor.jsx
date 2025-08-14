import axios from 'axios';
import React, { useEffect, useState } from 'react'
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import BASE_URL from '../../../base/BaseUrl';
const DetailRow = ({ label, value }) => (
    <div className="flex justify-between py-2 border-b last:border-b-0">
      <span className="text-sm text-gray-800 font-semibold">{label}</span>
      <span className="text-sm font-medium text-right">{value}</span>
    </div>
  );
const ViewVendor = ({vendorId}) => {
    const [vendor, setVendor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchVehicleDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `${BASE_URL}/api/web-fetch-vendor-by-id/${vendorId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setVendor(response.data.vendor);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching Vendor View details:", error);
            setError(error);
            setLoading(false);
          }
        };
    
        if (vendorId) {
          fetchVehicleDetails();
        }
      }, [vendorId]);
      
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
              Unable to fetch Vendor details
            </p>
          </div>
        );
      }
    
      if (!vendorId) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-600 flex items-center">
              <InformationCircleIcon className="w-6 h-6 mr-2 text-yellow-500" />
              No Vendor Id selected
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
        {vendor.vendor_name}
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
            Vendor Information
          </Typography>
          <DetailRow label="Branch" value={vendor?.vendor_branch} />
          <DetailRow label="Vendor Type" value={vendor?.vendor_type} />
          <DetailRow label="GST" value={vendor?.vendor_gst} />
          <DetailRow label="PAN No" value={vendor?.vendor_pan} />
          <DetailRow label="Contact Person" value={vendor?.vendor_contact_person} />
          <DetailRow label="Mobile No" value={vendor?.vendor_mobile} />
          <DetailRow label="Email" value={vendor?.vendor_email} />
          <DetailRow label="Address" value={vendor?.vendor_address} />
        
        </div>

        

        
      </div>
    </CardBody>
  </Card>
  )
}

export default ViewVendor