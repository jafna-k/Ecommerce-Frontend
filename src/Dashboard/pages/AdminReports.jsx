
// import { useState } from "react";
// import api from "../../services/api";

// export default function AdminReports() {
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");
//   const [reportType, setReportType] = useState("sales");
//   const [reportData, setReportData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const fetchReport = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const response = await api.get("/admin/reports", {
//         params: {
//           fromDate,
//           toDate,
//           type: reportType,
//         },
//       });

//       setReportData(response.data.data || []);
//     } catch (err) {
//       setError(
//         err.response?.data?.message ||
//           "Report load cheyyan kazhinjilla. Backend API check cheyyuka."
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#faf7f0] p-6">
//       <div className="mb-6">
//         <h1 className="text-3xl font-bold text-[#123f32]">
//           Reports
//         </h1>
//         <p className="mt-2 text-gray-600">
//           Sales and order reports manage cheyyuka.
//         </p>
//       </div>

//       <div className="mb-6 rounded-xl bg-white p-5 shadow-sm">
//         <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               Report Type
//             </label>
//             <select
//               value={reportType}
//               onChange={(e) => setReportType(e.target.value)}
//               className="w-full rounded-lg border p-3"
//             >
//               <option value="sales">Sales Report</option>
//               <option value="orders">Orders Report</option>
//             </select>
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               From Date
//             </label>
//             <input
//               type="date"
//               value={fromDate}
//               onChange={(e) => setFromDate(e.target.value)}
//               className="w-full rounded-lg border p-3"
//             />
//           </div>

//           <div>
//             <label className="mb-2 block text-sm font-medium">
//               To Date
//             </label>
//             <input
//               type="date"
//               value={toDate}
//               onChange={(e) => setToDate(e.target.value)}
//               className="w-full rounded-lg border p-3"
//             />
//           </div>

//           <div className="flex items-end">
//             <button
//               onClick={fetchReport}
//               disabled={loading}
//               className="w-full rounded-lg bg-[#123f32] p-3 font-semibold text-white hover:bg-[#164d3d] disabled:opacity-50"
//             >
//               {loading ? "Loading..." : "Generate Report"}
//             </button>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-4 rounded-lg bg-red-50 p-4 text-red-700">
//           {error}
//         </div>
//       )}

//       <div className="overflow-x-auto rounded-xl bg-white p-5 shadow-sm">
//         <h2 className="mb-4 text-xl font-semibold text-[#123f32]">
//           {reportType === "sales" ? "Sales Report" : "Orders Report"}
//         </h2>

//         {!reportData.length && !loading && !error && (
//           <p className="py-8 text-center text-gray-500">
//             Date select cheyth Generate Report click cheyyuka.
//           </p>
//         )}

//         {reportData.length > 0 && (
//           <table className="w-full text-left text-sm">
//             <thead className="bg-[#f3f0e8]">
//               <tr>
//                 {Object.keys(reportData[0]).map((key) => (
//                   <th key={key} className="p-3 capitalize">
//                     {key.replace(/([A-Z])/g, " $1")}
//                   </th>
//                 ))}
//               </tr>
//             </thead>
//             <tbody>
//               {reportData.map((item, index) => (
//                 <tr key={item._id || index} className="border-b">
//                   {Object.keys(reportData[0]).map((key) => (
//                     <td key={key} className="p-3">
//                       {String(item[key] ?? "-")}
//                     </td>
//                   ))}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         )}
//       </div>
//     </div>
//   );
// }



import { useState } from "react";
import api from "../../services/api";

const formatLabel = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (char) => char.toUpperCase());

const formatValue = (value) => {
  if (value === null || value === undefined || value === "") return "-";

  if (typeof value === "object") {
    if (Array.isArray(value)) return value.map(formatValue).join(", ");
    return value.name || value._id || JSON.stringify(value);
  }

  return String(value);
};

const isMoneyKey = (key) =>
  /amount|sales|revenue|totalprice|totalamount|price/i.test(key);

const isStatusKey = (key) => /status/i.test(key);

