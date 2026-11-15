import { useMemo, useState } from "react";
import { departments } from "../data/departments";
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

const collator = new Intl.Collator("en", { numeric: true, sensitivity: "base" });

function searchText(value) {
  return value.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();
}

export function EmployeeTable({
  employees,
  lastCreatedEmployee = null,
  onLoadFictional,
}) {
  const [query, setQuery] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [sortKey, setSortKey] = useState("lastName");
  const [sortDirection, setSortDirection] = useState("ascending");
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [expandedIds, setExpandedIds] = useState(() => new Set());

  const availableDepartments = useMemo(() => {
    const known = new Set(departments);
    const extras = employees
      .map((employee) => employee.department)
      .filter((department) => department && !known.has(department));
    return [...departments, ...new Set(extras)];
  }, [employees]);

  const searchIndex = useMemo(
    () =>
      employees.map((employee) => ({
        employee,
        fields: [
          ...columns.flatMap(({ key, format }) => {
            const value = employee[key];
            return format
              ? [searchText(value), searchText(format(value))]
              : [searchText(value)];
          }),
          searchText(`${employee.firstName} ${employee.lastName}`),
        ],
      })),
    [employees],
  );

  const sortedEmployees = useMemo(() => {
    const normalizedQuery = searchText(query.trim());
    const departmentFiltered =
      departmentFilter === "all"
        ? searchIndex
        : searchIndex.filter(
            ({ employee }) => employee.department === departmentFilter,
          );
    const filteredEmployees = normalizedQuery
      ? departmentFiltered
          .filter(({ fields }) =>
            fields.some((field) => field.includes(normalizedQuery)),
          )
          .map(({ employee }) => employee)
      : departmentFiltered.map(({ employee }) => employee);

    return [...filteredEmployees].sort((firstEmployee, secondEmployee) => {
      const comparison = collator.compare(
        firstEmployee[sortKey],
        secondEmployee[sortKey],
      );
      return sortDirection === "ascending" ? comparison : -comparison;
    });
  }, [departmentFilter, query, searchIndex, sortDirection, sortKey]);

  if (employees.length === 0) {
    return (
      <section className="empty-state" aria-labelledby="empty-title">
        <span className="empty-icon" aria-hidden="true">
          +
        </span>
        <h2 id="empty-title">No employee records yet</h2>
        <p>Create the first employee or load fictional sample records to explore the directory.</p>
        <div className="empty-actions">
          <AppLink className="button button-primary" to="/">
            Create employee
          </AppLink>
          {onLoadFictional ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={onLoadFictional}
            >
              Load fictional records
            </button>
          ) : null}
        </div>
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

  const toggleDetails = (employeeId) => {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(employeeId)) {
        next.delete(employeeId);
      } else {
        next.add(employeeId);
      }
      return next;
    });
  };

  const hasRecentRecord =
    lastCreatedEmployee &&
    employees.some((employee) => employee.id === lastCreatedEmployee.id);

  const firstVisible = sortedEmployees.length === 0 ? 0 : startIndex + 1;
  const lastVisible = Math.min(startIndex + pageSize, sortedEmployees.length);

  return (
    <section className="table-card" aria-label="Employee records">
      {hasRecentRecord ? (
        <div className="created-record-banner">
          <div className="created-record-summary">
            <span className="created-pill">Just added</span>
            <span>
              <strong>
                {lastCreatedEmployee.firstName} {lastCreatedEmployee.lastName}
              </strong>{" "}
              · {lastCreatedEmployee.department} · Started{" "}
              <span className="tabular-value">
                {formatDate(lastCreatedEmployee.startDate)}
              </span>
            </span>
          </div>
          <button
            type="button"
            className="button button-secondary button-compact"
            onClick={() => {
              setDepartmentFilter("all");
              setQuery(
                `${lastCreatedEmployee.firstName} ${lastCreatedEmployee.lastName}`,
              );
              setPage(1);
            }}
          >
            Find in directory
          </button>
        </div>
      ) : null}

      <div className="table-toolbar">
        <div className="search-field">
          <label htmlFor="employee-search">Search employees</label>
          <div className="search-input-wrap">
            <input
              id="employee-search"
              type="search"
              value={query}
              placeholder="Name, department, city, MM/DD/YYYY..."
              onChange={(event) => {
                setQuery(event.target.value);
                setPage(1);
              }}
            />
            {query ? (
              <button
                type="button"
                className="search-clear-button"
                onClick={() => {
                  setQuery("");
                  setPage(1);
                }}
              >
                Clear
              </button>
            ) : null}
          </div>
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

      <div className="department-filter-bar" role="group" aria-label="Filter by department">
        <button
          type="button"
          className={departmentFilter === "all" ? "filter-pill is-active" : "filter-pill"}
          aria-pressed={departmentFilter === "all"}
          onClick={() => {
            setDepartmentFilter("all");
            setPage(1);
          }}
        >
          All ({employees.length})
        </button>
        {availableDepartments.map((department) => (
          <button
            key={department}
            type="button"
            className={
              departmentFilter === department ? "filter-pill is-active" : "filter-pill"
            }
            aria-pressed={departmentFilter === department}
            onClick={() => {
              setDepartmentFilter(department);
              setPage(1);
            }}
          >
            {department}
          </button>
        ))}
      </div>

      {sortedEmployees.length === 0 ? (
        <div className="no-results" role="status">
          <strong>No matching employees</strong>
          <span>Try a different name, department, state, city, or formatted date.</span>
          {query || departmentFilter !== "all" ? (
            <button
              type="button"
              className="button button-secondary button-compact"
              onClick={() => {
                setQuery("");
                setDepartmentFilter("all");
                setPage(1);
              }}
            >
              Reset filters
            </button>
          ) : null}
        </div>
      ) : (
        <>
          <div className="mobile-roster" aria-label="Employee quick-scan cards">
            <div className="mobile-sort-bar">
              <span>Quick scan (no horizontal scroll)</span>
              <div className="mobile-sort-pills">
                <button
                  type="button"
                  className={sortKey === "department" ? "sort-pill is-active" : "sort-pill"}
                  onClick={() => handleSort("department")}
                >
                  Dept{" "}
                  {sortKey === "department"
                    ? sortDirection === "ascending"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </button>
                <button
                  type="button"
                  className={sortKey === "startDate" ? "sort-pill is-active" : "sort-pill"}
                  onClick={() => handleSort("startDate")}
                >
                  Start{" "}
                  {sortKey === "startDate"
                    ? sortDirection === "ascending"
                      ? "↑"
                      : "↓"
                    : "↕"}
                </button>
              </div>
            </div>

            {visibleEmployees.map((employee) => {
              const isExpanded = expandedIds.has(employee.id);
              const isNew = lastCreatedEmployee?.id === employee.id;
              return (
                <article
                  key={employee.id}
                  className={
                    isNew
                      ? "mobile-employee-card is-new-card"
                      : "mobile-employee-card"
                  }
                >
                  <div className="mobile-card-top">
                    <div className="mobile-card-identity">
                      <div className="mobile-card-name-row">
                        <strong className="mobile-card-name">
                          {employee.firstName} {employee.lastName}
                        </strong>
                        {isNew ? <span className="new-pill">New</span> : null}
                      </div>
                      <div className="mobile-card-primary">
                        <span
                          className="department-badge"
                          data-department={employee.department}
                        >
                          {employee.department}
                        </span>
                        <span className="mobile-start-date">
                          Started{" "}
                          <strong className="tabular-value">
                            {formatDate(employee.startDate)}
                          </strong>
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mobile-details-toggle"
                      aria-expanded={isExpanded}
                      aria-label={`Details for ${employee.firstName} ${employee.lastName}`}
                      onClick={() => toggleDetails(employee.id)}
                    >
                      {isExpanded ? "Hide" : "Details"}
                    </button>
                  </div>

                  {isExpanded ? (
                    <dl className="mobile-employee-details">
                      <div>
                        <dt>Date of birth</dt>
                        <dd className="tabular-value">
                          {formatDate(employee.dateOfBirth)}
                        </dd>
                      </div>
                      <div>
                        <dt>City / State</dt>
                        <dd>
                          {employee.city}, {employee.state}
                        </dd>
                      </div>
                      <div className="mobile-detail-wide">
                        <dt>Street &amp; ZIP</dt>
                        <dd>
                          {employee.street} ·{" "}
                          <span className="tabular-value">{employee.zipCode}</span>
                        </dd>
                      </div>
                    </dl>
                  ) : null}
                </article>
              );
            })}
          </div>

          <div className="mobile-table-caption">
            <span>Full 9-column table (tab to focus &amp; arrow-scroll)</span>
          </div>

          <div
            className="table-scroll"
            tabIndex={0}
            role="region"
            aria-label="Scrollable employee table"
          >
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
                {visibleEmployees.map((employee) => {
                  const isNew = lastCreatedEmployee?.id === employee.id;
                  return (
                    <tr
                      key={employee.id}
                      className={isNew ? "is-new-row" : undefined}
                    >
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className={
                            column.key === "startDate" ||
                            column.key === "dateOfBirth" ||
                            column.key === "zipCode"
                              ? "tabular-value"
                              : undefined
                          }
                        >
                          {column.key === "department" ? (
                            <span
                              className="department-badge"
                              data-department={employee.department}
                            >
                              {employee.department}
                            </span>
                          ) : column.format ? (
                            column.format(employee[column.key])
                          ) : (
                            employee[column.key]
                          )}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <div className="table-footer">
        <p aria-live="polite" className="tabular-value">
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
          <span className="tabular-value">
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
