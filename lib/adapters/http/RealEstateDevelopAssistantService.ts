import { default as axiosFactory, type AxiosInstance } from "axios"
import { type SystemInfo } from "~/lib/modules/SystemMaintaining/dtos/SystemInfo"
import { type Tenant } from "~/lib/modules/TenantManaging/dtos/Tenant"
import { type Snapshot } from "~/lib/modules/SnapshotManaging/dtos/Snapshot"
import { type User } from "~/lib/modules/IdentityAndAccessManaging/dtos/User"
import { type Registry } from "~/lib/modules/RegistryManaging/dtos/Registry"
import { type Permission } from "~/lib/modules/IdentityAndAccessManaging/dtos/Permission"
import { type UserWithPermission } from "~/lib/modules/IdentityAndAccessManaging/dtos/UserWithPermission"
import { type PermissionStatuses } from "~/lib/modules/IdentityAndAccessManaging/dtos/PermissionStatuses"
import { type LandDescriptor } from "~/lib/modules/OpenDataManaging/dtos/LandDescriptor"
import { type Land } from "~/lib/modules/OpenDataManaging/dtos/Land"
import { type ConsolaInstance, createConsola } from "consola"
import { createElapsedTimeProfiler } from "~/lib/utils/development"
export class RealEstateDevelopAssistantService {
    protected axios: AxiosInstance
    protected logger: ConsolaInstance
    constructor({ baseURL, idToken }: { baseURL: string; idToken?: string }) {
        const headers: any = {}
        if (idToken) headers[`authorization`] = `bearer ${idToken}`
        this.axios = axiosFactory.create({
            baseURL,
            headers,
        })
        this.logger = createConsola().withTag(`RealEstateDevelopAssistantService`)
    }
    async retrieveSystemInfo() {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = "/system/info"
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { systemInfo: SystemInfo } }>(uri)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`retrieveSystemInfo 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async countTenants() {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants`
            const response = await this.axios.head(uri)
            let total = 0
            try {
                total = parseInt(response.headers["content-length"])
                return total
            } catch {}
            return total
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`countTenants 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async listTenants(page: number) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants`
            const params = { page }
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { tenants: Tenant[] } }>(uri, { params })
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`listTenants 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async retrieveTenant(tenantId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId`.replace(":tenantId", tenantId)
            const {
                data: { payload },
            } = await this.axios.get<{
                payload: {
                    tenant: Tenant
                    permission?: Permission
                }
            }>(uri)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`retrieveTenant 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async countSnapshots(tenantId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots`.replace(":tenantId", tenantId)
            const response = await this.axios.head(uri)
            let total = 0
            try {
                total = parseInt(response.headers["content-length"])
                return total
            } catch {}
            return total
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`countSnapshots 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async listSnapshots(tenantId: string, page: number) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots`.replace(":tenantId", tenantId)
            const params = { page }
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { snapshots: Snapshot[]; usersMap: { [userId: string]: User } } }>(
                uri,
                {
                    params,
                },
            )
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`listSnapshots 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async countRegistries(tenantId: string, snapshotId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries`
                .replace(":tenantId", tenantId)
                .replace(":snapshotId", snapshotId)
            const response = await this.axios.head(uri)
            let total = 0
            try {
                total = parseInt(response.headers["content-length"])
                return total
            } catch {}
            return total
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`countRegistries 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async listRegistries(tenantId: string, snapshotId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries`
                .replace(":tenantId", tenantId)
                .replace(":snapshotId", snapshotId)
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { registries: Registry[] } }>(uri)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`listRegistries 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async parseRegistry(tenantId: string, snapshotId: string, registryId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries/:registryId`
                .replace(":tenantId", tenantId)
                .replace(":snapshotId", snapshotId)
                .replace(":registryId", registryId)
            const {
                data: { payload },
            } = await this.axios.put<{ payload: { toBeDedcuted: number } }>(uri)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`parseRegistry 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async retrieveRegistry(tenantId: string, snapshotId: string, registryId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots/:snapshotId/registries/:registryId`
                .replace(":tenantId", tenantId)
                .replace(":snapshotId", snapshotId)
                .replace(":registryId", registryId)
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { registry: Registry } }>(uri)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`retrieveRegistry 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async uploadSnapshot(tenantId: string, name: string, content: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/snapshots`.replace(":tenantId", tenantId)
            const data = {
                name,
                content,
            }
            const {
                data: { payload },
            } = await this.axios.post<{ payload: { snapshotId: string } }>(uri, data, {
                headers: {
                    "Content-Type": "application/octet-stream",
                },
            })
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`uploadSnapshot 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async joinTenant(tenantId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/permissions`.replace(":tenantId", tenantId)
            const data = {}
            const {
                data: { payload },
            } = await this.axios.post<{ payload: { permissionId: string } }>(uri, data)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`joinTenant 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async countUsers(tenantId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/users`.replace(":tenantId", tenantId)
            const response = await this.axios.head(uri)
            let total = 0
            try {
                total = parseInt(response.headers["content-length"])
                return total
            } catch {}
            return total
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`countUsers 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async listUsers(tenantId: string, page: number) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/users`.replace(":tenantId", tenantId)
            const params = { page }
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { users: UserWithPermission[] } }>(uri, { params })
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`listUsers 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async reviewJoining(tenantId: string, permissionId: string, status: PermissionStatuses) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/permissions/:permissionId`
                .replace(":tenantId", tenantId)
                .replace(":permissionId", permissionId)
            const data = { status }
            const {
                data: { payload },
            } = await this.axios.put<{ payload: { permissionId: string } }>(uri, data)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`reviewJoining 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async retrievePermission(tenantId: string, permissionId: string) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/permissions/:permissionId`
                .replace(":tenantId", tenantId)
                .replace(":permissionId", permissionId)
            const {
                data: { payload },
            } = await this.axios.get<{ payload: { permission: Permission } }>(uri)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`retrievePermission 花費了 ${measureElapsedTime()} ms`)
        }
    }
    async retrieveLands(tenantId: string, ...landDescriptors: LandDescriptor[]) {
        const measureElapsedTime = createElapsedTimeProfiler()
        try {
            const uri = `/tenants/:tenantId/lands`.replace(":tenantId", tenantId)
            const data = { landDescriptors }
            const {
                data: { payload },
            } = await this.axios.post<{ payload: { lands: Land[] } }>(uri, data)
            return payload
        } catch (error) {
            this.logger.error((error as Error).message)
            throw error
        } finally {
            this.logger.debug(`retrieveLands 花費了 ${measureElapsedTime()} ms`)
        }
    }
}
