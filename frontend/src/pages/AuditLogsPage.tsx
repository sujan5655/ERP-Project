import { useState } from "react";

import { useGetAuditLogsQuery } from "../features/auditLogs/auditLogsApi";

import type { AuditAction, AuditLog } from "../features/auditLogs/types";

const actionOptions: AuditAction[] = [
  "CREATE",
  "UPDATE",
  "DELETE",
  "LOGIN",
  "LOGOUT",
  "OTHER",
];

function formatDate(date: string) {
  return new Date(date).toLocaleString();
}

function getActionClass(action: AuditAction) {
  switch (action) {
    case "CREATE":
      return "bg-green-100 text-green-700";

    case "UPDATE":
      return "bg-blue-100 text-blue-700";

    case "DELETE":
      return "bg-red-100 text-red-700";

    case "LOGIN":
      return "bg-purple-100 text-purple-700";

    case "LOGOUT":
      return "bg-gray-100 text-gray-700";

    default:
      return "bg-yellow-100 text-yellow-700";
  }
}

function StatusBadge({ action }: { action: AuditAction }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${getActionClass(
        action,
      )}`}
    >
      {action}
    </span>
  );
}

function ValuesCell({ values }: { values: Record<string, unknown> | null }) {
  if (!values) {
    return <span className="text-gray-400">—</span>;
  }

  return (
    <pre className="max-w-xs overflow-auto rounded bg-gray-50 p-2 text-xs text-gray-700">
      {JSON.stringify(values, null, 2)}
    </pre>
  );
}

export default function AuditLogsPage() {
  const [action, setAction] = useState<AuditAction | "">("");

  const [modelName, setModelName] = useState("");

  const [search, setSearch] = useState("");

  const [appliedSearch, setAppliedSearch] = useState("");

  const [appliedModelName, setAppliedModelName] = useState("");

  const [appliedAction, setAppliedAction] = useState<AuditAction | "">("");

  const { data, isLoading, isFetching, isError, refetch } =
    useGetAuditLogsQuery({
      action: appliedAction || undefined,
      model_name: appliedModelName || undefined,
      search: appliedSearch || undefined,
    });

  const logs: AuditLog[] = data?.logs ?? [];

  const handleFilter = () => {
    setAppliedAction(action);
    setAppliedModelName(modelName);
    setAppliedSearch(search);
  };

  const handleClear = () => {
    setAction("");
    setModelName("");
    setSearch("");

    setAppliedAction("");
    setAppliedModelName("");
    setAppliedSearch("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}

      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>

          <p className="mt-1 text-sm text-gray-500">
            Track important activities performed in the ERP.
          </p>
        </div>

        <button
          onClick={() => refetch()}
          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Refresh
        </button>
      </div>

      {/* Filters */}

      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Action */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Action
            </label>

            <select
              value={action}
              onChange={(event) =>
                setAction(event.target.value as AuditAction | "")
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All Actions</option>

              {actionOptions.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          {/* Model */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Model
            </label>

            <input
              type="text"
              value={modelName}
              onChange={(event) => setModelName(event.target.value)}
              placeholder="Product, Company..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Search */}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search description..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Buttons */}

          <div className="flex items-end gap-2">
            <button
              onClick={handleFilter}
              className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Filter
            </button>

            <button
              onClick={handleClear}
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Total Logs</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">
            {data?.count ?? 0}
          </p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Current Results</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{logs.length}</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500">Status</p>

          <p className="mt-2 text-sm font-semibold text-gray-700">
            {isFetching ? "Refreshing..." : "Up to date"}
          </p>
        </div>
      </div>

      {/* Loading */}

      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
          <p className="text-gray-500">Loading audit logs...</p>
        </div>
      )}

      {/* Error */}

      {isError && !isLoading && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-semibold text-red-700">
            Failed to load audit logs.
          </p>

          <p className="mt-1 text-sm text-red-600">
            Your session may have expired.
          </p>

          <button
            onClick={() => refetch()}
            className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      )}

      {/* Table */}

      {!isLoading && !isError && (
        <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-[1200px] w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Date
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    User
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Action
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Model
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Object
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Description
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    Old Values
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    New Values
                  </th>

                  <th className="px-4 py-3 text-xs font-semibold uppercase text-gray-500">
                    IP Address
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {logs.length === 0 ? (
                  <tr>
                    <td
                      colSpan={9}
                      className="px-4 py-12 text-center text-sm text-gray-500"
                    >
                      No audit logs found.
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                        {formatDate(log.created_at)}
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {log.user_email ?? "System"}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge action={log.action} />
                      </td>

                      <td className="px-4 py-4 text-sm font-medium text-gray-900">
                        {log.model_name}
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.object_id || "—"}
                      </td>

                      <td className="max-w-xs px-4 py-4 text-sm text-gray-600">
                        {log.description}
                      </td>

                      <td className="px-4 py-4">
                        <ValuesCell values={log.old_values} />
                      </td>

                      <td className="px-4 py-4">
                        <ValuesCell values={log.new_values} />
                      </td>

                      <td className="px-4 py-4 text-sm text-gray-600">
                        {log.ip_address ?? "—"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
