import React, { useMemo } from "react";

export const InventoryReport = React.forwardRef(
  ({ users, sweets, options }, ref) => {
    const printStyles = `
  @page {
    size: A4;
    margin: 15mm; /* Reduced slightly for more space */
  }

  @media print {
    body {
      -webkit-print-color-adjust: exact;
    }
    
    /* Remove browser-added headers/footers (optional) */
    @page { margin: 15mm; }

    section {
      page-break-inside: auto; /* Allow sections to break if long */
      margin-bottom: 1.5rem;
    }

    table {
      page-break-inside: auto;
      width: 100%;
      border-spacing: 0;
      border-collapse: collapse;
    }

    tr {
      page-break-inside: avoid; /* Keeps a single row together */
    }

    thead {
      display: table-header-group;
    }

    /* Prevent large gaps at the top of pages */
    h2 {
      padding-top: 0;
      margin-top: 0;
    }
  }
`;
    const stats = useMemo(() => {
      let totalRevenue = 0;
      let totalQty = 0;

      users.forEach((user) => {
        user.payments?.forEach((payment) => {
          totalRevenue += payment.amount || 0;
          payment.items?.forEach((item) => {
            totalQty += item.quantity || 0;
          });
        });
      });
      return { totalQty, totalRevenue };
    }, [users]);
    return (
      <div ref={ref} className="p-10 bg-white text-black min-h-screen">
        {/* PDF Header */}
        <style>{printStyles}</style>
        <div className="flex justify-between items-center border-b-2 border-gray-900 pb-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold uppercase tracking-tighter italic">
              Sweet Shop Master Report
            </h1>
            <p className="text-gray-500 text-xs">
              System Date: {new Date().toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <div className="font-bold text-sm uppercase">
              Internal Audit Document
            </div>
            <div className="text-[10px] text-gray-400">
              Reference: SSMS-{Math.floor(Math.random() * 10000)}
            </div>
          </div>
        </div>

        {/* SECTION 1: SWEET INVENTORY */}
        {options.includeSweets && (
          <section className="mb-12 print:break-after-page">
            <div className="bg-amber-50 p-2 mb-4 border-l-4 border-amber-600">
              <h2 className="text-sm font-bold uppercase text-amber-900">
                Product Inventory Status
              </h2>
            </div>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-[10px] uppercase">
                  <th className="border border-gray-300 p-2 text-left">
                    Sweet Name
                  </th>
                  <th className="border border-gray-300 p-2 text-center">
                    Stock Level
                  </th>
                  <th className="border border-gray-300 p-2 text-right">
                    Unit Price
                  </th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(sweets) && sweets.length > 0 ? (
                  sweets.map((s) => (
                    <tr key={s._id} className="text-xs">
                      <td className="border border-gray-300 p-2 font-medium">
                        {s.name}
                      </td>
                      <td
                        className={`border border-gray-300 p-2 text-center ${
                          s.quantityInStock < 10 ? "text-red-600 font-bold" : ""
                        }`}
                      >
                        {s.quantityInStock} kg
                      </td>
                      <td className="border border-gray-300 p-2 text-right">
                        ₹{s.price}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="p-4 text-center text-gray-400 italic"
                    >
                      No items to display in report.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </section>
        )}

        {/* SECTION 2: USER PURCHASES (The Requested Breakdown) */}
        {options.includeUsers && (
          <section className="print:break-before-page">
            <div className="bg-blue-50 p-2 mb-4 border-l-4 border-blue-600">
              <h2 className="text-sm font-bold uppercase text-blue-900">
                Customer Purchase Breakdown
              </h2>
            </div>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100 text-[10px] uppercase text-gray-700">
                  <th className="border border-gray-300 p-2 text-left w-1/4">
                    Customer
                  </th>
                  <th className="border border-gray-300 p-2 text-left">
                    Purchase History (Item x Qty)
                  </th>
                  <th className="border border-gray-300 p-2 text-right w-1/6">
                    Total Contribution
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => {
                  // Calculate individual user total spend
                  const totalSpent =
                    u.payments?.reduce((sum, p) => sum + (p.amount || 0), 0) ||
                    0;

                  return (
                    <tr
                      key={u._id}
                      className="text-[11px] border-b border-gray-200"
                    >
                      <td className="border border-gray-300 p-2 align-top">
                        <div className="font-bold text-gray-900">
                          {u.username}
                        </div>
                        <div className="text-gray-500 italic">{u.email}</div>
                        <div className="mt-1 font-mono text-[9px] text-gray-400">
                          UID: {u._id.slice(-6)}
                        </div>
                      </td>
                      <td className="border border-gray-300 p-1 align-top">
                        {u.payments && u.payments.length > 0 ? (
                          <div className="space-y-2">
                            {u.payments.map((payment, pIndex) => (
                              <div
                                key={payment._id || pIndex}
                                className="pb-1 border-b border-gray-100 last:border-0"
                              >
                                <span className="font-bold text-[9px] text-blue-700">
                                  ORDER #{pIndex + 1}:
                                </span>
                                <div className="grid grid-cols-1 gap-0.5 mt-1">
                                  {payment.items && payment.items.length > 0 ? (
                                    payment.items.map((item, iIndex) => (
                                      <div
                                        key={iIndex}
                                        className="flex justify-between pl-2"
                                      >
                                        <span>
                                          •{" "}
                                          {item.sweet?.name || "Unknown Sweet"}
                                        </span>
                                        <span className="font-mono bg-gray-50 px-1">
                                          {item.quantity} qty
                                        </span>
                                      </div>
                                    ))
                                  ) : (
                                    <span className="pl-2 text-gray-400 italic">
                                      No items listed
                                    </span>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-gray-400 italic">
                            No purchase history found
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-300 p-2 text-right align-top font-bold text-gray-800">
                        ₹{totalSpent.toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                {/* FOOTER TOTALS ROW */}
                <tr className="bg-gray-900 text-white font-bold uppercase text-xs">
                  <td colSpan="2" className="p-3 text-right">
                    Final Business Totals:
                  </td>
                  <td className="p-3 text-right">
                    ₹{stats.totalRevenue.toLocaleString()}
                  </td>
                </tr>
              </tbody>
            </table>
          </section>
        )}

        <div className="mt-12 text-[9px] text-gray-400 border-t pt-4 text-center">
          This is an automated report generated by the Sweet Shop Management
          System. Total Records Processed: {users.length} Users, {sweets.length}{" "}
          Inventory Items.
        </div>
      </div>
    );
  }
);
