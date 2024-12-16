import Layout from "../../../layout/Layout";

const SkeletonLoading = () => {
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg animate-pulse">
        <div className="mb-4">
          {/* Header Skeleton */}
          <div className="h-14 bg-gray-200 rounded mb-3"></div>
          <div
            style={{ width: "20%" }}
            className="flex justify-center items-center h-6 bg-gray-300 rounded my-3 mx-[38%]"
          >
            <div className="h-10 bg-gray-300 rounded"></div>
          </div>

          {/* Table Skeleton */}
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-300 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* //2 */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* //row */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* // */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* // */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* // */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* // */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* // */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
              {/* // */}
              <tr className="border border-gray-300">
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
                <td
                  className="p-2 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-10 bg-gray-200 rounded"></div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SkeletonLoading;
