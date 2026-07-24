import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import NaconLogo from "../assets/Nacon.jpg";

export default function OverviewShipmentComponent() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    async function fetchShipments() {
      try {
        const res = await axios.get(
          "https://nacon-v0.onrender.com/api/shipments",
        );
        setShipments(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching shipments:", err);
        setError("Failed to load shipments.");
        setLoading(false);
      }
    }

    fetchShipments();
  }, []);

  const filteredShipments = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) return shipments;

    return shipments.filter((shipment) => {
      const containers = Array.isArray(shipment.containerNo)
        ? shipment.containerNo
        : shipment.containerNo
          ? [shipment.containerNo]
          : [];

      return containers.some((no) =>
        String(no ?? "")
          .toLowerCase()
          .includes(term),
      );
    });
  }, [shipments, searchTerm]);

  return (
    <div className="py-6 h-full rounded-xl flex flex-col">
      <div className=" flex items-center justify-between mb-8">
        <div className="static flex gap-6 items-center">
          <img src={NaconLogo} alt="" className="size-20" />
          <h2 className="text-5xl uppercase font-bold my-8 text-[var(--Secondary)]">
            Incoming Shipments View.
          </h2>
        </div>
        <div className="mb-6 mt-2">
          <input
            type="text"
            placeholder="Search by Container No."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full min-w-[40rem] px-4 py-2 border border-[var(--Primary)] rounded-md shadow-sm text-[var(--Primary)]"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-xl text-[var(--Secondary)] font-semibold my-10 text-center">
          Loading shipments...
        </div>
      ) : error ? (
        <div className="text-red-600 text-lg my-6 text-center">{error}</div>
      ) : (
        <div className="rounded-lg border border-[var(--Primary)] max-h-full overflow-y-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-[var(--Primary)] text-[var(--Accent)] uppercase tracking-wider text-center text-lg font-semibold sticky top-0 z-10">
              <tr className="grid grid-cols-8 min-w-full pt-1 items-center">
                <th className="px-4 py-3">Container No.</th>
                <th className="px-4 py-3">Importer</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">ETA</th>
                <th className="px-4 py-3">Shipping Line</th>
                <th className="px-4 py-3">Vessel</th>
                <th className="px-4 py-3">Port of Discharge</th>
                <th className="px-4 py-3">Cosignee Name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--Primary)]">
              {filteredShipments.map((shipment, index) => (
                <tr
                  key={
                    shipment.id ??
                    shipment._id ??
                    `${Array.isArray(shipment.containerNo) ? shipment.containerNo.join("-") : shipment.containerNo || "no-container"}-${index}`
                  }
                  className="grid grid-cols-8 min-w-full items-center text-center text-[var(--Primary)] text-md font-bold hover:bg-[var(--Secondary)] hover:opacity-90 hover:text-[var(--Accent)] transition duration-75"
                >
                  <td className="px-4 py-3 underline align-top">
                    <code className="bg-[var(--NavBackgroundTwo)] p-2 rounded-md whitespace-pre-line block">
                      {Array.isArray(shipment.containerNo) &&
                      shipment.containerNo.length > 0
                        ? shipment.containerNo.map((num, i) => (
                            <div key={i}>{num}</div>
                          ))
                        : "-"}
                    </code>
                  </td>
                  <td className="px-4 py-3">{shipment.importer || "-"}</td>
                  <td className="px-4 py-3">{shipment.status || "-"}</td>
                  <td className="px-4 py-3">{shipment.eta || "-"}</td>
                  <td className="px-4 py-3">
                    {shipment.shippingLine?.replace(/_/, " ") || "-"}
                  </td>
                  <td className="px-4 py-3">{shipment.vessel || "-"}</td>
                  <td className="px-4 py-3">
                    {shipment.portOfDischarge || "-"}
                  </td>
                  <td className="px-4 py-3">{shipment.cosigneeName || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}