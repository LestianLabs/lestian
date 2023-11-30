interface Props {
  authenticate: boolean | undefined;
}

export default function Authenticate(props: Props) {
  const { authenticate } = props;

  const handleClick = () => {
    window.ipc.send(
      "open-external",
      "https://discord.com/api/oauth2/authorize?client_id=1176730548618657792&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fauth&scope=identify"
    );
  };

  return (
    <div aria-label="content" className="mt-2 grid gap-2.5">
      <div className="flex items-center space-x-4 p-3.5 rounded-xl bg-slate-700">
        <span className="flex items-center justify-center w-10 h-10 shrink-0 rounded-full text-gray-900">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            fill="#cbd5e1"
            className="bi bi-discord"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M8 0c-.69 0-1.843.265-2.928.56-1.11.3-2.229.655-2.887.87a1.54 1.54 0 0 0-1.044 1.262c-.596 4.477.787 7.795 2.465 9.99a11.777 11.777 0 0 0 2.517 2.453c.386.273.744.482 1.048.625.28.132.581.24.829.24s.548-.108.829-.24a7.159 7.159 0 0 0 1.048-.625 11.775 11.775 0 0 0 2.517-2.453c1.678-2.195 3.061-5.513 2.465-9.99a1.541 1.541 0 0 0-1.044-1.263 62.467 62.467 0 0 0-2.887-.87C9.843.266 8.69 0 8 0m0 5a1.5 1.5 0 0 1 .5 2.915l.385 1.99a.5.5 0 0 1-.491.595h-.788a.5.5 0 0 1-.49-.595l.384-1.99A1.5 1.5 0 0 1 8 5"
            />
          </svg>
        </span>
        <div className="flex flex-col flex-1">
          <div className="text-sm font-medium text-gray-300">Authenticate</div>
        </div>
        {authenticate ? (
          <button
            type="button"
            className="rounded-full bg-emerald-400 px-1 py-1"
            disabled
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M10.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.267.267 0 0 1 .02-.022z" />
            </svg>
          </button>
        ) : (
          <button
            type="button"
            className="rounded-full bg-red-400 px-1 py-1 hover:bg-emerald-400"
            onClick={() => handleClick()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="white"
              viewBox="0 0 16 16"
            >
              <path d="M4 8a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7A.5.5 0 0 1 4 8" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
