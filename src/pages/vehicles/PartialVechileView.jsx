import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from 'moment';
import { InformationCircleIcon, TruckIcon } from '@heroicons/react/24/outline';
import BASE_URL from '../../base/BaseUrl';

const PartialVechileView = ({vehicleId}) => {
    const [vehicle, setVehicle] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
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
  
    if (loading) {
      return (
        <div className="flex justify-center items-center h-full">
          <TruckIcon className="w-12 h-12 animate-pulse text-blue-500" />
        </div>
      );
    }
  
    if (error) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded">
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
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="mb-4">
        <h1 className="print:text-lg print:text-black text-blue-500 font-bold">
          {vehicle.reg_no}
        </h1>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Branch</td>
                <td>{vehicle?.vehicle_branch || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Company</td>
                <td>{vehicle?.vehicle_company || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Vehicle Type</td>
                <td>{vehicle?.vehicle_type || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Modal Year</td>
                <td>{vehicle?.mfg_year || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Open KM</td>
                <td>{vehicle?.vehicle_open_km || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Open HSD</td>
                <td>{vehicle?.vehicle_hsd_open || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div>
          <table className="w-full">
            <tbody>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Insurance Due</td>
                <td>
                  {vehicle?.ins_due 
                    ? moment(vehicle.ins_due).format("DD-MMMM-YYYY") 
                    : 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Permit Due</td>
                <td>
                  {vehicle?.permit_due 
                    ? moment(vehicle.permit_due).format("DD-MMMM-YYYY") 
                    : 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">FC Due</td>
                <td>
                  {vehicle?.fc_due 
                    ? moment(vehicle.fc_due).format("DD-MMMM-YYYY") 
                    : 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Mileage</td>
                <td>{vehicle?.vehicle_mileage || 'N/A'}</td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">Driver</td>
                <td>
                  {vehicle?.vehicle_driver && vehicle?.vehicle_driver_no
                    ? `${vehicle.vehicle_driver} - ${vehicle.vehicle_driver_no}`
                    : 'N/A'}
                </td>
              </tr>
              <tr className="border-b">
                <td className="font-semibold w-1/3 py-2">No of Cylinder</td>
                <td>{vehicle?.no_of_gas_cylinder || 'N/A'}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default PartialVechileView