export default function AdminReports() {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reportType, setReportType] = useState("sales");
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const fetchReport = async () => {
    setError("");
    setNotice("");

    if (fromDate && toDate && fromDate > toDate) {
      setError("From Date, To Date-nekkal munpu select cheyyuka.");
      return;
    }

    try {
      setLoading(true);

      const response = await api.get("/admin/reports", {
        params: {
          fromDate,
          toDate,
          type: reportType,
        },
      });

      const result = response.data?.data;
      const rows = Array.isArray(result)
        ? result
        : Array.isArray(result?.data)
          ? result.data
          : Array.isArray(result?.reports)
            ? result.reports
            : result && typeof result === "object"
              ? [result]
              : [];

      setReportData(rows);
      setHasGenerated(true);
      setNotice(
        rows.length
          ? `${rows.length} report record(s) loaded successfully.`
          : "Selected date range-il report records onnum illa."
      );
    } catch (err) {
      setReportData([]);
      setHasGenerated(false);
      setError(
        err.response?.data?.message ||
          "Report load cheyyan kazhinjilla. Backend API check cheyyuka."
      );
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!reportData.length) {
      setError("Download cheyyan report data illa.");
      return;
    }

    const keys = [...new Set(reportData.flatMap((item) => Object.keys(item)))];

    const escapeCSV = (value) =>
      `"${formatValue(value).replace(/"/g, '""')}"`;

    const csv = [
      keys.map(escapeCSV).join(","),
      ...reportData.map((item) =>
        keys.map((key) => escapeCSV(item[key])).join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `${reportType}-report-${fromDate || "all"}-to-${
      toDate || "all"
    }.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    setNotice("CSV report download started.");
  };

  const totalAmount = reportData.reduce((sum, item) => {
    return (
      sum +
      Object.entries(item).reduce((rowSum, [key, value]) => {
        if (!isMoneyKey(key)) return rowSum;

        const amount = Number(value);
        return rowSum + (Number.isFinite(amount) ? amount : 0);
      }, 0)
    );
  }, 0);

  const amountKeyExists = reportData.some((item) =>
    Object.keys(item).some(isMoneyKey)
  );

  const orderCount = reportData.reduce((sum, item) => {
    const countKey = Object.keys(item).find((key) =>
      /totalorders|ordercount|numberoforders/i.test(key)
    );

    return sum + (countKey ? Number(item[countKey]) || 0 : 0);
  }, 0);

  const statusCount = reportData.filter((item) =>
    Object.keys(item).some(
      (key) => isStatusKey(key) && /cancelled/i.test(String(item[key]))
    )
  ).length;

  return (
    <div className="min-h-screen bg-[#FAF7F0] px-4 py-6 text-[#24382E] sm:px-6 lg:px-8">
      {/* Side notification */}
      {(notice || error) && (
        <div
          role="status"
          className={`fixed right-4 top-5 z-50 flex max-w-sm items-start gap-3 rounded-2xl border p-4 shadow-2xl ${
            error
              ? "border-red-200 bg-white text-red-700"
              : "border-[#C8DCCB] bg-white text-[#123F32]"
          }`}
        >
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F0F5ED] text-lg">
            {error ? "!" : "✓"}
          </span>

          <div className="min-w-0 flex-1">
            <p className="font-bold">
              {error ? "Something went wrong" : "Report notification"}
            </p>
            <p className="mt-1 break-words text-sm text-gray-600">
              {error || notice}
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setNotice("");
              setError("");
            }}
            aria-label="Close notification"
            className="rounded-lg px-2 py-1 text-gray-500 hover:bg-gray-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page heading */}
      <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-[#718675]">
            <span>MODEZA</span>
            <span className="text-[#B5C6B6]">/</span>
            <span>Analytics</span>
          </div>

          <h1 className="text-3xl font-bold tracking-tight text-[#123F32] sm:text-4xl">
            Reports & Analytics
          </h1>

          <p className="mt-2 text-sm text-[#78877B] sm:text-base">
            Sales performance and order reports, all in one place.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-full border border-[#D9E3D7] bg-white px-4 py-2 text-sm font-medium text-[#315A43] shadow-sm">
          <span className="h-2 w-2 rounded-full bg-[#4C8A61]" />
          Admin Report Center
        </div>
      </div>

      {/* Summary cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="group rounded-2xl border border-[#E8E8DC] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#7B897D]">
                {reportType === "sales" ? "Reported Sales Value" : "Reported Amount"}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#123F32]">
                {hasGenerated && amountKeyExists
                  ? `₹${totalAmount.toLocaleString("en-IN", {
                      maximumFractionDigits: 2,
                    })}`
                  : "—"}
              </h2>
              <p className="mt-2 text-xs text-[#89958A]">
                Based on returned report fields
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF2E8] text-[#245B40]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <path d="M12 2v20M17 6H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </div>
          </div>
        </div>

        <div className="group rounded-2xl border border-[#E8E8DC] bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#7B897D]">
                {reportType === "sales" ? "Sales Records" : "Order Records"}
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#123F32]">
                {hasGenerated ? reportData.length : "—"}
              </h2>
              <p className="mt-2 text-xs text-[#89958A]">
                Records returned by the API
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F4EEE0] text-[#927440]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <path d="M4 5h16v15H4zM8 9h8M8 13h8M8 17h4" />
              </svg>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-[#E8E8DC] bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-[#7B897D]">
                Cancelled Records
              </p>
              <h2 className="mt-3 text-2xl font-bold text-[#123F32]">
                {hasGenerated ? statusCount : "—"}
              </h2>
              <p className="mt-2 text-xs text-[#89958A]">
                Based on returned status fields
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F9ECE7] text-[#A85E48]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-6 w-6"
              >
                <circle cx="12" cy="12" r="9" />
                <path d="m9 9 6 6m0-6-6 6" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <section className="mb-6 overflow-hidden rounded-2xl border border-[#E5E8DD] bg-white shadow-sm">
        <div className="border-b border-[#EDF0E8] px-5 py-5 sm:px-6">
          <h2 className="text-lg font-bold text-[#123F32]">
            Generate a report
          </h2>
          <p className="mt-1 text-sm text-[#89958A]">
            Choose a report type and date range to view your data.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-5 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
          <div>
            <label
              htmlFor="reportType"
              className="mb-2 block text-sm font-semibold text-[#405448]"
            >
              Report Type
            </label>
            <select
              id="reportType"
              value={reportType}
              onChange={(e) => {
                setReportType(e.target.value);
                setReportData([]);
                setHasGenerated(false);
                setError("");
                setNotice("");
              }}
              className="w-full rounded-xl border border-[#DCE4D8] bg-[#FEFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#47765B] focus:ring-4 focus:ring-[#47765B]/10"
            >
              <option value="sales">Sales Report</option>
              <option value="orders">Orders Report</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="fromDate"
              className="mb-2 block text-sm font-semibold text-[#405448]"
            >
              From Date
            </label>
            <input
              id="fromDate"
              type="date"
              value={fromDate}
              max={toDate || undefined}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full rounded-xl border border-[#DCE4D8] bg-[#FEFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#47765B] focus:ring-4 focus:ring-[#47765B]/10"
            />
          </div>

          <div>
            <label
              htmlFor="toDate"
              className="mb-2 block text-sm font-semibold text-[#405448]"
            >
              To Date
            </label>
            <input
              id="toDate"
              type="date"
              value={toDate}
              min={fromDate || undefined}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full rounded-xl border border-[#DCE4D8] bg-[#FEFDF9] px-4 py-3 text-sm outline-none transition focus:border-[#47765B] focus:ring-4 focus:ring-[#47765B]/10"
            />
          </div>

          <div className="flex items-end">
            <button
              type="button"
              onClick={fetchReport}
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#123F32] px-5 py-3 font-semibold text-white shadow-sm transition hover:bg-[#1B5141] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Generating...
                </>
              ) : (
                <>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-5 w-5"
                  >
                    <path d="M4 19V5m0 14h16M8 15l4-4 3 3 5-7" />
                  </svg>
                  Generate Report
                </>
              )}
            </button>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="overflow-hidden rounded-2xl border border-[#E5E8DD] bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b border-[#EDF0E8] px-5 py-5 sm:flex-row sm:items-center sm:px-6">
          <div>
            <h2 className="text-lg font-bold text-[#123F32]">
              {reportType === "sales" ? "Sales Report" : "Orders Report"}
            </h2>
            <p className="mt-1 text-sm text-[#89958A]">
              {hasGenerated
                ? `${reportData.length} record(s) found`
                : "Generate a report to view your records"}
              {fromDate || toDate
                ? ` · ${fromDate || "Start"} to ${toDate || "Today"}`
                : ""}
            </p>
          </div>

          <button
            type="button"
            onClick={downloadCSV}
            disabled={!reportData.length || loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C8D9C9] bg-[#F7FAF4] px-4 py-2.5 text-sm font-semibold text-[#24553B] transition hover:bg-[#EAF2E8] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              className="h-5 w-5"
            >
              <path d="M12 3v12m-5-5 5 5 5-5M4 17v4h16v-4" />
            </svg>
            Export CSV
          </button>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#DCE7DA] border-t-[#123F32]" />
            <p className="mt-4 text-sm font-medium text-[#617366]">
              Preparing your report...
            </p>
          </div>
        ) : reportData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[650px] text-left text-sm">
              <thead className="bg-[#F5F4EB] text-xs uppercase tracking-wider text-[#657669]">
                <tr>
                  {[
                    ...new Set(
                      reportData.flatMap((item) => Object.keys(item))
                    ),
                  ].map((key) => (
                    <th key={key} className="whitespace-nowrap px-5 py-4 font-bold">
                      {formatLabel(key)}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#EDF0E8]">
                {reportData.map((item, index) => {
                  const keys = [
                    ...new Set(
                      reportData.flatMap((row) => Object.keys(row))
                    ),
                  ];

                  return (
                    <tr
                      key={item._id || index}
                      className="transition hover:bg-[#FAFBF6]"
                    >
                      {keys.map((key) => {
                        const value = item[key];

                        return (
                          <td
                            key={key}
                            className="whitespace-nowrap px-5 py-4 text-[#46584B]"
                          >
                            {isStatusKey(key) ? (
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  /cancel/i.test(String(value))
                                    ? "bg-red-50 text-red-700"
                                    : /deliver|confirm|active|paid|complete/i.test(
                                          String(value)
                                        )
                                      ? "bg-green-50 text-green-700"
                                      : /pending|process|pack|ship/i.test(
                                            String(value)
                                          )
                                        ? "bg-amber-50 text-amber-700"
                                        : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {formatValue(value)}
                              </span>
                            ) : (
                              <span
                                className={
                                  isMoneyKey(key)
                                    ? "font-semibold text-[#123F32]"
                                    : ""
                                }
                              >
                                {isMoneyKey(key) &&
                                Number.isFinite(Number(value)) &&
                                value !== null &&
                                value !== ""
                                  ? `₹${Number(value).toLocaleString("en-IN", {
                                      maximumFractionDigits: 2,
                                    })}`
                                  : formatValue(value)}
                              </span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#EDF3E9] text-[#315F43]">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
                className="h-8 w-8"
              >
                <path d="M5 3h10l4 4v14H5zM14 3v5h5M8 13h8M8 17h8" />
              </svg>
            </div>

            <h3 className="mt-5 text-base font-bold text-[#123F32]">
              {hasGenerated ? "No records found" : "Your report is ready to generate"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-[#89958A]">
              {hasGenerated
                ? "Try another date range or select a different report type."
                : "Select your report type and date range, then click Generate Report to see the results here."}
            </p>
          </div>
        )}

        <div className="flex flex-col justify-between gap-2 border-t border-[#EDF0E8] bg-[#FEFDF9] px-5 py-4 text-xs text-[#89958A] sm:flex-row sm:items-center sm:px-6">
          <span>MODEZA · Admin Analytics</span>
          <span>Data shown is based on your backend API response.</span>
        </div>
      </section>
    </div>
  );
}
