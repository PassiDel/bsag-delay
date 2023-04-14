import { getBoxValues } from "~/utils/percent";

export default defineEventHandler(async (event) => {

  const data = [
    {
      stop_name: "Bremen Hauptbahnhof",
      avg: 22.3167789440701864,
      count: 19149,
      stop_lat: "53.081776000000",
      stop_lon: "8.813177000000"
    },
    {
      stop_name: "Bremen Domsheide",
      avg: -26.4986057319907049,
      count: 12910,
      stop_lat: "53.074432000000",
      stop_lon: "8.808980000000"
    },
    {
      stop_name: "Bremen Schüsselkorb",
      avg: 18.3798368542145995,
      count: 9562,
      stop_lat: "53.077171000000",
      stop_lon: "8.810675000000"
    },
    {
      stop_name: "Bremen Herdentor",
      avg: 17.7755144897102058,
      count: 9524,
      stop_lat: "53.079642000000",
      stop_lon: "8.810039000000"
    },
    {
      stop_name: "Bremen Gröpelingen",
      avg: -13.7928571428571429,
      count: 8540,
      stop_lat: "53.120334000000",
      stop_lon: "8.752945000000"
    },
    {
      stop_name: "Bremen Sebaldsbrück (Bus+Tram)",
      avg: -7.7429556533111402,
      count: 8411,
      stop_lat: "53.059469000000",
      stop_lon: "8.899647000000"
    },
    {
      stop_name: "Bremen Westerstraße",
      avg: 15.642278360343184,
      count: 8392,
      stop_lat: "53.074460000000",
      stop_lon: "8.794029000000"
    },
    {
      stop_name: "Bremen Wilhelm-Kaisen-Brücke",
      avg: 14.2751011881446664,
      count: 7659,
      stop_lat: "53.072125000000",
      stop_lon: "8.803444000000"
    },
    {
      stop_name: "Bremen Rembertistraße",
      avg: 13.51365354992298,
      count: 7141,
      stop_lat: "53.080648000000",
      stop_lon: "8.818683000000"
    }
  ]
  return {
    data,
    maxCount: data.reduce((acc, d) => d.count > acc ? d.count : acc, 0),
    boxValues: {
      avg: getBoxValues(data.map(d => d.avg)),
      count: getBoxValues(data.map(d => d.count))
    }
  }
})