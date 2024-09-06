import { useNavigate } from "react-router-dom";

const MainMenu = () => {
  const navigate = useNavigate();

  return (
    <div className="flex bg-gradient-to-t from-pink-100 to-pink-50 flex-col items-center w-full h-full">
      <div className="flex flex-col mt-4">
        <div className="flex flex-col">
          <h1 className="text-3xl/10 text-center text-neutral-700">
            Er du klar for dagens
          </h1>

          <h1 className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text">
            Ordklu?
          </h1>
        </div>

        <div className="flex items-center flex-col mt-4 space-y-1">
          <p className="flex items-center text-xs text-center">
            <span className="text-lg text-neutral-700 mr-1">10 324</span>
            personer har allerede prøvd seg!
          </p>
          <p className="flex items-center text-xs text-center">
            Bare <span className="text-lg text-green-700 mx-1">1 871</span>
            har klart det! 😬
          </p>
        </div>
      </div>

      <div className="flex flex-col items-center mt-28 w-full">
        <button
          className="px-8 w-2/3 sm:w-96 py-2 bg-blue-500 text-white rounded-full hover:scale-105 transition-all duration-300"
          onClick={() => navigate("/game")}
        >
          Gjett nå!
        </button>

        <button
          className="px-8 py-2 w-2/3 sm:w-96 border border-blue-700 text-sm text-blue-700 active:bg-blue-300 rounded-full bg-transparent mt-4 hover:scale-105 transition-all duration-300"
          onClick={() => alert("Not implemented yet!")}
        >
          Sjekk ut resultattavla
        </button>

        <button
          className="px-8 py-2 w-2/3 sm:w-96 border border-blue-700 text-sm text-blue-700 active:bg-blue-300 rounded-full bg-transparent mt-4 hover:scale-105 transition-all duration-300"
          onClick={() => alert("Not implemented yet!")}
        >
          Sett opp regler selv
        </button>
      </div>
    </div>
  );
};

export default MainMenu;
