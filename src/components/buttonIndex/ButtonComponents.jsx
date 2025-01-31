import { Edit, Eye, Plus, PlusCircle, Truck, View } from "lucide-react";
import React from "react";
import { checkPermission } from "./checkPermission";


const getStaticPermissions = () => {
  const buttonPermissions = localStorage.getItem("buttonControl");
  try {
    return buttonPermissions ? JSON.parse(buttonPermissions) : [];
  } catch (error) {
    console.error(
      "Error parsing StaticPermission data from localStorage",
      error
    );
    return [];
  }

};
export const VechilesEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Vehicles"
    >
      <Edit className="h-4 w-4" />
    </button>
  );
};
VechilesEdit.page = "Vehicles";
export const VechilesView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesView", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Vehicles"
    >
      <Eye className="h-4 w-4" />
    </button>
  );
};
VechilesView.page = "Vehicles";

export const VechilesCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Vehicles
    </button>
  );
};
VechilesCreate.page = "Vehicles";
export const VechilesCreateTyre = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesCreateTyre", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Tyre
    </button>
  );
};
VechilesCreateTyre.page = "Vehicles";

export const VechilesTruck = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesTruck", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit truck"
    >
      <Truck className="h-4 w-4" />
    </button>
  );
};
VechilesTruck.page = "Vehicles";

/*  ------------------------Master-Company--------------------------------*/


export const MasterCompanyEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterCompanyEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterCompanyEdit.page = "Company";
export const MasterCompanyView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterCompanyView", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="View Company"
    >
      <Eye  className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterCompanyView.page = "Company";

export const MasterCompanyCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterCompanyCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterCompanyCreate.page = "Company";

/*--------------------------Master-Branch--------------------- */

export const MasterBranchEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterBranchEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterBranchEdit.page = "Branch";


export const MasterBranchCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterBranchCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterBranchCreate.page = "Branch";

/*----------------------Master-Tyre Make-------------------------- */

export const MasterTyreMakeEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTyreMakeEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterTyreMakeEdit.page = "Tyre Make";


export const MasterTyreMakeCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTyreMakeCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterTyreMakeCreate.page = "Tyre Make";

/*---------------------------Master-Service Type------------------- */


export const MasterServiceTypeEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterServiceTypeEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterServiceTypeEdit.page = "Service Type";


export const MasterServiceTypeCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterServiceTypeCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterServiceTypeCreate.page = "Service Type";

/*--------------------------Master-Team--------------------------- */


export const MasterTeamEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTeamEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterTeamEdit.page = "Team";
export const MasterTeamView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTeamView", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="View Company"
    >
      <Eye  className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterTeamView.page = "Team";

export const MasterTeamCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTeamCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterTeamCreate.page = "Team";





/* -----------------------Master-Driver----------------- */




export const MasterDriverEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterDriverEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterDriverEdit.page = "Driver";
export const MasterDriverView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterDriverView", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="View Company"
    >
      <Eye  className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterDriverView.page = "Driver";

export const MasterDriverCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterDriverCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterDriverCreate.page = "Driver";

/*-------------------------------Master-Agencies------------------- */





export const MasterAgenciesEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterAgenciesEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterAgenciesEdit.page = "Agencies";
export const MasterAgenciesView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterAgenciesView", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="View Company"
    >
      <Eye  className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterAgenciesView.page = "Agencies";

export const MasterAgenciesCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterAgenciesCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterAgenciesCreate.page = "Agencies";

/*------------------------Master-Vendor-------------------------- */


export const MasterVendorEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterVendorEdit", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Edit Company"
    >
      <Edit className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterVendorEdit.page = "Vendor";
export const MasterVendorView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterVendorView", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="View Company"
    >
      <Eye  className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterVendorView.page = "Vendor";

export const MasterVendorCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterVendorCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterVendorCreate.page = "Vendor";

export default {
  VechilesEdit,
  VechilesCreate,
  VechilesView,
  MasterCompanyCreate,
  MasterCompanyView,
  MasterCompanyEdit,
  MasterBranchEdit,
  MasterBranchCreate,
  MasterTyreMakeEdit,
  MasterTyreMakeCreate,
  MasterServiceTypeEdit,
  MasterServiceTypeCreate,
  MasterTeamEdit,
  MasterTeamView,
  MasterTeamCreate,
  MasterDriverEdit,
  MasterDriverView,
  MasterDriverCreate,
  MasterAgenciesEdit,
  MasterAgenciesView,
  MasterAgenciesCreate,
  MasterVendorEdit,
  MasterVendorView,
  MasterVendorCreate,
  VechilesCreateTyre,
  VechilesTruck,




};


