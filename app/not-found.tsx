
const NotFound = () => {
  return (
    <>
      {/* <div className="flex flex-col items-center justify-center p-5 m-5 gap-10">
      <h1 className="text-6xl font-bold text-red-400">Page Not Found</h1>
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>
      </div> */}

      <div className="flex flex-col items-center justify-center p-5 m-5">
        {/* Skeleton Loader on Top */}
        <div className="flex w-52 flex-col gap-4">
          <div className="skeleton h-32 w-full"></div>
          <div className="skeleton h-4 w-28"></div>
          <div className="skeleton h-4 w-full"></div>
          <div className="skeleton h-4 w-full"></div>
        </div>

        {/* Heading Below */}
        <h1 className="text-5xl font-bold pt-10 pb-3">Page Not Found</h1>
        <h3 className="text-1xl text-amber-100">This Web Page is under development</h3>

      </div>




    </>
  )
}

export default NotFound
