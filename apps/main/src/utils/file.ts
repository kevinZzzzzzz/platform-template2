import Excel from 'exceljs'
import { Stream } from 'stream'

//读取Excel,结果返回json数组实际上是一个二维数据，可以自行处理，较为灵活
export const readExcelJson = async (file: File, sheetIndex = 0) => {
  const workbook = new Excel.Workbook()
  //是可以读取buff等信息的
  await workbook.xlsx.read(file.stream() as any)
  const sheet = workbook.worksheets[sheetIndex]
  const data: string[][] = []
  //分别遍历行和列，取出里面的信息
  sheet.eachRow((row) => {
    const list: string[] = []
    row.eachCell((cell) => {
      list.push(cell.value?.toString() || '')
    })
    data.push(list)
  })
  return data
}