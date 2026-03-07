"use client";

import { useState } from "react";
import {
    AlertTriangle,
    CheckCircle2,
    Info,
    TrendingDown,
    X,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type NotificationType = "warning" | "success" | "info" | "error";

type Notification = {
    id: number;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: string;
    read: boolean;
};

// ─── Placeholder data ─────────────────────────────────────────────────────────

const PLACEHOLDER_NOTIFICATIONS: Notification[] = [
    {
        id: 1,
        type: "warning",
        title: "Low Stock: Milk",
        message:
            "2 units left. At 19/day usage rate, you'll run out in less than 1 day.",
        timestamp: "2 min ago",
        read: false,
    },
    {
        id: 2,
        type: "error",
        title: "Expiring Soon: Water",
        message:
            "Water expires Mar 12. Consider using or replacing current stock.",
        timestamp: "1 hr ago",
        read: false,
    },
    {
        id: 3,
        type: "success",
        title: "Restock Complete",
        message:
            "Eggs restocked successfully. Quantity updated from 0 → 24 units.",
        timestamp: "3 hrs ago",
        read: false,
    },
    {
        id: 4,
        type: "info",
        title: "Usage Rate Spike",
        message:
            "Water consumption up 40% this week. Consider adjusting reorder threshold.",
        timestamp: "Yesterday",
        read: true,
    },
    {
        id: 5,
        type: "warning",
        title: "Expiring Soon: Bread",
        message: "Bread expires in 2 days (Mar 9). Current quantity: 1 loaf.",
        timestamp: "Yesterday",
        read: true,
    },
];

// ─── Config maps ──────────────────────────────────────────────────────────────

const iconMap: Record<NotificationType, React.ReactNode> = {
    warning: <AlertTriangle className="h-3.5 w-3.5 text-yellow-500" />,
    error: <TrendingDown className="h-3.5 w-3.5 text-red-500" />,
    success: <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />,
    info: <Info className="h-3.5 w-3.5 text-blue-500" />,
};

const chipMap: Record<NotificationType, string> = {
    warning: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20",
    error: "bg-red-500/10 text-red-600 border-red-500/20",
    success: "bg-green-500/10 text-green-600 border-green-500/20",
    info: "bg-blue-500/10 text-blue-600 border-blue-500/20",
};

// ─── Single notification row ──────────────────────────────────────────────────

function NotificationItem({
    notification,
    onDismiss,
    onMarkRead,
}: {
    notification: Notification;
    onDismiss: (id: number) => void;
    onMarkRead: (id: number) => void;
}) {
    return (
        <div
            className={cn(
                "group relative flex gap-3 rounded-lg p-3 cursor-pointer transition-colors",
                notification.read
                    ? "hover:bg-muted/50"
                    : "bg-muted/30 hover:bg-muted/50",
            )}
            onClick={() => onMarkRead(notification.id)}
        >
            {!notification.read && (
                <span className="absolute top-4 right-8 h-1.5 w-1.5 rounded-full bg-blue-500" />
            )}

            <div className="mt-0.5 shrink-0">{iconMap[notification.type]}</div>

            <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-semibold leading-none">
                        {notification.title}
                    </p>
                    <span
                        className={cn(
                            "inline-flex items-center rounded-full border px-1.5 py-0.5 text-[10px] font-medium capitalize",
                            chipMap[notification.type],
                        )}
                    >
                        {notification.type}
                    </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                    {notification.message}
                </p>
                <p className="text-[11px] text-muted-foreground/50">
                    {notification.timestamp}
                </p>
            </div>

            <button
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity mt-0.5"
                onClick={(e) => {
                    e.stopPropagation();
                    onDismiss(notification.id);
                }}
                aria-label="Dismiss"
            >
                <X className="h-3 w-3 text-muted-foreground hover:text-foreground transition-colors" />
            </button>
        </div>
    );
}

// ─── Persistent panel ─────────────────────────────────────────────────────────

export default function NotificationPanel() {
    const [notifications, setNotifications] = useState<Notification[]>(
        PLACEHOLDER_NOTIFICATIONS,
    );

    const unreadCount = notifications.filter((n) => !n.read).length;
    const dismiss = (id: number) =>
        setNotifications((p) => p.filter((n) => n.id !== id));
    const markRead = (id: number) =>
        setNotifications((p) =>
            p.map((n) => (n.id === id ? { ...n, read: true } : n)),
        );
    const markAllRead = () =>
        setNotifications((p) => p.map((n) => ({ ...n, read: true })));

    return (
        <aside className="flex flex-col h-full w-72 shrink-0 border-l bg-background">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <h2 className="text-sm font-semibold">Notifications</h2>
                    {unreadCount > 0 && (
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                            {unreadCount}
                        </span>
                    )}
                </div>
                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-muted-foreground h-auto py-1 px-2"
                        onClick={markAllRead}
                    >
                        Mark all read
                    </Button>
                )}
            </div>

            <Separator />

            {/* List */}
            <ScrollArea className="flex-1">
                <div className="px-2 py-2 space-y-0.5">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 gap-2 text-center">
                            <CheckCircle2 className="h-7 w-7 text-muted-foreground/30" />
                            <p className="text-xs text-muted-foreground">
                                All caught up
                            </p>
                        </div>
                    ) : (
                        notifications.map((n) => (
                            <NotificationItem
                                key={n.id}
                                notification={n}
                                onDismiss={dismiss}
                                onMarkRead={markRead}
                            />
                        ))
                    )}
                </div>
            </ScrollArea>
        </aside>
    );
}
