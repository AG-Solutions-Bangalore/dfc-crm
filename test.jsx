const VehiclesList = () => {
    const [vehiclesData, setVehiclesData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState("Active");
    const [isViewExpanded, setIsViewExpanded] = useState(false);
    const [selectedVehicleId, setSelectedVehicleId] = useState(null); // New state for selected ID
  
    const navigate = useNavigate();
  
    const fetchVehiclesData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const response = await axios.get(`${BASE_URL}/api/web-fetch-vehicles-list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        setVehiclesData(response.data?.vehicles);
      } catch (error) {
        console.error("Error fetching Vehicles data", error);
      } finally {
        setLoading(false);
      }
    };
  
    useEffect(() => {
      fetchVehiclesData();
    }, []);
  
    const getStatusColor = (dueDate) => {
      const currentDate = moment();
      const dueDateObj = moment(dueDate);
      if (dueDateObj.isSameOrBefore(currentDate)) {
        return "red";
      }
      const oneMonthAfter = moment(currentDate).add(1, "month");
      if (dueDateObj.isBetween(currentDate, oneMonthAfter)) {
        return "orange";
      }
      return "green";
    };
  
    const filteredVehiclesData = useMemo(() => {
      if (!vehiclesData) return [];
      return vehiclesData.filter((vehicle) => vehicle.vehicle_status === activeTab);
    }, [vehiclesData, activeTab]);
  
    const columns = useMemo(
      () => [
        {
          accessorKey: "combined",
          header: "Register No & V Type",
          size: 180,
          accessorFn: (row) => `${row.reg_no} - ${row.vehicle_type}`,
          Cell: ({ row }) => (
            <div className="flex flex-col">
              <span className="text-black font-bold">{row.original.reg_no}</span>
              <span>{row.original.vehicle_type}</span>
            </div>
          ),
        },
        {
          accessorKey: "combined2",
          header: "Branch & Company",
          size: 200,
          accessorFn: (row) => `${row.vehicle_branch} - ${row.vehicle_company}`,
          Cell: ({ row }) => (
            <div className="flex flex-col">
              <span>{row.original.vehicle_branch}</span>
              <span>{row.original.vehicle_company}</span>
            </div>
          ),
        },
        {
          accessorKey: "mfg_year",
          header: "Modal Year",
          size: 50,
        },
        {
          accessorKey: "combined_status",
          header: "Insu/Per /FC",
          size: 150,
          Cell: ({ row }) => {
            const { ins_due, permit_due, fc_due } = row.original;
  
            return (
              <div className="flex flex-row items-center gap-2">
                {["Insurance", "Permit", "FC"].map((type, index) => (
                  <Tooltip
                    key={index}
                    label={`${type} Due: ${moment(row.original[`${type.toLowerCase()}_due`]).format(
                      "DD-MM-YYYY"
                    )}`}
                    withArrow
                  >
                    <span
                      className={`h-3 w-3 rounded-full ${
                        getStatusColor(row.original[`${type.toLowerCase()}_due`])
                      }`}
                    />
                  </Tooltip>
                ))}
              </div>
            );
          },
        },
        {
          accessorKey: "vehicle_status",
          header: "Status",
          size: 50,
        },
      ],
      []
    );
  
    const table = useMantineReactTable({
      columns,
      data: filteredVehiclesData || [],
      enableFullScreenToggle: false,
      enableDensityToggle: false,
      enableColumnActions: false,
      enableHiding: false,
      enableStickyHeader: true,
      enableStickyFooter: true,
      mantineTableContainerProps: { sx: { maxHeight: "400px" } },
      getRowProps: (row) => ({
        onClick: () => {
          setSelectedVehicleId(row.original.id); // Set the selected vehicle ID
          setIsViewExpanded(true); // Expand the PartialView
        },
        style: { cursor: "pointer" },
      }),
    });
  
    return (
      <Layout>
        <div className="max-w-screen">
          <div className="bg-white p-4 mb-4 rounded-lg shadow-md">
            <div className="flex flex-col md:flex-row justify-between gap-4 items-center">
              <h1 className="border-b-2 font-[400] border-dashed border-orange-800 text-center md:text-left">
                Vehicles List
              </h1>
              <div className="flex flex-row items-center gap-2">
                <button
                  onClick={() => navigate("/createVechiles")}
                  className="text-white bg-blue-600 hover:bg-red-700 p-2 rounded-lg shadow-md"
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>
          <div className="flex w-full p-4 gap-2 relative">
            <div className={`transition-all duration-300 ease-in-out ${isViewExpanded ? "w-[70%]" : "w-full"}`}>
              <MantineReactTable table={table} />
            </div>
            {isViewExpanded && (
              <div className="w-[30%] p-4 border-l border-red-400 transition-all duration-300 ease-in-out">
                <div className="flex justify-end mb-2">
                  <button
                    onClick={() => setIsViewExpanded(false)}
                    className="text-red-600"
                  >
                    ✕
                  </button>
                </div>
                <PartialVechileView vehicleId={selectedVehicleId} />
              </div>
            )}
          </div>
        </div>
      </Layout>
    );
  };
  
  export default VehiclesList;
  