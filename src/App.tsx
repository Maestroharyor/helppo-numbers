import useSWR from "swr";
import axios from "axios";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { xonokai } from "react-syntax-highlighter/dist/esm/styles/prism";
import { FaCircleNotch } from "react-icons/fa";

const fetcher = (url: string) => axios.post(url).then((res) => res.data);

const App: React.FC = () => {
  const apiEndpoint = import.meta.env.VITE_REACT_APP_API_ENDPOINT;
  console.log(apiEndpoint);
  const { data, error, isValidating, mutate, isLoading } = useSWR(
    apiEndpoint,
    fetcher,
    {
      refreshInterval: 10000, // Automatically revalidate every 10 seconds
    }
  );

  const handleDownload = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "numbers.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <div className="flex flex-col gap-7 justify-center items-center">
        <h1 className="text-4xl font-bold text-blue-700">
          Fetch Helppo Numbers Daily
        </h1>
        <button
          className={`px-4 py-2 bg-blue-500 text-white rounded-md mb-4 flex gap-3 items-center disabled:opacity-50`}
          onClick={() => mutate()}
          disabled={isValidating || isLoading}
        >
          {(isLoading || isValidating) && (
            <div className="animate-spin">
              <FaCircleNotch />
            </div>
          )}

          <span>
            {isValidating || isLoading
              ? "Fetching Numbers..."
              : "Fetch Numbers"}
          </span>
        </button>

        {error ? (
          <div className="text-red-500 mb-4">Error: {error.message}</div>
        ) : null}
      </div>

      {!data && !error && !isLoading && !isValidating && (
        <div>
          <p>No data gotten. Trying again shortly </p>
        </div>
      )}

      {!isLoading && !isValidating && (data || error) ? (
        <div className="overflow-auto max-w-[700px] ">
          <div className="border-4 border-slate-950 rounded mb-5">
            <SyntaxHighlighter
              language="json"
              style={xonokai}
              className=""
              showLineNumbers
            >
              {JSON.stringify(data || error, null, 2)}
            </SyntaxHighlighter>
          </div>

          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md"
            onClick={handleDownload}
            disabled={isValidating}
          >
            Download
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default App;
