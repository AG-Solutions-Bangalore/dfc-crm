import { Edit, Eye, Plus, PlusCircle, Trash, Truck, View } from "lucide-react";
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

/*-------------------------Vechiles---------------- */
export const VechilesEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "VechilesEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Vehicles">
      <Edit className="h-4 w-4 text-blue-500" />
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
      title="Side View"
    >
      <Eye className="h-4 w-4 text-blue-500" />
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
      title="Truck View"
    >
      <Truck className="h-4 w-4 text-blue-500" />
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
      title="Edit Branch"
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
      
      Branch
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
      title="Edit Tyre Make"
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
      
      Tyre Make
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
      title="Edit Service Type"
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
      
      Service Type
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
      title="Edit Team"
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
      title="View Team"
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
      
      Team
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
      title="Edit Driver"
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
      title="View Driver"
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
      
      Driver
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
      title="Edit Agencies"
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
      title="View Agencies"
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
      
      Agencies
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
      title="Edit Vendor"
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
      title="View Vendor"
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
      
      Vendor
    </button>
  );
};
MasterVendorCreate.page = "Vendor";

/*------------------------------Master-Tyre--------------------------- */



export const MasterPurchaseEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterPurchaseEdit", staticPermissions)) {
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
MasterPurchaseEdit.page = "Purchase";
export const MasterPurchaseView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterPurchaseView", staticPermissions)) {
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
MasterPurchaseView.page = "Purchase";

export const MasterPurchaseCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterPurchaseCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Company
    </button>
  );
};
MasterPurchaseCreate.page = "Purchase";


/*-----------------------------------Master-Fitted Tyre------------ */






export const MasterFittedTyreView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterFittedTyreView", staticPermissions)) {
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
MasterFittedTyreView.page = "Fitted Tyre";

/*------------------Master-Under Inspec. --------------------- */




export const MasterUnderInspectEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterUnderInspectEdit", staticPermissions)) {
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
MasterUnderInspectEdit.page = "Under Inspec.";

export const MasterUnderInspectDelete = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterUnderInspectDelete", staticPermissions)) {
    return null;
  }

  return (
    <button
   
      onClick={onClick}
      className={className}
      title="Delete"
    >
      <Trash className="h-4 w-4 text-blue-500" />
    </button>
  );
};
MasterUnderInspectDelete.page = "Under Inspec.";


/* --------------------------------Master-Trip-List----------------------- */





export const MasterTripEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTripEdit", staticPermissions)) {
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
MasterTripEdit.page = "Trip";
export const MasterTripView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTripView", staticPermissions)) {
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
MasterTripView.page = "Trip";

export const MasterTripCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "MasterTripCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      
      Trip
    </button>
  );
};
MasterTripCreate.page = "Trip";















































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































































/*---------------Service--------------------------------- */
export const ServiceCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ServiceCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Service
    </button>
  );
};
ServiceCreate.page = "Service";

export const ServiceEdit = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ServiceEdit", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Vehicles">
      <Edit className="h-4 w-4" />
    </button>
  );
};
ServiceEdit.page = "Service";
export const ServiceView = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "ServiceView", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className} title="Edit Vehicles">
      <Eye className="h-4 w-4" />
    </button>
  );
};
ServiceView.page = "Service";

/*---------------Payment--------------------------------- */
export const PaymentBranchCreate = ({ onClick, className }) => {
  const userId = localStorage.getItem("id") || "";
  const staticPermissions = getStaticPermissions();
  if (!checkPermission(userId, "PaymentBranchCreate", staticPermissions)) {
    return null;
  }

  return (
    <button onClick={onClick} className={className}>
      <Plus className="h-4 w-4 " />
      Branch Payment
    </button>
  );
};
PaymentBranchCreate.page = "Service";













export default {
  VechilesEdit,
  VechilesCreate,
  VechilesView,
  ServiceCreate,
  ServiceEdit,
  ServiceView,
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
  MasterPurchaseEdit,
  MasterPurchaseView,
  MasterPurchaseCreate,
  MasterFittedTyreView,
  MasterUnderInspectEdit,
  MasterUnderInspectDelete,
  MasterTripCreate,
  MasterTripView,
  MasterTripEdit,





























































































  ServiceCreate,
  ServiceEdit,
  ServiceView,



};


