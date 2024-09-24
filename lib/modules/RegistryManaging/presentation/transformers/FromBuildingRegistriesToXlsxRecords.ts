import CallableInstance from "callable-instance"
import { type Registry } from "~/lib/modules/RegistryManaging/dtos/Registry"
import { RegistryStatuses } from "~/lib/modules/RegistryManaging/dtos/RegistryStatuses"
import {
    type 建物謄本,
    type 建物標示,
    type 建物所有權,
    type 建物他項權利,
} from "~/lib/modules/RegistryManaging/dtos/建物謄本"
import { createConsola, type ConsolaInstance } from "consola"

export class FromBuildingRegistriesToXlsxRecords extends CallableInstance<[Registry, number], Iterable<any>> {
    protected logger: ConsolaInstance
    constructor() {
        super(`execute`)
        this.logger = createConsola().withTag(`FromBuildingRegistriesToXlsxRecords`)
    }
    protected *建物所有權(registry: Registry) {
        if (registry.status !== RegistryStatuses.Done) return
        const 建物登記 = registry.metadata as 建物謄本
        if (!建物登記) return
        if (!建物登記.建物所有權部 || !建物登記.建物所有權部.length) return
        let count = 0
        for (let i = 0; i < 建物登記.建物所有權部.length; i++) {
            if (!建物登記.建物所有權部[i]) continue
            for (let j = 0; j < 建物登記.建物標示部.length; j++) {
                if (!建物登記.建物標示部[j]) continue
                yield [建物登記, i, j, ++count] as [建物謄本, number, number, number]
            }
        }
    }
    protected 相關附屬建物(當前建物標示: 建物標示) {
        const 相關附屬建物: { [附屬建物類型: string]: string[] } = {
            地下室: [],
            騎樓: [],
            陽臺: [],
            平臺: [],
            露臺: [],
            其他: [],
        }
        if (!當前建物標示) return 相關附屬建物
        if (!當前建物標示.附屬建物) return 相關附屬建物
        for (const 附屬建物 of 當前建物標示.附屬建物) {
            const 附屬建物類型 = 附屬建物.附屬建物類型.replace(/台/g, "臺")
            const 面積 = parseFloat(String(附屬建物.面積))
            if (!面積) continue
            if (typeof 相關附屬建物[附屬建物類型] === "undefined") 相關附屬建物["其他"].push(`${附屬建物.面積}`)
            else 相關附屬建物[附屬建物類型].push(`${附屬建物.面積}`)
        }
        return 相關附屬建物
    }
    protected 公設建號(當前建物標示: 建物標示) {
        const 公設建號: string[] = []
        if (!當前建物標示) return 公設建號
        if (!當前建物標示.共有部分) return 公設建號
        for (const 共有部分 of 當前建物標示.共有部分)
            公設建號.push(`${共有部分.地段}${共有部分.小段 || ""}${共有部分.建號}`)
        return 公設建號.join(",")
    }
    protected 公設面積(當前建物標示: 建物標示) {
        const 公設面積: string[] = []
        if (!當前建物標示) return 公設面積
        if (!當前建物標示.共有部分) return 公設面積
        for (const 共有部分 of 當前建物標示.共有部分) {
            const 面積 = parseFloat(String(共有部分.面積))
            if (!面積) continue
            if (!共有部分.權利範圍) {
                公設面積.push(`${面積}`)
                continue
            }
            const [分子, 分母] = 共有部分.權利範圍.split("/").map((n: string) => {
                try {
                    return parseInt(n)
                } catch {
                    return 0
                }
            })
            if (分母 === 0) {
                if (分子 === 1) 公設面積.push(`${面積}`)
                continue
            }
            公設面積.push(`${面積}*${分子}/${分母}`)
        }
        return 公設面積
    }
    protected 層次(當前建物標示: 建物標示) {
        const 層次: string[] = []
        if (!當前建物標示) return 層次
        if (!當前建物標示.層次) return 層次
        for (const 層 of 當前建物標示.層次) 層次.push(String(層.層次))
        return 層次
    }
    protected 主建物面積(當前建物標示: 建物標示) {
        const 主建物面積: string[] = []
        if (!當前建物標示) return 主建物面積
        if (!當前建物標示.層次) return 主建物面積
        for (const 層 of 當前建物標示.層次) {
            const 面積 = parseFloat(String(層.層次面積))
            if (!面積) continue
            主建物面積.push(`${層.層次面積}`)
        }
        return 主建物面積
    }
    protected 持份(當前建物所有權: 建物所有權) {
        if (!當前建物所有權.權利範圍) return ["1", "1"]
        const [持份分子, 持份分母] = 當前建物所有權.權利範圍.split("/")
        if (!持份分母 && 持份分子 === "1") return ["1", "1"]
        return [持份分子, 持份分母] as [string, string]
    }
    protected 相關建物他項權利(當前建物所有權: 建物所有權, 建物他項權利部?: Array<建物他項權利 | null>) {
        const 相關建物他項權利: 建物他項權利[] = []
        if (!建物他項權利部 || !建物他項權利部.length) return 相關建物他項權利
        if (!當前建物所有權.建物他項權利登記次序) return 相關建物他項權利
        for (const 建物他項權利登記次序 of 當前建物所有權.建物他項權利登記次序) {
            for (const 建物他項權利 of 建物他項權利部) {
                if (!建物他項權利) continue
                if (建物他項權利.登記次序 === 建物他項權利登記次序) 相關建物他項權利.push(建物他項權利)
            }
        }
        return 相關建物他項權利
    }
    protected 列(
        列次: number,
        登記建物: 建物謄本,
        當前建物標示: 建物標示,
        當前建物所有權: 建物所有權,
        層次: ReturnType<typeof this.層次>,
        主建物面積: ReturnType<typeof this.主建物面積>,
        相關附屬建物: ReturnType<typeof this.相關附屬建物>,
        公設建號: ReturnType<typeof this.公設建號>,
        公設面積: ReturnType<typeof this.公設面積>,
        [持份分子, 持份分母]: ReturnType<typeof this.持份>,
        相關建物他項權利: ReturnType<typeof this.相關建物他項權利>,
    ) {
        const 列: any = {
            登記次序: 當前建物所有權.登記次序,
            行政區: 登記建物.行政區,
            地段: 登記建物.地段,
            小段: 登記建物.小段,
            建號: 登記建物.建號,
            坐落地號: 當前建物標示.建物坐落
                ?.map((建物坐落) => `${建物坐落.地段}${建物坐落.小段 || ""}${建物坐落.地號}`)
                .join(","),
            建物門牌: 當前建物標示.建物門牌,
            主要建材: 當前建物標示.主要建材,
            層數: parseInt(當前建物標示.層數),
            層次: `${層次}`,
            "主建物\n(㎡)": {
                f: 主建物面積.join("+"),
                z: "0.00",
            },
            "地下室\n(㎡)": {
                f: 相關附屬建物["地下室"].join("+") || "0",
                z: "0.00",
            },
            "騎樓\n(㎡)": {
                f: 相關附屬建物["騎樓"].join("+") || "0",
                z: "0.00",
            },
            "陽臺\n(㎡)": {
                f: 相關附屬建物["陽臺"].join("+") || "0",
                z: "0.00",
            },
            "平臺\n(㎡)": {
                f: 相關附屬建物["平臺"].join("+") || "0",
                z: "0.00",
            },
            "露臺\n(㎡)": {
                f: 相關附屬建物["露臺"].join("+") || "0",
                z: "0.00",
            },
            "其他\n(㎡)": {
                f: 相關附屬建物["其他"].join("+") || "0",
                z: "0.00",
            },
            公設建號: 公設建號,
            "公設\n(㎡)": {
                f: 公設面積.join("+") || "0",
                z: "0.00",
            },
            "產權面積\n(㎡)": {
                f: `K${列次}+L${列次}+M${列次}+N${列次}+O${列次}+P${列次}+S${列次}`,
                z: "0.00",
            },
            "持份\n分子": 持份分子,
            "持份\n分母": 持份分母,
            "持分產權\n面積(㎡)": {
                f: `T${列次}*U${列次}/V${列次}`,
                z: "0.00",
            },
            "持分產權\n面積(坪)": {
                f: `W${列次}*0.3025`,
                z: "0.00",
            },
            建物完成日: 當前建物標示.建築完成日期,
            所有權人: 當前建物所有權.所有權人,
            統一編號: 當前建物所有權.統一編號,
            登記地址: 當前建物所有權.住址,
            登記日期: 當前建物所有權.登記日期,
            登記原因: 當前建物所有權.登記原因,
        }
        let 他項權利次序 = 1
        for (const 建物他項權利 of 相關建物他項權利) {
            列[`權利種類${他項權利次序}`] = 建物他項權利.權利種類
            列[`權利人${他項權利次序}`] = 建物他項權利.權利人
            列[`擔保債權總額${他項權利次序}`] = 建物他項權利.擔保債權總金額
            列[`登記原因${他項權利次序}`] = 建物他項權利.登記原因
            列[`登記日期${他項權利次序}`] = 建物他項權利.登記日期
            他項權利次序 += 1
        }
        return 列
    }
    *execute(registry: Registry, 筆數: number) {
        for (const [當前建物登記, i, j, count] of this.建物所有權(registry)) {
            const 列次 = 筆數 + 2 + count
            const 當前建物標示 = 當前建物登記.建物標示部[j]!
            const 當前建物所有權 = 當前建物登記.建物所有權部[i]!
            const 相關建物他項權利 = 當前建物登記.建物他項權利部
            const 列 = this.列(
                列次,
                當前建物登記,
                當前建物標示,
                當前建物所有權,
                this.層次(當前建物標示),
                this.主建物面積(當前建物標示),
                this.相關附屬建物(當前建物標示),
                this.公設建號(當前建物標示),
                this.公設面積(當前建物標示),
                this.持份(當前建物所有權),
                this.相關建物他項權利(當前建物所有權, 相關建物他項權利),
            )
            yield 列
        }
    }
}
