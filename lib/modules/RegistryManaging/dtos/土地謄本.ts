type 共同擔保建號 = {
    地段: string
    小段: string
    建號: string
}

type 共同擔保地號 = {
    地段: string
    小段: string
    地號: string
}

export type 土地他項權利 = {
    登記次序: string
    權利種類: string
    收件日期: string
    字號: string
    登記日期: string
    登記原因: string
    權利人: string
    統一編號: string | null
    住址: string | null
    債權額比例: string | null
    擔保債權總金額: number | null
    擔保債權種類及範圍: string | null
    擔保債權確定日期: string | null
    償還日期: string | null
    存續期間: string | null
    利息或利率: string | null
    遲延利息或利率: string | null
    違約金: number | null
    其他擔保範圍約定: string | null
    權利標的: string | null
    標的登記次序: string[]
    設定權利範圍: string | null
    證明書字號: string | null
    共同擔保地號: 共同擔保地號[]
    共同擔保建號: 共同擔保建號[]
    其他登記事項: string
}

export type 土地所有權 = {
    登記次序: string
    登記日期: string
    登記原因: string
    原因發生日期: string
    所有權人: string
    統一編號: string | null
    住址: string | null
    權利範圍: string | null
    權狀字號: string
    當期申報地價年月: string | null
    當期申報地價: number | null
    前次移轉現值或原規定地價年月: string | null
    前次移轉現值或原規定地價: number | null
    歷次取得權利範圍: string | null
    相關他項權利登記次序: string[]
    其他登記事項: string
}

type 地上建物建號 = {
    地段: string
    小段: string
    建號: string
}

export type 土地標示 = {
    登記日期: string
    登記原因: string
    面積: string
    使用分區: string
    使用地類別: string
    公告土地現值年月: string
    公告土地現值: number
    地上建物建號: 地上建物建號[]
    其他登記事項: string
}

export type 土地謄本 = {
    列印時間: string
    列印公司: string
    謄本種類碼: string
    謄本編號: string
    謄本核發機關: string
    資料管轄機關: string
    行政區: string
    地段: string
    小段: string
    地號: string
    土地標示部: Array<土地標示 | null>
    土地所有權部: Array<土地所有權 | null>
    土地他項權利部: Array<土地他項權利 | null>
}
