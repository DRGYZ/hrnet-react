# HRnet React

HRnet is WealthHealth's employee records application, migrated from a legacy
jQuery implementation to a fully functional React JavaScript application.

## Project goals

- Replace both legacy HRnet pages with React routes.
- Remove all runtime jQuery code and jQuery plugins.
- Manage employee records with React Context and a reducer.
- Keep browser persistence behind a dedicated local-storage adapter.
- Consume the independently packaged React modal converted from `jquery-modal`.
- Replace DateTimePicker and Selectmenu with accessible native React controls.
- Replace DataTables with a focused React table implementation.
- Compare production performance with the untouched legacy application.

## Features

- Create employees with validated personal, employment, and address fields.
- Persist records between browser sessions.
- Confirm creation through the accessible `@drgyz/hrnet-accessible-modal`
  package.
- Search all employee fields.
- Sort every table column.
- Select a page size and move through paginated results.
- Responsive layouts and keyboard-visible focus states.

## Installation

```bash
npm install
npm run dev
```

The application pins the converted library's immutable public
[`v0.2.0`](https://github.com/DRGYZ/react-hrnet-modal/tree/v0.2.0) source tag.
The same release is published as
[`@drgyz/hrnet-accessible-modal`](https://github.com/DRGYZ/react-hrnet-modal/pkgs/npm/hrnet-accessible-modal)
on GitHub Packages. The source tag keeps a fresh clone installable without a
registry token, because GitHub requires authentication to install npm-format
packages even when their package page is public.

## Quality commands

```bash
npm run lint
npm run test
npm run build
npm run check
```

The Lighthouse comparison must run against `npm run build` followed by
`npm run preview`, using the same Lighthouse version and audit profile as the
legacy baseline.

## Architecture

- `src/pages`: route-level Create Employee and Employee List pages.
- `src/components`: reusable form, layout, and table components.
- `src/state`: reducer, context, and persistence integration.
- `src/data`: stable state and department option data.
- `src/utils`: presentation helpers such as date formatting.

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the reasoning behind the
main decisions.
