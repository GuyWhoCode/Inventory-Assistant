export interface ItemEntry {
    name: string;
    quantity: number;
    expiration: string;
    usage_rate: number;
}

export interface Item extends ItemEntry {
    id: number;
    created_at: string;
}

export interface UsageLog {
    item_id: number;
    usage_amount: number;
    logged_at: Date;
}
