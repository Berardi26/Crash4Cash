import React from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Pagination,
    getKeyValue,
    Image,
} from "@heroui/react";

export const pastgame = [
    {
        key: "1",
        name: "Tony Reichert",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "2",
        name: "Zoey Lang",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "3",
        name: "Jane Fisher",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "4",
        name: "William Howard",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "5",
        name: "Emily Collins",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "6",
        name: "Brian Kim",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "7",
        name: "Laura Thompson",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "8",
        name: "Michael Stevens",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "9",
        name: "Sophia Nguyen",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "10",
        name: "James Wilson",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "11",
        name: "Ava Johnson",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "12",
        name: "Isabella Smith",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "13",
        name: "Oliver Brown",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "14",
        name: "Lucas Jones",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "15",
        name: "Grace Davis",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "16",
        name: "Elijah Garcia",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "17",
        name: "Emma Martinez",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "18",
        name: "Benjamin Lee",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "19",
        name: "Mia Hernandez",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "20",
        name: "Daniel Lewis",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "21",
        name: "Amelia Clark",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "22",
        name: "Jackson Walker",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "23",
        name: "Henry Hall",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "24",
        name: "Charlotte Young",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
    {
        key: "25",
        name: "Liam King",
        bet: (Math.random() * 10 + 1).toFixed(2),
        result: 1,
        payout: (Math.random() * 100 + 10).toFixed(2),
    },
];

export default function RecentGame() {
    const [page, setPage] = React.useState(1);
    const rowsPerPage = 10;

    const pages = Math.ceil(pastgame.length / rowsPerPage);

    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return pastgame.slice(start, end);
    }, [page, pastgame]);

    return (
        <Table
            aria-label="Example table with client side pagination"
            bottomContent={
                <div className="flex w-full justify-center">
                    <Pagination
                        isCompact
                        showControls
                        showShadow
                        color="secondary"
                        page={page}
                        total={pages}
                        onChange={(page) => setPage(page)}
                    />
                </div>
            }
            classNames={{
                wrapper: "min-h-[222px]",
            }}
        >
            <TableHeader>
                <TableColumn key="name">Game</TableColumn>
                <TableColumn key="bet">Initial Bet</TableColumn>
                <TableColumn key="result">Result</TableColumn>
                <TableColumn key="payout">Payout</TableColumn>
            </TableHeader>
            <TableBody items={items} >
                {(item) => (
                    <TableRow key={item.name} className="hover:bg-white/10">
                        <TableCell className="text-white flex items-center gap-1">
                            <Image src="/assets/images/icons/rocket.png" alt="Rocket Icon" className="w-6 h-6 inline-block" />
                            Rocket</TableCell>
                        <TableCell className="text-white">{getKeyValue(item, "bet")}</TableCell>
                        <TableCell className="text-white">
                            {getKeyValue(item, "result") === 1 ? (
                                <span className="text-success-500">Win</span>
                            ) : (
                                <span className="text-danger-500">Lose</span>
                            )}
                        </TableCell>
                        <TableCell className="text-white flex items-center gap-2">
                            <Image src={`/assets/game/image/token.png`} className="w-8 h-8" /> {getKeyValue(item, "payout")}</TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
}

