import axios from 'axios';
import React, { useEffect, useState } from 'react'
import BASE_URL from '../../../base/BaseUrl';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import {
    Card,
    CardHeader,
    CardBody,
    Typography,
  } from "@material-tailwind/react";
  const DetailRow = ({ label, value,downloadUrl }) => (
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
const ViewTeam = ({teamId}) => {
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        const fetchVehicleDetails = async () => {
          try {
            const token = localStorage.getItem("token");
            const response = await axios.get(
              `${BASE_URL}/api/web-fetch-team-by-id/${teamId}`,
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );
            setTeam(response.data.team);
            setLoading(false);
          } catch (error) {
            console.error("Error fetching Team View details:", error);
            setError(error);
            setLoading(false);
          }
        };
    
        if (teamId) {
          fetchVehicleDetails();
        }
      }, [teamId]);
      
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
              Unable to fetch Team details
            </p>
          </div>
        );
      }
    
      if (!teamId) {
        return (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-yellow-600 flex items-center">
              <InformationCircleIcon className="w-6 h-6 mr-2 text-yellow-500" />
              No Team Id selected
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
          {team.full_name}
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
              Team Information
            </Typography>
            <DetailRow label="Company" value={team?.user_company} />
            <DetailRow label="Branch" value={team?.user_branch} />
            <DetailRow label="Mobile No" value={team?.mobile} />
            <DetailRow label="Email" value={team?.email} />
            <DetailRow label="Salary" value={team?.user_salary} />
            <DetailRow label="Address" value={team?.user_address} />
            
          </div>

          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Bank Details
            </Typography>
            <DetailRow label="Bank" value={team?.user_bank} />
            <DetailRow label="Branch" value={team?.user_bank_branch} />
            <DetailRow label="IFSC Code" value={team?.user_ifsc_code} />
            <DetailRow label="Account No" value={team?.user_account_no} />
            <DetailRow label="Insurance" value={team?.user_insurance} />
            <DetailRow label="Insurance No" value={team?.user_insurance_no} />
           
          </div>
          <div>
            <Typography
              variant="h6"
              color="blue-gray"
              className="mb-2 border-b pb-1"
            >
              Attachment
            </Typography>
            <DetailRow label="Photo"  downloadUrl={`https://dfclogistics.online/storage/app/public/profiles/${team?.user_image}`} />
            <DetailRow label="Aadhar Card"  downloadUrl={`https://dfclogistics.online/storage/app/public/profiles_document/${team?.user_adhar_card}`} />
            <DetailRow label="Pan Card"  downloadUrl={`https://dfclogistics.online/storage/app/public/profiles_document/${team?.user_pan_card}`} />
            <DetailRow label="Passbook"  downloadUrl={`https://dfclogistics.online/storage/app/public/profiles_document/${team?.user_passbook}`} />
            <DetailRow label="Licence"  downloadUrl={`https://dfclogistics.online/storage/app/public/profiles_document/${team?.user_licence}`} />
          
           
          </div>

       

    
        </div>
      </CardBody>
    </Card>
  )
}

export default ViewTeam