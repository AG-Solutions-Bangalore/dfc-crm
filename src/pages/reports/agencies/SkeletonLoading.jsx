import Layout from "../../../layout/Layout";

const SkeletonLoading = () => {
  return (
    <Layout>
      <div className="bg-[#FFFFFF] p-2 rounded-lg animate-pulse">
        <div className="mb-4">
          {/* Header Skeleton */}
          <div className="sticky top-0 p-2 mb-4 border-b-2 border-red-500 rounded-lg bg-[#E1F5FA]">
            <div className="h-10 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-48 h-6 bg-gray-300 rounded"></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
                <div className="w-6 h-6 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
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
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Row 1 */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* //2 */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* //row */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
              {/* // */}
              <tr>
                {/* Agency Header with increased width */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "30%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Branch Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* RT KM Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* City Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* State Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "15%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
                {/* Mobile Header */}
                <th
                  className="p-1 border border-gray-300"
                  style={{ width: "8%" }}
                >
                  <div className="h-5 bg-gray-300 rounded"></div>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
};

export default SkeletonLoading;
