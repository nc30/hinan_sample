// 何もしない関数(connect用)
export const EmptyFnc = () => ({})

// 数字として扱えるかどうか
export const isNumeric = (n: string | undefined): boolean =>
  n !== undefined && (n === '0' || !!Number(n))

// 空かどうか(null,undefined,[])
export const isEmpty = (n: any): boolean =>
  n === null || n === undefined || (n.length !== undefined && n.length === 0)

// HTTPクエリを取得
export const getQuery = (q: string): string | null => {
  const sp = new URL(window.location.href).searchParams
  return sp.has(q) ? sp.get(q) : null
}

export const loadJson = async (path: string) => loadJsonLaw(path)
export const loadJsonLaw = async (path: string) => {
  const a = await fetch(path)
  return a.json()
}
