import { AppLink } from "../router/Router";
export function AppShell({ children }) {
  return (
    <div className="app-shell">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>
      <header className="site-header">
        <AppLink className="brand" to="/">
          <span className="brand-mark" aria-hidden="true">
            WH
          </span>
          <span>
            <strong>HRnet</strong>
            <small>WealthHealth</small>
          </span>
        </AppLink>
        <nav aria-label="Primary navigation">
          <AppLink to="/" activeClassName="active">
            Create employee
          </AppLink>
          <AppLink to="/employees" activeClassName="active">
            Employee list
          </AppLink>
        </nav>
      </header>
      <main id="main-content">{children}</main>
      <footer className="site-footer">
        <span>HRnet</span>
        <span>React migration · 2026</span>
      </footer>
    </div>
  );
}
