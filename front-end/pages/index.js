export default function Home() {
  return (
    <div className="mt-24 px-32">
      <div>
        <h1 className="text-3xl font-semibold">Generate Proof</h1>
        <p className="text-sm opacity-75">Generate proof before login!</p>

        <input className="mt-4 w-full bg-gray-100 p-3 outline-none" placeholder="enter your secret..." />
        <button className="bg-blue-400 text-white w-full py-3 mt-2 cursor-pointer hover:bg-blue-500 transition-all duration-300">generate proof!</button>
      </div>
      
    </div>
  );
}
