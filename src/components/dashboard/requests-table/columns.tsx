import { createColumnHelper, type ColumnDef } from "@tanstack/react-table";

export type TableDataType = {
    date: string;
    time: string;
    vendor: string;
    location: string;
    request: string;
    email: string;
};

const columnHelper = createColumnHelper<TableDataType>();

export const columns: ColumnDef<TableDataType, any>[] = [
    columnHelper.accessor((row) => ({ date: row.date, time: row.time }), {
        id: "date",
        header: "Date",
        cell: (info) => (
            <div className="text-sm text-foreground">
                <p>{info.getValue().date}</p>
                <p>{info.getValue().time}</p>
            </div>
        ),
    }),
    columnHelper.accessor("vendor", {
        header: "Vendor Name",
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("location", {
        header: "Location",
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("request", {
        header: "Service Request",
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.accessor("email", {
        header: "Email",
        cell: (info) => <span className="text-sm text-foreground">{info.getValue()}</span>,
    }),
    columnHelper.display({
        id: "actions",
        header: "Action",
        cell: () => (
            <div className="flex gap-3">
                <button className="px-3.5 py-2 bg-[#e6f8ef] text-[#027847] rounded-lg text-sm font-semibold hover:bg-[#d1f4e0] transition-colors">
                    Approve
                </button>
                <button className="px-3.5 py-2 bg-[#fef3f2] text-[#b42318] rounded-lg text-sm font-semibold hover:bg-[#fee4e2] transition-colors">
                    Reject
                </button>
            </div>
        ),
    }),
];
