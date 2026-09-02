import { useMemo, useState } from "react";
import { AppLink } from "../router/Router";
import { formatDate } from "../utils/date";
const columns = [
  { key: "firstName", label: "First name" },
  { key: "lastName", label: "Last name" },
  { key: "startDate", label: "Start date", format: formatDate },
  { key: "department", label: "Department" },
  { key: "dateOfBirth", label: "Date of birth", format: formatDate },
  { key: "street", label: "Street" },
  { key: "city", label: "City" },
  { key: "state", label: "State" },
  { key: "zipCode", label: "ZIP code" },
];
export function EmployeeTable({ employees }) {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("ascending");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const sortedEmployees = useMemo(() => {
    const normalizedQuery = query.trim().toLocaleLowerCase();
    const filteredEmployees = normalizedQuery
      ? employees.filter((employee) =>
          columns.some((column) =>
            employee[column.key].toLocaleLowerCase().includes(normalizedQuery),
          ),
        )
      : employees;
    return [...filteredEmployees].sort((firstEmployee, secondEmployee) => {
      const comparison = firstEmployee[sortKey].localeCompare(
        secondEmployee[sortKey],
        undefined,
        { numeric: true, sensitivity: "base" },
      );
      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [employees, query, sortDirection, sortKey]);
  if (employees.length === 0) {
    return (
      <section className="empty-state" aria-labelledby="empty-title">
        <span className="empty-icon" aria-hidden="true">
          +
        </span>
        <h2 id="empty-title">No employee records yet</h2>
        <p>Create the first employee to populate this list.</p>
        <AppLink className="button button-primary" to="/">
          Create employee
        </AppLink>
      </section>
    );
  }
  const totalPages = Math.max(1, Math.ceil(sortedEmployees.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const visibleEmployees = sortedEmployees.slice(
    startIndex,
    startIndex + pageSize,
  );
  const handleSort = (key) => {
    if (key === sortKey) {
      setSortDirection((currentDirection) =>
        currentDirection === "ascending" ? "descending" : "ascending",
      );
    } else {
      setSortKey(key);
      setSortDirection("ascending");
    }
    setPage(1);
  };
  const firstVisible = sortedEmployees.length === 0 ? 0 : startIndex + 1;
  const lastVisible = Math.min(startIndex + pageSize, sortedEmployees.length);
  return (
    <section className="table-card" aria-label="Employee records">
      <div className="table-toolbar">
        <div className="search-field">
          <label htmlFor="employee-search">Search employees</label>
          <input
            id="employee-search"
            type="search"
            value={query}
            placeholder="Name, department, city..."
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="page-size-field">
          <label htmlFor="page-size">Rows per page</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(event) => {
              setPageSize(Number(event.target.value));
              setPage(1);
            }}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="25">25</option>
          </select>
        </div>
      </div>

      {sortedEmployees.length === 0 ? (
        <div className="no-results" role="status">
          <strong>No matching employees</strong>
          <span>Try a different name, department, state, or city.</span>
        </div>
      ) : (
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    scope="col"
                    aria-sort={
                      sortKey === column.key ? sortDirection : undefined
                    }
                  >
                    <button
                      type="button"
                      onClick={() => handleSort(column.key)}
                    >
                      {column.label}
                      <span className="sort-indicator" aria-hidden="true">
                        {sortKey === column.key
                          ? sortDirection === "ascending"
                            ? "↑"
                            : "↓"
                          : "↕"}
                      </span>
                    </button>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visibleEmployees.map((employee) => (
                <tr key={employee.id}>
                  {columns.map((column) => (
                    <td key={column.key}>
                      {column.format
                        ? column.format(employee[column.key])
                        : employee[column.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="table-footer">
        <p aria-live="polite">
          Showing {firstVisible}–{lastVisible} of {sortedEmployees.length}
        </p>
        <div className="pagination" aria-label="Employee table pagination">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            type="button"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </section>
  );
}
