import type { Tool } from "../utils/interfaces";



export const getStatusStyles = (status: Tool["status"]) => {
  switch (status) {
    case "active":
      return "bg-gradient-to-br from-green-500 to-emerald-800 text-white shadow-emerald-500/20";
    case "expiring":
      return "bg-gradient-to-br from-orange-400 to-red-800 text-white shadow-orange-500/20";
    case "unused":
      return "bg-gradient-to-br from-red-500 to-red-800 text-white shadow-orange-500/20";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400";
  }
};