import CallableInstance from "callable-instance"
import { type Registry } from "~/lib/modules/RegistryManaging/dtos/Registry"
import { RegistryStatuses } from "~/lib/modules/RegistryManaging/dtos/RegistryStatuses"
import {
    type 土地謄本,
    type 土地所有權,
    type 土地他項權利,
    type 土地標示,
} from "~/lib/modules/RegistryManaging/dtos/土地謄本"
import { createConsola, type ConsolaInstance } from "consola"

export class FromLandRegistriesToXlsxRecords extends CallableInstance<[Registry, number], Iterable<any>> {
    protected logger: ConsolaInstance
    constructor() {
        super(`execute`)
        this.logger = createConsola().withTag(`FromLandRegistriesToXlsxRecords`)
    }
    protected *土地所有權(registry: Registry) {
        if (registry.status !== RegistryStatuses.Done) return
        const 土地登記 = registry.metadata as 土地謄本
        if (!土地登記) return
        if (!土地登記.土地所有權部) return
        let count = 0
        for (let i = 0; i < 土地登記.土地所有權部.length; i++) {
            if (!土地登記.土地所有權部[i]) continue
            for (let j = 0; j < 土地登記.土地標示部.length; j++) {
                if (!土地登記.土地標示部[j]) continue
                yield [土地登記, i, j, ++count] as [土地謄本, number, number, number]
            }
        }
    }
    protected 持份(當前土地所有權: 土地所有權) {
        if (!當前土地所有權.權利範圍) return ["1", "1"]
        const [持份分子, 持份分母] = 當前土地所有權.權利範圍.split("/")
        if (!持份分母 && 持份分子 === "1") return ["1", "1"]
        return [持份分子, 持份分母] as [string, string]
    }
    protected 相關土地他項權利(當前土地所有權: 土地所有權, 土地他項權利部?: Array<土地他項權利 | null>) {
        const 相關土地他項權利: 土地他項權利[] = []
        if (!土地他項權利部 || !土地他項權利部.length) return 相關土地他項權利
        if (!當前土地所有權.相關他項權利登記次序) return 相關土地他項權利
        for (const 土地他項權利登記次序 of 當前土地所有權.相關他項權利登記次序) {
            for (const 土地他項權利 of 土地他項權利部) {
                if (!土地他項權利) continue
                if (土地他項權利.登記次序 === 土地他項權利登記次序) 相關土地他項權利.push(土地他項權利)
            }
        }
        return 相關土地他項權利
    }
    protected 列(
        列次: number,
        當前土地登記: 土地謄本,
        當前土地所有權: 土地所有權,
        當前土地標示: 土地標示,
        [持份分子, 持份分母]: ReturnType<typeof this.持份>,
        相關土地他項權利: ReturnType<typeof this.相關土地他項權利>,
    ) {
        const 列: any = {
            登記次序: 當前土地所有權.登記次序,
            行政區: 當前土地登記.行政區,
            地段: 當前土地登記.地段,
            小段: 當前土地登記.小段,
            地號: 當前土地登記.地號,
            "面積\n(㎡)": {
                f: String(當前土地標示.面積),
                z: "0.00", //https://stackoverflow.com/questions/31143770/currency-format-in-js-xlsx
            },
            "持分\n分子": 持份分子,
            "持分\n分母": 持份分母,
            "持分面積\n(㎡)": {
                f: `F${列次}*G${列次}/H${列次}`,
                z: "0.00",
            },
            "持分面積\n(坪)": {
                f: `I${列次}*0.3025`,
                z: "0.00",
            },
            "公告現值\n年期": 當前土地標示.公告土地現值年月,
            "公告現值\n(元/㎡)": 當前土地標示.公告土地現值,
            地上建號: 當前土地標示.地上建物建號
                ?.map((地上建物) => `${地上建物.地段}${地上建物.小段 || ""}${地上建物.建號}`)
                .join(","),
            所有權人: 當前土地所有權.所有權人,
            統一編號: 當前土地所有權.統一編號,
            登記地址: 當前土地所有權.住址,
            登記日期: 當前土地所有權.登記日期,
            登記原因: 當前土地所有權.登記原因,
        }
        let 他項權利次序 = 1
        for (const 土地他項權利 of 相關土地他項權利) {
            列[`權利種類${他項權利次序}`] = 土地他項權利.權利種類
            列[`權利人${他項權利次序}`] = 土地他項權利.權利人
            列[`擔保債權總額${他項權利次序}`] = 土地他項權利.擔保債權總金額
            列[`登記原因${他項權利次序}`] = 土地他項權利.登記原因
            列[`登記日期${他項權利次序}`] = 土地他項權利.登記日期
            他項權利次序 += 1
        }
        return 列
    }
    *execute(registry: Registry, 筆數: number) {
        for (const [當前土地登記, i, j] of this.土地所有權(registry)) {
            const 當前土地所有權 = 當前土地登記.土地所有權部[i]!
            const 當前土地標示 = 當前土地登記.土地標示部[j]!
            const 列次 = 筆數 + 2 + i + j
            const 土地他項權利部 = 當前土地登記.土地他項權利部
            const 列 = this.列(
                列次,
                當前土地登記,
                當前土地所有權,
                當前土地標示,
                this.持份(當前土地所有權),
                this.相關土地他項權利(當前土地所有權, 土地他項權利部),
            )
            yield 列
        }
    }
}
