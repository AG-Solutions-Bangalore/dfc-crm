import React, { useEffect, useMemo, useState } from 'react'
import Layout from '../../../layout/Layout'
import { MantineReactTable, useMantineReactTable } from 'mantine-react-table';
import { IconEdit, IconEditCircle, IconEye, IconPlus } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import BASE_URL from '../../../base/BaseUrl';
import { toast } from 'react-toastify';
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
const InspectionTyreList = () => {
  const [inspectionTyreData, setInspectionTyreData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: '',
    message: '',
    onConfirm: null
  });
  const navigate = useNavigate();



  const fetchInspectionData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-tyre-inspection-list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInspectionTyreData(response.data?.tyre);
    } catch (error) {
      console.error("Error fetching inspection Tyre data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInspectionData();
  }, []);
  const handleTyreUpdate = async (e, id) => {
    e.preventDefault();
    setDialogConfig({
      title: 'Update Tyre',
      message: 'Are you sure you want to update this tyre?',
      onConfirm: async () => {
        try {
          setLoading(true);
          await axios({
            url: `${BASE_URL}/api/web-update-tyre-inspection/${id}`,
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          fetchInspectionData();
          toast.success("Tyre Updated Successfully");
         
        } catch (error) {
          console.error("Error updating tyre", error);
          toast.error("Failed to update tyre");
        } finally {
          setLoading(false);
          setDialogOpen(false);
        }
      }
    });
    setDialogOpen(true);
  };

  const handleTyreDead = async (e, id) => {
    e.preventDefault();
    setDialogConfig({
      title: 'Mark Tyre as Dead',
      message: 'Are you sure you want to mark this tyre as dead?',
      onConfirm: async () => {
        try {
          setLoading(true);
          await axios({
            url: `${BASE_URL}/api/web-update-tyre-inspection-dead/${id}`,
            method: "PUT",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          fetchInspectionData();
          toast.success("Tyre Dead Updated Successfully");
          
        } catch (error) {
          console.error("Error marking tyre as dead", error);
          toast.error("Failed to mark tyre as dead");
        } finally {
          setLoading(false);
          setDialogOpen(false);
        }
      }
    });
    setDialogOpen(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "tyre_sub_no",
        header: "Tyre No",
        size:150,
       
      },
      {
        accessorKey: "tyre_sub_branch",
        header: "Branch",
        size: 150,
      },
      {
        accessorKey: "tyre_sub_type",
        header: "Tyre Type",
        size: 50,
      },
      {
        accessorKey: "tyre_sub_make",
        header: "Tyre Make",
        size: 150,
      },
     
      {
        id: "id",
        header: "Action",
        size: 20,
        enableHiding: false,
        Cell: ({ row }) => {
          const id = row.original.id;

          return (
            <div className="flex gap-2">
              
              <div
                onClick={(e)=>handleTyreUpdate(e,id)}
                className="flex items-center space-x-2"
                title="Update Tyre"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              <div
                onClick={(e)=>handleTyreDead(e,id)}
                className="flex items-center space-x-2"
                title="Tyre Dead"
              >
                <IconEditCircle className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div>
              
              
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: inspectionTyreData || [],
    enableFullScreenToggle: false,
    enableDensityToggle: false,
    enableColumnActions: false,
    enableHiding: false,
    enableStickyHeader: true,
    enableStickyFooter: true,
    mantineTableContainerProps: { sx: { maxHeight: "400px" } },
 
    initialState: { columnVisibility: { address: false } },
  });

  return (
   <Layout>
            <Dialog open={dialogOpen} handler={() => setDialogOpen(false)}>
        <DialogHeader>{dialogConfig.title}</DialogHeader>
        <DialogBody>
          {dialogConfig.message}
        </DialogBody>
        <DialogFooter>
          <Button
            variant="text"
            color="red"
            onClick={() => setDialogOpen(false)}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button 
            variant="gradient" 
            color="green" 
            onClick={dialogConfig.onConfirm}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
          <div className="max-w-screen">
        
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Inspection Tyre List
            </h1>
            
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
   </Layout>
  )
}

export default InspectionTyreList