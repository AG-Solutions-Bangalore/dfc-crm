import React, { useContext, useState, useMemo, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Checkbox } from "@material-tailwind/react";
import axios from "axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ContextPanel } from "../../context/ContextPanel";
import BASE_URL from "../../base/BaseUrl";
import Layout from "../../layout/Layout";
const ManagementDashboard = () => {
    const { id } = useParams();
    const userId = Number(id);
    const queryClient = useQueryClient();
    const { getStaticUsers,fetchPagePermission,fetchPermissions } = useContext(ContextPanel);
    const staticUsers = getStaticUsers();
    const [buttonPermissions, setButtonPermissions] = useState([]);
    const [pagePermissions, setPagePermissions] = useState([]);
  
    const {
      data: buttonControlData,
      isLoading: isLoadingButtons,
      isError: isErrorButtons,
    } = useQuery({
      queryKey: ["usercontrol"],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-usercontrol`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.buttonPermissions;
      },
    });
  
    const updateButtonPermissionMutation = useMutation({
      mutationFn: async ({ permissionId, updatedData }) => {
        const token = localStorage.getItem("token");
       
        const response = await axios.put(
          `${BASE_URL}/api/panel-update-usercontrol/${permissionId}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["usercontrol"]);
        fetchPermissions()
      },
      onError: (error) => {
        console.error("Error updating button permissions:", error);
    
        setButtonPermissions(buttonControlData);
      },
    });
  
    const updatePagePermissionMutation = useMutation({
      mutationFn: async ({ permissionId, updatedData }) => {
        const token = localStorage.getItem("token");
      
        const response = await axios.put(
          `${BASE_URL}/api/panel-update-usercontrol-new/${permissionId}`,
          updatedData,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data;
      },
      onSuccess: () => {
        queryClient.invalidateQueries(["usercontrol-pages"]);
        fetchPagePermission()
      },
      onError: (error) => {
        console.error("Error updating page permissions:", error);
        setPagePermissions(pageControlData);
      },
    });
  
    const {
      data: pageControlData,
      isLoading: isLoadingPages,
      isError: isErrorPages,
    } = useQuery({
      queryKey: ["usercontrol-pages"],
      queryFn: async () => {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          `${BASE_URL}/api/panel-fetch-usercontrol-new`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        return response.data.pagePermissions;
      },
    });
  
    useEffect(() => {
      if (buttonControlData) {
        setButtonPermissions(buttonControlData);
      }
    }, [buttonControlData]);
  
    useEffect(() => {
      if (pageControlData) {
        setPagePermissions(pageControlData);
      }
    }, [pageControlData]);
  
    const user = staticUsers.find((u) => u.id === userId);
  
    const pages = useMemo(
      () => [...new Set(pagePermissions.map((p) => p.page))],
      [pagePermissions]
    );
  
  
  
    const handleButtonPermissionChange = async (button, isChecked, permissionId) => {
      try {
     
        const currentPermission = buttonPermissions.find(
          (permission) => permission.id === permissionId
        );
  
        if (!currentPermission) return;
  
       
        const newUserIds = isChecked
          ? [...currentPermission.userIds, userId.toString()]
          : currentPermission.userIds.filter((id) => id !== userId.toString());
  
        
          const userIdsAsString = newUserIds.join(',');
        
        
        const updatedData = {
          pages: currentPermission.pages,
          button: currentPermission.button,
          status: "Active",
          userIds: userIdsAsString,  
        };
        const updatedPermissions = buttonPermissions.map((permission) => {
          if (permission.id === permissionId) {
            return { ...permission, userIds: newUserIds };
          }
          return permission;
        });
        setButtonPermissions(updatedPermissions);
  
       
        await updateButtonPermissionMutation.mutateAsync({
          permissionId,
          updatedData,
        });
      } catch (error) {
        console.error("Error updating button permissions:", error);
      }
    };
  
    const handlePagePermissionChange = async (page, isChecked) => {
      try {
        const currentPermission = pagePermissions.find(
          (permission) => permission.page === page
        );
  
        if (!currentPermission) return;
  
        const newUserIds = isChecked
          ? [...currentPermission.userIds, userId.toString()]
          : currentPermission.userIds.filter((id) => id !== userId.toString());
  
        const userIdsAsString = newUserIds.join(',');
  
        const updatedData = {
          page: currentPermission.page,
          url: currentPermission.url,
          status: "Active",
          userIds: userIdsAsString,
        };
  
        const updatedPermissions = pagePermissions.map((permission) => {
          if (permission.page === page) {
            return { ...permission, userIds: newUserIds };
          }
          return permission;
        });
        setPagePermissions(updatedPermissions);
  
        await updatePagePermissionMutation.mutateAsync({
          permissionId: currentPermission.id,
          updatedData,
        });
      } catch (error) {
        console.error("Error updating page permissions:", error);
      }
    };
  
    if (!user) {
      return (
        <Layout>
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600">No User Found</div>
            </div>
          </div>
        </Layout>
      );
    }
  
    if (isLoadingButtons || isLoadingPages) {
      return (
        <Layout>
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading...</div>
            </div>
          </div>
        </Layout>
      );
    }
  
    if (isErrorPages || isErrorButtons) {
      return (
        <Layout>
          <div className="container mx-auto p-6">
            <div className="flex items-center justify-center h-64">
              <div className="text-lg text-red-600">
                Error loading user management
              </div>
            </div>
          </div>
        </Layout>
      );
    }
  
  return (
  <Layout>
       <div className="container mx-auto p-6">
         <div className="bg-white rounded-lg shadow-lg overflow-hidden">
           {/* Header */}
           <div className="bg-gray-200 p-6">
             <div className="flex items-center justify-between">
               <div>
                 <h2 className="text-2xl font-bold">{user.name}</h2>
               </div>
               <span
                 className={`px-3 py-1 rounded-full text-sm capitalize ${
                   user.user_type_id === 3
                     ? "bg-red-100 text-red-800"
                     : user.user_type_id === 2
                     ? "bg-blue-100 text-blue-800"
                     :user.user_type_id === 4
                     ? "bg-green-100 text-green-800"
                     :user.user_type_id === 5
                     ?"bg-purple-100 text-purple-800 "
                     : "bg-gray-100 text-gray-800"
                 }`}
               >
               {user.user_type_id === 3
                           ? "Branch Manager"
                           : user.user_type_id === 2
                           ? "Admin"
                           : user.user_type_id === 4
                           ? "Branch User"
                           : user.user_type_id === 5
                           ? "Superadmin"
                           : "N/A"}
               </span>
             </div>
           </div>
 
           {/* Content */}
           <div className="p-6">
             {pages.map((page) => (
               <div key={page} className="mb-8">
                 <div className="flex items-center justify-between mb-4">
                   <h3 className="text-xl font-semibold">{page}</h3>
                   <div className="flex items-center gap-2">
                     <span className="text-sm text-gray-600">Page Access:</span>
                     <Checkbox
                       color="blue"
                       checked={pagePermissions
                         .find((p) => p.page === page)
                         ?.userIds.includes(userId.toString())}
                       onChange={(e) =>
                         handlePagePermissionChange(page, e.target.checked)
                       }
                       className="h-5 w-5"
                     />
                   </div>
                 </div>
 
                 {/* Button Permissions */}
                 {buttonPermissions.some((p) => p.pages === page) && (
                   <div className="bg-gray-200 rounded-lg p-4">
                     <table className="w-full">
                       <thead>
                         <tr>
                           <th className="text-left pb-2 font-semibold text-gray-700">
                             Button
                           </th>
                           <th className="text-left pb-2 font-semibold text-gray-700">
                             Access
                           </th>
                         </tr>
                       </thead>
                       <tbody>
                         {buttonPermissions
                           .filter((p) => p.pages === page)
                           .map((permission) => (
                             <tr
                               key={permission.id}
                               className="border-t border-gray-200"
                             >
                               <td className="py-3 w-96">
                                 {permission.button}
                                 {permission.id}
                               </td>
                               <td className="py-3">
                                 <Checkbox
                                   color="blue"
                                   checked={permission.userIds.includes(
                                     userId.toString()
                                   )}
                                   onChange={(e) =>
                                     handleButtonPermissionChange(
                                       permission.button,
                                       e.target.checked,
                                       permission.id
                                     )
                                   }
                                   className="h-5 w-5 bg-white"
                                 />
                               </td>
                             </tr>
                           ))}
                       </tbody>
                     </table>
                   </div>
                 )}
               </div>
             ))}
           </div>
         </div>
       </div>
     </Layout>
  )
}

export default ManagementDashboard