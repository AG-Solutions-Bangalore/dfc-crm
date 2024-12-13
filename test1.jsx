
<div className="grid grid-cols-1  md:grid-cols-1 lg:grid-cols-5   gap-6">
{vehicles.vehicle_type != "Other" && (
<>
  {/* Front Left Tyre */}
  <div className="col-span-full grid grid-cols-3 gap-4">
    <div>
      <label className="block text-sm font-medium text-gray-700">1. Front Left Tyre</label>
      <Select
        name="tyre_assign_1_front_left_no"
        options={tyre.map((option) => ({
          value: option.tyre_sub_no,
          label: option.tyre_sub_no,
          name: "tyre_assign_1_front_left_no",
        }))}
        onChange={(e) => onInputChange(e)}
        value={vehicles.tyre_assign_1_front_left_no ? {
          value: vehicles.tyre_assign_1_front_left_no,
          label: vehicles.tyre_assign_1_front_left_no
        } : null}
        placeholder="Select Tyre"
        styles={customStyles}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">Date</label>
      <input
        type="date"
        name="tyre_assign_1_front_left_date"
        value={vehicles.tyre_assign_1_front_left_date}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
    <div>
      <label className="block text-sm font-medium text-gray-700">KM</label>
      <input
        type="number"
        name="tyre_assign_1_front_left_km"
        value={vehicles.tyre_assign_1_front_left_km}
        onChange={(e) => onInputChange(e)}
        className={inputClass}
      />
    </div>
  </div>

  {/* Add similar blocks for other tyres based on vehicle type */}
</>
)}
</div>









// if the add tyre of vechile si snot working than use this 