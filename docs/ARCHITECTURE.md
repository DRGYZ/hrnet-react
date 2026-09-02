# Architecture decisions

## React-only boundary

The production dependency graph and generated bundle must contain no jQuery.
The original date picker, select menu, modal, and DataTables integrations are
not wrapped or bridged; each one is replaced at the React component boundary.

## State management

Employee records are held by `EmployeeProvider`, which owns a reducer. Pages
consume a small context API rather than reading or writing browser storage.
Persistence is implemented separately by `employeeStorage.js`, keeping UI and
storage responsibilities independent and testable.

## Converted plugin

`@drgyz/hrnet-accessible-modal` is the one jQuery plugin converted into a
standalone React library. It is published on GitHub Packages. HRnet consumes
the same version through its immutable public Git tag so evaluators can run a
fresh install without configuring a GitHub Packages token; the component source
is never copied into the application.

## Remaining plugin replacements

- DateTimePicker becomes a reusable React wrapper around the browser's native
  date control. It avoids a large calendar dependency while retaining keyboard
  and platform accessibility.
- jQuery UI Selectmenu becomes a reusable labelled native select component.
  Native ordering is deterministic and does not recreate hidden DOM widgets.
- DataTables becomes an application-focused React table. Search, sort,
  pagination, and page-size behavior are derived with memoized calculations;
  React updates only the rows represented by current state.

## Routing

A small router built on the browser History API provides stable URLs for
`/` and `/employees`. It matches HRnet's two original pages without adding a
general-purpose routing dependency to this deliberately small application.

## Functional programming

All components are functions. Reducers and derived table calculations are pure,
and side effects are restricted to storage synchronization and modal focus
management.
