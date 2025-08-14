import axios from "axios";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useEffect, useMemo, useState } from "react";
import BASE_URL from "../../../base/BaseUrl";
import Layout from "../../../layout/Layout";
import moment from "moment/moment";

const TyreHistroy = () => {
  const [TyreHistroyData, setTyreHistroyData] = useState(null);
  const fetchUnassignData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${BASE_URL}/api/web-fetch-vehicles-tyre-history-list`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTyreHistroyData(response.data?.tyreHistory);
    } catch (error) {
      console.error("Error fetching Unassign Type tyre data", error);
    }
  };

  useEffect(() => {
    fetchUnassignData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "history_reg_no",
        header: "Reg No",
        size: 150,
      },
      {
        accessorKey: "history_assign_positionL",
        header: "Position",
        size: 150,
      },
      {
        accessorKey: "history_assign_no",
        header: "Tyre No",
        size: 50,
      },
      {
        accessorKey: "history_assign_type",
        header: "Type",
        size: 50,
      },
      {
        accessorKey: "history_assign_make",
        header: "Make",
        size: 150,
      },
      {
        accessorKey: "history_assign_date",

        header: "Fitting Date",
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return date ? moment(date).format("DD-MM-YYYY") : "";
        },
      },
      {
        accessorKey: "history_assign_km",
        header: "Fitting KM",
        size: 150,
      },

      {
        accessorKey: "history_assign_pre_date",
        header: "Remove Date",
        size: 150,
        Cell: ({ cell }) => {
          const date = cell.getValue();
          return date ? moment(date).format("DD-MM-YYYY") : "";
        },
      },

      {
        accessorKey: "history_assign_pre_km",
        header: "Remove KM",
        size: 150,
      },
      {
        accessorKey: "runkm",
        header: "Run Km",
        size: 150,
        Cell: ({ row }) => {
          const removekm = Number(row.original.history_assign_pre_km) || 0;
          const fittingkm = Number(row.original.history_assign_km) || 0;
          const diff = removekm - fittingkm;
          return diff;
        },
      },

      {
        accessorKey: "history_assign_status",
        header: "Status",
        size: 50,
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: TyreHistroyData || [],
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
      <div className="max-w-screen">
        <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
            <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
              Tyre Histroy List
            </h1>
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default TyreHistroy;
