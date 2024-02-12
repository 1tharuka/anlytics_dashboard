import { analytics } from "@/utils/analytcs";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import { getDate } from "@/utils";

const page = async () => {
  const TRACKING_DAY = 7
  const pageview = await analytics.retrieveDays('pageview',TRACKING_DAY);

  const totalPageView = pageview.reduce((acc, curr) =>{
    return (
      acc + curr.event.reduce((acc,curr) =>{
       return acc + Object.values(curr)[0]!
      },0)
    )
  },0)
  const avgVisitorsPerDay = (totalPageView / TRACKING_DAY).toFixed(1)
  const amtVisitorsToday = pageview
    .filter((ev) => ev.date === getDate())
    .reduce((acc, curr) => {
      return (
        acc +
        curr.event.reduce((acc, curr) => acc + Object.values(curr)[0]!, 0)
      )
    }, 0)
    const topcontriesMap = new Map<string,number>()
    for (let i = 0; i < pageview.length; i++) {
      const day = pageview[i];

      if(!day) continue

      for (let i = 0; i < day.event.length; i++) {
        const event = day.event[i];
        if(!event) continue

        const KEY = Object.keys(event)[0]!
        const value = Object.values(event)[0]!
        
        const parsedKey = JSON.parse(KEY)
        const country = parsedKey?.country


        if(country){
          if(topcontriesMap.has(country)){
            const prevValue = topcontriesMap.get(country)!
            topcontriesMap.set(country,prevValue + value)
          }else{
            topcontriesMap.set(country,value)
          }
        }
      }
    }
    const topcontries = [...topcontriesMap.entries()].sort((a,b) => {
      if(a[1] > b[1]) return -1
      else return 1
    }).slice(0,10)
  return (
    <div className='min-h-screen w-full py-6 flex justify-center items-center'>
      <div className='relative w-full max-w-6xl mx-auto text-white'>
        <AnalyticsDashboard 
        avgVisitorsPerDay={avgVisitorsPerDay}
        avgVisitorsPerTody={amtVisitorsToday}
        timeSersPagViws={pageview}
        topcontries={topcontries}
        />
      </div>
    </div>
  );
};

export default page;
