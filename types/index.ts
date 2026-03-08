export type Item = {
    id: number;
    name: string;
    quantity: number;
    created_at: string;
    expiration: string;
    usage_rate: number;
};

export type UsageLog = {
    item_id: number;
    usage_amount: number;
    logged_at: Date;
};

export type InventoryItem = {
    name: string;
    quantity: number;
    expiration: string;
};