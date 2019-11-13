/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * Parse the time to string
 * @param {(Object|string|number)} time
 * @param {string} cFormat
 * @returns {string}
 */
export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
      time = parseInt(time)
    }
    if ((typeof time === 'number') && (time.toString().length === 10)) {
      time = time * 1000
    }
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value ] }
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

/**
 * @param {number} time
 * @param {string} option
 * @returns {string}
 */
export function formatTime(time, option) {
  if (('' + time).length === 10) {
    time = parseInt(time) * 1000
  } else {
    time = +time
  }
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) {
    // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return (
      d.getMonth() +
      1 +
      '月' +
      d.getDate() +
      '日' +
      d.getHours() +
      '时' +
      d.getMinutes() +
      '分'
    )
  }
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
  const search = url.split('?')[1]
  if (!search) {
    return {}
  }
  return JSON.parse(
    '{"' +
      decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
      '"}'
  )
}

/**
 * @param {string} key
 * @param {number} value
 */
export function setLocal(key, value) {
  localStorage.setItem(key, value)
}

export function getLocal(key) {
  return +localStorage.getItem(key)
}

export function removeLocal(key) {
  localStorage.removeItem(key)
}

/**
 * @param {object} obj
 * @returns {Boolean}
 */
export function deepCopy(obj) {
  var result = Array.isArray(obj) ? [] : {}
  for (var key in obj) {
    if (obj.hasOwnProperty(key)) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result[key] = deepCopy(obj[key]) // 递归复制
      } else {
        result[key] = obj[key]
      }
    }
  }
  return result
}

export function getDefaultValue(item) {
  if (item.showType === 1) {
    return item.option
  }
  let value
  item.option.some((v) => {
    if (v.isDefault) {
      value = v.text
      return true
    }
  })
  return value
}

/**
 * @param {Array} arr
 * @returns {Object}
 */
export function formatOrderDetail(arr, jobName) {
  // 将工单分为1(工单参数),2(生产参数),3(自定义参数)三个部分
  const detailData = {}
  arr.forEach((item) => {
    if (item.type === 1 && item.name === '工单号') {
      item.value = jobName
    }
    if (detailData[item.type]) {
      detailData[item.type].push(item)
    } else {
      detailData[item.type] = [item]
    }
  })
  const keys = Object.keys(detailData)
  Object.values(detailData).forEach((option, i) => {
    const arr = []
    option.forEach((item) => {
      const value = getDefaultValue(item)
      item.value = item.value || value
      item.length = item.nameLength
      if (!arr[item.row - 1]) {
        arr[item.row - 1] = [item]
      } else {
        arr[item.row - 1].push(item)
      }
      // 复制一份同字段内容方便布局
      const copiedValueItem = { ...item, length: item.contentLength }
      arr[item.row - 1].push(copiedValueItem)
    })
    detailData[keys[i]] = arr
  })
  return detailData
}

/**
 * @description 多维数组转一维
 * @param {Array} arr
 * @returns {Array}
 */
export function flatArr(arr) {
  let res = []
  for (let i = 0; i < arr.length; i++) {
    if (Array.isArray(arr[i])) {
      res = res.concat(flatArr(arr[i]))
    } else {
      res.push(arr[i])
    }
  }
  return res
}
