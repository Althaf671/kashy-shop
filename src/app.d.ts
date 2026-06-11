// See https://svelte.dev/docs/kit/types#app.d.ts
import type { ISession, IUser } from "$lib/types/features";

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: IUser | null;
			session: ISession | null;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

declare module "simple-datatables" {
  export { DataTable } from "simple-datatables/dist/dts/datatable";
  export { convertCSV, convertJSON } from "simple-datatables/dist/dts/convert";
  export { exportCSV, exportJSON, exportSQL, exportTXT } from "simple-datatables/dist/dts/export";
  export { createElement, isJson, isObject } from "simple-datatables/dist/dts/helpers";
  export { makeEditable } from "simple-datatables/dist/dts/editing";
  export { addColumnFilter } from "simple-datatables/dist/dts/column_filter";

  export type { DataTableOptions, DataTableConfiguration, ColumnOption, cellType, inputCellType, dataRowType, inputRowType, headerCellType, inputHeaderCellType, TableDataType, DataOption, renderType, nodeType, elementNodeType, textNodeType, cellDataType } from "simple-datatables/dist/dts/datatable";

  export interface SelectableDataRow {
    selected?: boolean;
    [key: string]: unknown;
  }
}

export {};
