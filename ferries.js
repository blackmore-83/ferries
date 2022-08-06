const puppeteer = require('puppeteer')
let ferries_array = []
let array = []
let i = 0
let k = 0

function get_dep(dep){
  if (dep=='JMK') {return 'Μύκονος'}
  else if (dep=='RAF') {return 'Ραφήνα'}
  else if (dep=='PIR') {return 'Πειραιάς'}
  else {return 'Άγνωστο'}
}

function sortFunction(a, b) {
    if (a[3] === b[3]) {
        return 0;
    }
    else {
        return (a[3] < b[3]) ? -1 : 1;
    }
}

function look_for_next_day_arrivals(ar){
  for (i=0; i < ar.length; i++)
    if (ar[i][2].charAt(0)=='2' && ar[i][3].charAt(0)=='0') {
      ar[i][3] = 'N'+ar[i][3].substring(1)
    }
  return ar
}

async function get_ferries(dep,arr,year,month,day) {

  const browser = await puppeteer.launch({})

  const page = await browser.newPage()
  await page.goto('https://www.ferryscanner.com/el/ferry/results#search/dep/'+dep+'/arr/'+arr+'/date/'+year+'-'+month+'-'+day+'/passengers/1/vehicles/0')

  const group = await page.waitForSelector(".group-legs")
  let groupchilds = await page.evaluate(group => group.innerText, group)
  groupchilds = groupchilds.replace("Fastest","")
  groupchilds = groupchilds.replace(/\s-\s/g,"\n")
  groupchilds = groupchilds.replace(/^\s*[\r\n]/gm,"")
  array = groupchilds.split(/\r\n|\r|\n/)

  l = 0;
  while (l < array.length){
    if (k == 0) {ferries_array[i]=[]}
    ferries_array[i][k] = array[l]
    k++
    l++
    if (k % 4 == 0){
      ferries_array[i][k] = get_dep(dep)
      i++
      l = l + 3
      k = 0
    }
  }


  browser.close()

}

async function get_all_ferries(arr,year,month,day){


  await get_ferries(dep = 'JMK', arr, year, month, day)
  await get_ferries(dep = 'RAF', arr, year, month, day)
  await get_ferries(dep = 'PIR', arr, year, month, day)

  ferries_array = look_for_next_day_arrivals(ferries_array)
  ferries_array.sort(sortFunction)

  console.table(ferries_array)

}

get_all_ferries(arr='TIN',year='2022',month='08',day='06')
