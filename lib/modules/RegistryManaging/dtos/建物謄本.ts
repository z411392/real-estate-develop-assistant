type 共同擔保建物 = {
    地段: string
    小段: string
    建號: string
}

type 共同擔保土地 = {
    地段: string
    小段: string
    地號: string
}

export type 建物他項權利 = {
    登記次序: string
    權利種類: string
    收件日期: string
    字號: string
    登記日期: string
    登記原因: string
    權利人: string | null
    統一編號: string | null
    住址: string | null
    債權額比例: string | null
    擔保債權總金額: string | null
    擔保債權種類及範圍: string | null
    擔保債權確定日期: string | null
    償還日期: string | null
    利息或利率: string | null
    遲延利息或利率: string | null
    違約金: number | null
    其他擔保範圍約定: string | null
    權利標的: string | null
    標的登記次序: string[]
    設定權利範圍: string | null
    證明書字號: string | null
    共同擔保土地: 共同擔保土地[]
    共同擔保建物: 共同擔保建物[]
    其他登記事項: string
}

export type 建物所有權 = {
    登記次序: string
    登記日期: string
    登記原因: string
    原因發生日期: string
    所有權人: string
    統一編號: string | null
    住址: string | null
    權利範圍: string | null
    權狀字號: string
    建物他項權利登記次序: string[]
    其他登記事項: string
}

type 主建物資料 = {
    地段: string
    小段: string
    建號: string
    權利範圍: string | null
}

type 共有部分 = {
    地段: string
    小段: string
    建號: string
    面積: string
    權利範圍: string | null
    其他登記事項: string
}

type 附屬建物 = {
    附屬建物類型: string
    面積: string
}

type 層次 = {
    層次: number
    層次面積: string
    總面積: string
}

type 建物坐落 = {
    地段: string
    小段: string
    地號: string
}

export type 建物標示 = {
    登記日期: string
    登記原因: string
    建物坐落: 建物坐落[]
    建物門牌: string
    主要用途: string
    主要建材: string
    層數: string
    層次: 層次[]
    附屬建物: 附屬建物[]
    建築完成日期: string
    共有部分: 共有部分[]
    主建物資料: 主建物資料[]
    其他登記事項: string
}

export type 建物謄本 = {
    列印時間: string
    列印公司: string
    謄本種類碼: string
    謄本編號: string
    謄本核發機關: string
    資料管轄機關: string
    行政區: string
    地段: string
    小段: string
    建號: string
    建物標示部: Array<建物標示 | null>
    建物所有權部: Array<建物所有權 | null>
    建物他項權利部: Array<建物他項權利 | null>
}
