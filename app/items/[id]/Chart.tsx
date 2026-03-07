"use client";
import { LineChart, Line, CartesianGrid, XAxis } from "recharts";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
    usage_rate: {
        label: "Usage",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

type UsageDataPoint = {
    day: number;
    usage_rate: number;
};

const placeholderData: UsageDataPoint[] = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    usage_rate: Math.floor(Math.random() * 50) + 10,
}));

export function ChartLineDots({ data = placeholderData }: { data?: UsageDataPoint[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Usage over Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={data}
                        margin={{ left: 12, right: 12 }}
                    >
                        <CartesianGrid vertical={false} />
                        <XAxis
                            dataKey="day"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `Day ${value}`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Line
                            dataKey="usage_rate"
                            type="natural"
                            stroke="var(--color-usage_rate)"
                            strokeWidth={2}
                            dot={{ fill: "var(--color-usage_rate)" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
        </Card>
    );
}