import { AppShell } from "./components/AppShell";
import { CreateEmployeePage } from "./pages/CreateEmployeePage";
import { EmployeeListPage } from "./pages/EmployeeListPage";
import { RouterProvider } from "./router/Router";
import { useAppRouter } from "./router/routerContext";
import { EmployeeProvider } from "./state/EmployeeProvider";
function AppRoutes() {
  const { path } = useAppRouter();
  return path === "/employees" ? <EmployeeListPage /> : <CreateEmployeePage />;
}
export function AppContent({ initialPath }) {
  return (
    <RouterProvider initialPath={initialPath}>
      <EmployeeProvider>
        <AppShell>
          <AppRoutes />
        </AppShell>
      </EmployeeProvider>
    </RouterProvider>
  );
}
export function App() {
  return <AppContent />;
}
