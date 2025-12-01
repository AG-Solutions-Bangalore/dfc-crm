import React, { useEffect, useMemo, useState } from "react";
import Layout from "../../layout/Layout";
import { IconEdit, IconPlus } from "@tabler/icons-react";
import { MantineReactTable, useMantineReactTable } from "mantine-react-table";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import BASE_URL from "../../base/BaseUrl";
import moment from "moment/moment";
import {
  TodoCreate,
  TodoEdit,
} from "../../components/buttonIndex/ButtonComponents";
import { CreateButton } from "../../components/common/ButtonColors";
import { encryptId } from "../../components/common/EncryptionDecryption";

const TodoList = () => {
  const [todoData, setTodoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTodoData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/api/web-fetch-todo`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTodoData(response.data?.todo);
    } catch (error) {
      console.error("Error fetching Todo data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodoData();
  }, []);

  const columns = useMemo(
    () => [
      {
        accessorKey: "todo_date",
        header: "Date",
        size: 150,
        Cell: ({ row }) => {
          const date = row.original.todo_date;
          return date ? moment(date).format("DD-MMM-YYYY") : "";
        },
      },
      {
        accessorKey: "todo_branch",
        header: "Branch",
        size: 150,
      },
      {
        accessorKey: "todo_description",
        header: "Description",
        size: 50,
      },
      {
        accessorKey: "todo_status",
        header: "Status",
        size: 50,
      },
      {
        accessorKey: "created_by",
        header: "Created By",
        size: 50,
      },
      {
        accessorKey: "updated_by",
        header: "Update By",
        size: 50,
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
              {/* <div
                onClick={() => navigate(`/edit-todo/${id}`)}
                className="flex items-center space-x-2"
                title="Edit"
              >
                <IconEdit className="h-5 w-5 text-blue-500 cursor-pointer" />
              </div> */}
              <TodoEdit
                // onClick={() => navigate(`/edit-todo/${id}`)}
                onClick={() => {
                  const encryptedId = encryptId(id);

                  navigate(`/edit-todo/${encodeURIComponent(encryptedId)}`);
                }}
                className="h-5 w-5 text-blue-500 cursor-pointer"
                title="Edit"
              ></TodoEdit>
            </div>
          );
        },
      },
    ],
    []
  );

  const table = useMantineReactTable({
    columns,
    data: todoData || [],
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
              Todo List
            </h1>

            <div className="flex gap-2">
              <TodoCreate
                className={CreateButton}
                onClick={() => navigate(`/createTodo`)}
              >
                <IconPlus className="w-4 h-4" /> Todo
              </TodoCreate>
            </div>
          </div>
        </div>

        <div className=" shadow-md">
          <MantineReactTable table={table} />
        </div>
      </div>
    </Layout>
  );
};

export default TodoList;
