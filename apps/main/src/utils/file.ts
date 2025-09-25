import Excel from 'exceljs'

// 读取Excel,结果返回json数组实际上是一个二维数据，可以自行处理，较为灵活
export const readExcelJson = async (file: File, sheetIndex = 0) => {
  const workbook = new Excel.Workbook()
  
  // 修复：将 File 转换为 ArrayBuffer 以支持多次读取
  const arrayBuffer = await file.arrayBuffer()
  
  // 使用 arrayBuffer 读取 Excel 文件
  await workbook.xlsx.load(arrayBuffer)
  
  const sheet = workbook.worksheets[sheetIndex]
  const data: string[][] = []

  // 分别遍历行和列，取出里面的信息
  sheet.eachRow((row) => {
    const list: string[] = []
    row.eachCell((cell) => {
      list.push(cell.value?.toString() || '')
    })
    data.push(list)
  })

  return data
}