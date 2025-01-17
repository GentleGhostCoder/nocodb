import dayjs from 'dayjs'
import { UITypes } from 'nocodb-sdk'
import { getDateFormat, isoToDate } from '@/utils/dateTimeUtils'
import { isValidURL } from '@/utils/urlUtils'
const validateEmail = (v: string) =>
  /^(([^<>()[\].,;:\s@"]+(\.[^<>()[\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(v)
export const specialCharRegex = /[` ~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/g

const booleanOptions = [
  { checked: true, unchecked: false },
  { 'x': true, '': false },
  { yes: true, no: false },
  { y: true, n: false },
  { 1: true, 0: false },
  { '[x]': true, '[]': false, '[ ]': false },
  { '☑': true, '': false },
  { '✅': true, '': false },
  { '✓': true, '': false },
  { '✔': true, '': false },
  { enabled: true, disabled: false },
  { on: true, off: false },
  { 'done': true, '': false },
  { true: true, false: false },
]
const aggBooleanOptions: any = booleanOptions.reduce((obj, o) => ({ ...obj, ...o }), {})

const getColVal = (row: any, col?: number) => {
  return row && col !== undefined ? row[col] : row
}

export const isCheckboxType: any = (values: [], col?: number) => {
  let options = booleanOptions
  for (let i = 0; i < values.length; i++) {
    const val = getColVal(values[i], col)
    if (val === null || val === undefined || val.toString().trim() === '') {
      continue
    }
    options = options.filter((v) => val in v)
    if (!options.length) {
      return false
    }
  }
  return options
}

export const getCheckboxValue = (value: any) => {
  return value && aggBooleanOptions[value]
}

export const isMultiLineTextType = (values: [], col?: number) => {
  return values.some(
    (r) => (getColVal(r, col) || '').toString().match(/[\r\n]/) || (getColVal(r, col) || '').toString().length > 255,
  )
}

export const extractMultiOrSingleSelectProps = (colData: []) => {
  const maxSelectOptionsAllowed = 64
  const colProps: any = {}
  if (colData.some((v: any) => v && (v || '').toString().includes(','))) {
    const flattenedVals = colData.flatMap((v: any) =>
      v
        ? v
            .toString()
            .trim()
            .split(/\s*,\s*/)
        : [],
    )

    const uniqueVals = [...new Set(flattenedVals.map((v: any) => v.toString().trim()))]

    if (uniqueVals.length > maxSelectOptionsAllowed) {
      // too many options are detected, convert the column to SingleLineText instead
      colProps.uidt = UITypes.SingleLineText
      // _disableSelect is used to disable the <a-select-option/> in TemplateEditor
      colProps._disableSelect = true
    } else {
      // assume the column type is multiple select if there are repeated values
      if (flattenedVals.length > uniqueVals.length && uniqueVals.length <= Math.ceil(flattenedVals.length / 2)) {
        colProps.uidt = UITypes.MultiSelect
      }
      // set dtxp here so that users can have the options even they switch the type from other types to MultiSelect
      // once it's set, dtxp needs to be reset if the final column type is not MultiSelect
      colProps.dtxp = `${uniqueVals.map((v) => `'${v.replace(/'/gi, "''")}'`).join(',')}`
    }
  } else {
    const uniqueVals = [...new Set(colData.map((v: any) => v.toString().trim()))]

    if (uniqueVals.length > maxSelectOptionsAllowed) {
      // too many options are detected, convert the column to SingleLineText instead
      colProps.uidt = UITypes.SingleLineText
      // _disableSelect is used to disable the <a-select-option/> in TemplateEditor
      colProps._disableSelect = true
    } else {
      // assume the column type is single select if there are repeated values
      // once it's set, dtxp needs to be reset if the final column type is not Single Select
      if (colData.length > uniqueVals.length && uniqueVals.length <= Math.ceil(colData.length / 2)) {
        colProps.uidt = UITypes.SingleSelect
      }
      // set dtxp here so that users can have the options even they switch the type from other types to SingleSelect
      // once it's set, dtxp needs to be reset if the final column type is not SingleSelect
      colProps.dtxp = `${uniqueVals.map((v) => `'${v.replace(/'/gi, "''")}'`).join(',')}`
    }
    return colProps
  }
}

export const extractSelectOptions = (colData: [], type: UITypes.SingleSelect | UITypes.MultiSelect): { dtxp: string } => {
  const colProps: any = {}

  if (type === UITypes.MultiSelect) {
    const flattenedVals = colData.flatMap((v: any) =>
      v
        ? v
            .toString()
            .trim()
            .split(/\s*,\s*/)
        : [],
    )
    const uniqueVals = [...new Set(flattenedVals.map((v: any) => v.toString().trim()))]
    colProps.uidt = UITypes.MultiSelect
    colProps.dtxp = `${uniqueVals.map((v) => `'${v.replace(/'/gi, "''")}'`).join(',')}`
  } else {
    const uniqueVals = [...new Set(colData.map((v: any) => v.toString().trim()))]
    colProps.uidt = UITypes.SingleSelect
    colProps.dtxp = `${uniqueVals.map((v) => `'${v.replace(/'/gi, "''")}'`).join(',')}`
  }
  return colProps
}

export const isDecimalType = (colData: []) =>
  colData.some((v: any) => {
    return v && parseInt(v) !== +v
  })

export const isEmailType = (colData: [], col?: number) =>
  colData.some((r: any) => {
    const v = getColVal(r, col)
    return v && validateEmail(v)
  })

export const isUrlType = (colData: [], col?: number) =>
  colData.some((r: any) => {
    const v = getColVal(r, col)
    // convert to string since isURL only accepts string
    // and cell data value can be number or any other types
    return v && isValidURL(v)
  })

export const getColumnUIDTAndMetas = (colData: [], defaultType: string) => {
  const colProps = { uidt: defaultType }

  if (colProps.uidt === UITypes.SingleLineText) {
    // check for long text
    if (isMultiLineTextType(colData)) {
      colProps.uidt = UITypes.LongText
    }
    if (isEmailType(colData)) {
      colProps.uidt = UITypes.Email
    }
    if (isUrlType(colData)) {
      colProps.uidt = UITypes.URL
    } else {
      const checkboxType = isCheckboxType(colData)
      if (checkboxType.length === 1) {
        colProps.uidt = UITypes.Checkbox
      } else {
        Object.assign(colProps, extractMultiOrSingleSelectProps(colData))
      }
    }
  } else if (colProps.uidt === UITypes.Number) {
    if (isDecimalType(colData)) {
      colProps.uidt = UITypes.Decimal
    }
  }
  // TODO(import): currency
  // TODO(import): date / datetime
  return colProps
}

export const filterNullOrUndefinedObjectProperties = <T extends Record<string, any>>(obj: T): T => {
  return Object.keys(obj).reduce((result, propName) => {
    const value = obj[propName]

    if (value !== null && value !== undefined) {
      if (!Array.isArray(value) && typeof value === 'object') {
        // Recursively filter nested objects
        result[propName] = filterNullOrUndefinedObjectProperties(value)
      } else {
        result[propName] = value
      }
    }

    return result
  }, {} as Record<string, any>) as T
}

export const isDecimalVal = (vals: any[], limitRows: number) =>
  vals.slice(0, limitRows).some((v) => !v[1].w || v[1].v?.toString().includes('.'))

export const isCurrencyVal = (vals: any[], limitRows: number) =>
  vals.slice(0, limitRows).every((v) => !v[1].w || v[1].w?.toString().includes('$'))

export const isPercentageVal = (vals: any[], limitRows: number) =>
  vals.slice(0, limitRows).every((v) => !v[1].w || v[1].w?.toString().includes('%'))

export const isMultiLineTextVal = (vals: any[], limitRows: number) =>
  isMultiLineTextType(vals.slice(0, limitRows).map((v: any) => v[1].v) as [])

export const isMultiOrSingleSelectVal = (vals: any[], limitRows: number, column: Record<string, any>) => {
  // TODO: optionally add '.map((v: any) => v[1].w.replace('\\', '_')) as []' to prevent encoding error for mysql set / enum
  const props = extractMultiOrSingleSelectProps(vals.map((cell: any) => cell[1].w) as [])
  if (!props) return false
  Object.assign(column, props)
  return true
}

export const isEmailVal = (vals: any[], limitRows: number) => isEmailType(vals.slice(0, limitRows).map((v: any) => v[1].v) as [])

export const isUrlVal = (vals: any[], limitRows: number) => isUrlType(vals.slice(0, limitRows).map((v: any) => v[1].v) as [])

export const isCheckboxVal = (vals: any[], limitRows: number) =>
  isCheckboxType(vals.slice(0, limitRows).map((v: any) => v[1].v) as []).length === 1

export const isNumberVal = (vals: any[], limitRows: number) =>
  isUrlType(
    vals
      .slice(0, limitRows)
      .map((v: any) => isNaN(v[1].w) || (v[1].w && !isNaN(Number(v[1].w)) && isNaN(parseFloat(v[1].w)))) as [],
  )

export const isIsoDateVal = (vals: any[], limitRows: number) => vals.slice(0, limitRows).every((v) => isoToDate(v[1].w))

export const defaultFormatter = (cell: any, defaultVal: any = null) => cell.v || defaultVal

export const decimalFormatter = (cell: any, defaultVal = 0.0) => parseFloat(cell.v) || defaultVal

export const numberFormatter = (cell: any, defaultVal = 0) => parseInt(cell.v) || defaultVal

export const defaultRawFormatter = (cell: any, defaultVal: any = null) => cell.w || defaultVal

export const dateFormatter = (cell: any, format: string, defaultVal: Date | null = null) =>
  cell.v ? dayjs(cell.v).format(format) : defaultVal

export const dateTimeFormatter = (cell: any, defaultVal: Date | null = null) => cell.v || defaultVal

export const checkBoxFormatter = (cell: any, defaultVal: boolean | null = null) => getCheckboxValue(cell.v) || defaultVal

export const currencyFormatter = (cell: any, defaultVal: string | null = null) => cell.w?.replace(/[^\d.]+/g, '') || defaultVal

export const percentFormatter = (cell: any, defaultVal: string | null = null) =>
  parseFloat(cell.w?.slice(0, -1)) / 100 || defaultVal

export const multiOrSingleSelectFormatter = (cell: any, defaultVal: string | null = null) =>
  cell.w?.replace('\\', '_').trim() || defaultVal

export const isAllDate = (vals: any[], column: Record<string, any>) => {
  const dateFormats: Record<string, number> = {}
  const isOnlyDate = vals.every(([_, cell]) => {
    // TODO: more date types and more checks!
    const onlyDate = !cell.w || cell.w?.split(' ').length === 1
    if (onlyDate) {
      const format = getDateFormat(cell.w)
      dateFormats[format] = (dateFormats[format] || 0) + 1
    }
    return onlyDate
  })
  if (isOnlyDate) {
    column.uidt = UITypes.Date
    // take the date format with the max occurrence
    column.meta.date_format = Object.keys(dateFormats).reduce((x, y) => (dateFormats[x] > dateFormats[y] ? x : y)) || 'YYYY/MM/DD'
    return isOnlyDate
  }

  column.uidt = UITypes.DateTime
  return isOnlyDate
}

export function findMaxOccurrence(arr: number[]): number {
  const occurrenceMap = new Map<number, number>()

  // Count the occurrences of each value in the array
  arr.forEach((val) => {
    if (occurrenceMap.has(val)) {
      occurrenceMap.set(val, occurrenceMap.get(val)! + 1)
    } else {
      occurrenceMap.set(val, 1)
    }
  })

  // Find the value with the maximum occurrence
  let maxVal = 0
  let maxOccurrence = 0
  occurrenceMap.forEach((occurrence, val) => {
    if (occurrence > maxOccurrence) {
      maxVal = val
      maxOccurrence = occurrence
    }
  })

  return maxVal
}
