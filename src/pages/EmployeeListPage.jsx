import { EmployeeTable } from "../components/EmployeeTable";
import { AppLink } from "../router/Router";
import { useEmployees } from "../state/employeeStateContext";

export function EmployeeListPage() {
  const {
    employees,
    storageAvailable,
    lastCreatedEmployee,
    loadFictionalEmployees,
  } = useEmployees();

  return (
    <>
      <section className="page-heading list-heading">
        <div>
          <p className="eyebrow">Employee directory</p>
          <h1>Current employees</h1>
          <p className="page-intro">
            Search, sort, and review every WealthHealth employee record.
          </p>
        </div>
        <div className="list-heading-actions">
          <span className="record-count">
            <strong>{employees.length}</strong>
            {employees.length === 1 ? " employee" : " employees"}
          </span>
          {employees.length < 12 ? (
            <button
              type="button"
              className="button button-secondary"
              onClick={loadFictionalEmployees}
            >
              Load fictional records
            </button>
          ) : null}
          <AppLink className="button button-primary" to="/">
            Add employee
          </AppLink>
        </div>
      </section>

      {!storageAvailable ? (
        <p className="storage-alert" role="status">
          Browser storage is unavailable. New records last until you leave or reload the app.
        </p>
      ) : null}
      <EmployeeTable
        employees={employees}
        lastCreatedEmployee={lastCreatedEmployee}
        onLoadFictional={loadFictionalEmployees}
      />
    </>
  );
}
