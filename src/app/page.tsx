import Link from "next/link";
export default function Home() {
  return (
   <div>
    <h1 className="flex text-white ">This is Home Page</h1>
    <button>
      <Link href="../analiytics" className="w-full text-amber-50">DASHBOARD</Link>
    </button>
   </div>
  );
}
