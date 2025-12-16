import moment from "moment";

export const SERVICE_RULES = {
  "ENGINE OIL CHANGE": [
    { color: "red", kmMin: 60000, monthsMax: 14 },
    { color: "orange", kmMin: 55000, kmMax: 60000, monthsMax: 12 },
  ],

  "GEAR OIL CHANGE": [
    { color: "red", kmMin: 140000, monthsMin: 36 },
    { color: "orange", kmMin: 130000, kmMax: 140000, monthsMax: 30 },
  ],

  "CROWN OIL CHANGE": [
    { color: "red", kmMin: 140000, monthsMin: 36 },
    { color: "orange", kmMin: 130000, kmMax: 140000, monthsMax: 30 },
  ],

  "FRONT HUB GREASE": [
    { color: "red", kmMin: 70000, monthsMax: 14 },
    { color: "orange", kmMin: 60000, kmMax: 70000, monthsMax: 12 },
  ],

  "BACK HUB GREASE": [
    { color: "red", kmMin: 70000, monthsMax: 14 },
    { color: "orange", kmMin: 60000, kmMax: 70000, monthsMax: 12 },
  ],

  PUMP: [{ color: "red", monthsMin: 36 }],
  BATTERY: [{ color: "red", monthsMin: 36 }],
};

export const getServiceColor = (serviceType, serviceItem, vehicle) => {
  const rules = SERVICE_RULES[serviceType];
  if (!rules || !serviceItem || !vehicle) return "gray";

  const vehicleKm =
    Number(vehicle.vehicle_present_km) - Number(serviceItem.service_sub_km);

  const monthsRun = moment(vehicle.vehicle_present_date).diff(
    moment(serviceItem.service_sub_date),
    "months"
  );

  for (const rule of rules) {
    const kmMatch =
      rule.kmMin != null &&
      vehicleKm >= rule.kmMin &&
      (rule.kmMax == null || vehicleKm <= rule.kmMax);

    const monthMatch =
      rule.monthsMin != null &&
      monthsRun >= rule.monthsMin &&
      (rule.monthsMax == null || monthsRun <= rule.monthsMax);

    // ✅ OR condition
    if (kmMatch || monthMatch) {
      return rule.color;
    }
  }

  return "gray";
};

export const SERVICE_COLOR_CLASSES = {
  red: "bg-red-200 text-red-900 border-red-400",
  orange: "bg-orange-200 text-orange-900 border-orange-400",
  gray: "bg-gray-200 text-gray-700 border-gray-300",
};
