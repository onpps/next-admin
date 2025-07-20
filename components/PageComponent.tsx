interface PageComponentProps {
  serverData: {
    prev: boolean;
    next: boolean;
    current: number;
    prevPage: number;
    nextPage: number;
    pageNumList: number[];
  };
  movePage: (params: { page: number }) => void;
}

const PageComponent = ({ serverData, movePage }: PageComponentProps) => {
  return (
    <div className="w-full flex justify-center items-center my-6">
      <div className="flex gap-2">
        {serverData.prev && (
          <div
            className="p-2 w-16 text-center font-bold text-blue-400 cursor-pointer"
            onClick={() => movePage({ page: serverData.prevPage })}
          >
            Prev
          </div>
        )}

        {serverData.pageNumList.map((pageNum) => (
          <div
            key={pageNum}
            className={`p-2 w-12 text-center rounded shadow-md cursor-pointer text-white ${
              serverData.current === pageNum ? 'bg-gray-500' : 'bg-blue-400'
            }`}
            onClick={() => movePage({ page: pageNum })}
          >
            {pageNum}
          </div>
        ))}

        {serverData.next && (
          <div
            className="p-2 w-16 text-center font-bold text-blue-400 cursor-pointer"
            onClick={() => movePage({ page: serverData.nextPage })}
          >
            Next
          </div>
        )}
      </div>
    </div>
  );
};

export default PageComponent;
