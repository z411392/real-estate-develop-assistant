export type PageMeta = {
    name: string
    title: string
    fullPath: (params?: any) => string
}

export const Pages: { [pageName: string]: PageMeta } = {
    SignIn: {
        name: "auth-sign-in",
        title: "登入頁",
        fullPath: () => "/auth/sign-in",
    },
    Tenants: {
        name: "index",
        title: "選擇團隊",
        fullPath: () => "/",
    },
    Dashboard: {
        name: "tenants-tenantId",
        title: "控制臺",
        fullPath: ({ tenantId }: { tenantId: string }) => "/tenants/:tenantId".replace(":tenantId", tenantId),
    },
    Snapshots: {
        name: "tenants-tenantId-snapshots-index",
        title: "謄本管理",
        fullPath: ({ tenantId }: { tenantId: string }) => "/tenants/:tenantId/snapshots".replace(":tenantId", tenantId),
    },
    Registries: {
        name: "tenants-tenantId-snapshots-snapshotId-index",
        title: "登記管理",
        fullPath: ({ tenantId, snapshotId }: { tenantId: string; snapshotId: string }) =>
            "/tenants/:tenantId/snapshots/:snapshotId"
                .replace(":tenantId", tenantId)
                .replace(":snapshotId", snapshotId),
    },
    Users: {
        name: "tenants-tenantId-users-index",
        title: "成員管理",
        fullPath: ({ tenantId }: { tenantId: string }) => "/tenants/:tenantId/users".replace(":tenantId", tenantId),
    },
    Lands: {
        name: "tenants-tenantId-lands-index",
        title: "現值查詢",
        fullPath: ({ tenantId }: { tenantId: string }) => "/tenants/:tenantId/lands".replace(":tenantId", tenantId),
    },
}

export enum DatetimeFormats {
    ISO8601DATE = "yyyy-LL-dd",
    ISO8601TIME = "HH:mm:ss",
    ISO8601 = `${DatetimeFormats.ISO8601DATE} ${DatetimeFormats.ISO8601TIME}`,
}

export enum PageSizes {
    Snapshots = 20,
}

export const emptyPlaceholder = "-"

export const Root = "TWnYURxLxWSNtBOI3Y2936kPyrg1"

export const Collections = new Proxy(
    {
        SnapshotEvents: "snapshots/:snapshotId/events",
    },
    {
        get: (props, prop) => {
            const collection = props[prop as keyof typeof props]
            if (!collection) return undefined
            return process.env.NODE_ENV && process.env.NODE_ENV !== "production"
                ? [process.env.NODE_ENV, collection].join("_")
                : collection
        },
    },
)
