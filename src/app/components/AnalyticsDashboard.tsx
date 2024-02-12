"use client";
import { analytics } from "@/utils/analytcs";
import { BarChart, Card } from "@tremor/react";
import { ArrowDownRight, ArrowRight, ArrowUpRight } from "lucide-react";
import ReactCountryFlag from "react-country-flag";
interface AnalyticsDashboardProps {
  avgVisitorsPerDay: string;
  avgVisitorsPerTody: number;
  timeSersPagViws: Awaited<ReturnType<typeof analytics.retrieveDays>>;
  topcontries:[string,number][]
}

const AnalyticsDashboard = ({
  avgVisitorsPerDay,
  avgVisitorsPerTody,
  timeSersPagViws,
  topcontries
}: AnalyticsDashboardProps) => {
    const Badge = ({percentage}:{percentage:number}) =>{
     const isPositive = percentage > 0
     const isNeutral = percentage === 0
     const isNegative = percentage < 0

     const positiveClassName = "bg-green-900/25 text-green-400 ring-green-400/25"
     const neutralClassName = "bg-zinc-900/25 text-zinc-400 ring-zinc-400/25"
     const NegativeClassName ="bg-red-900/25 text-red-400 ring-red-400/25"

     if(isNaN(percentage)) return null

     return(
        <span className={` inline-flex gap-1 items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset${isPositive ? positiveClassName : isNeutral? neutralClassName : NegativeClassName}`}>
         {isPositive ? <ArrowUpRight className="h-3 w-3"/> : null}
         {isNeutral ? <ArrowRight className="h-3 w-3"/> : null}
         {isNegative ? <ArrowDownRight className="h-3 w-3"/> : null}
         {percentage.toFixed(0)}%
        </span>
     )
    }
  return (
    <div className='flex flex-col gap-6  overflow-y-hidden'>
      <div className='grid w-full mx-auto grid-cols-1 sm:grid-cols-2 gap-6'>
        <Card className='w-full mx-auto max-w-X5'>
          <p className='text-tremor-default text-dark-tremor-content'>
            Avg. visitors/day
          </p>
          <p className='text-3xl text-dark-tremor-content-strong font-semibold'>
            {avgVisitorsPerDay}
          </p>
        </Card>
        <Card className='w-full mx-auto max-w-X5'>
          <p className='flex gap-2.5 text-tremor-default text-dark-tremor-content'>
            visitors today
            <Badge percentage={(avgVisitorsPerTody / Number(avgVisitorsPerDay)-1) * 100 }/>
          </p>
          <p className='text-3xl text-dark-tremor-content-strong font-semibold'>
            {avgVisitorsPerTody}
          </p>
        </Card>
        </div>
        <Card className="flex flex-col sm:grid grid-cols-4 gap-6">
         <h2 className="w-full text-dark-tremor-content-strong text-center sm:text-left font-semibold text-xl">
            Top Weeks top Visitors:
         </h2>
         <div className="col-span-3 flex items-center justify-between flex-wrap gap-8">
          {topcontries?.map(([countryCode,number]) =>{
            return <div key={countryCode} className="flex items-center gap-3 text-dark-tremor-content-strong">
              <p className="hidden sm:block text-tremor-content">
                {countryCode}
              </p>
              <ReactCountryFlag className="text-5xl sm:text-3xl" svg countryCode={countryCode}/>
              <p className="sm:text-dark-tremor-content-strong text-tremor-content">{number}</p>
            </div>
          })}
         </div>
        </Card>
        <Card>
          {timeSersPagViws ? (
            <BarChart
              allowDecimals={false}
              showAnimation
              data={timeSersPagViws.map((day) => ({
                name:day.date,
                visitors:day.event.reduce((acc,curr) =>{
                     return acc + Object.values(curr)[0]!
                },0),
              }))
            }
            categories={["visitors"]}
            index="name"
            />
          ) : null}
        </Card>
  
    </div>
  );
};

export default AnalyticsDashboard;
