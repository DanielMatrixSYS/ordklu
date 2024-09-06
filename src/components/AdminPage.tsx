import Button from "./Button.tsx";
import AltButton from "./AltButton.tsx";
import { BsFiletypeJson } from "react-icons/bs";
import React, { useState } from "react";
import { FaSpinner } from "react-icons/fa";

const AdminPage = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [loaded, setLoaded] = useState<number>(0);
  const [fileName, setFileName] = useState<string>("");

  return (
    <div className="flex flex-col items-center w-full h-full p-6 space-y-10">
      <p className="text-5xl font-bold text-center bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-transparent bg-clip-text mb-6">
        OrdAdmin
      </p>

      <div className="flex flex-col items-center w-full">
        <div className="relative w-full max-w-md space-y-2">
          <p className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 via-blue-400 to-cyan-200 text-transparent bg-clip-text mb-2">
            Last opp ordliste
          </p>

          <div className="absolute inset-0 opacity-0 rounded-full">
            <input
              type="file"
              accept="application/JSON"
              className="w-full h-full cursor-pointer"
              onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
                if (!e.target.files) return;
                setLoading(true);

                const file = e.target.files[0];

                if (file.type !== "application/json") {
                  alert("Invalid file type!");
                  return;
                }

                setFileName(file.name);

                const fileReader = new FileReader();

                fileReader.onload = (e: ProgressEvent<FileReader>) => {
                  if (e.target && e.target.result) {
                    try {
                      const result = e.target.result;
                      if (!result) return;

                      const json = JSON.parse(result.toString());

                      console.log(json);
                      setLoading(false);
                      setFileName("");
                    } catch (error) {
                      alert("Invalid JSON file!");
                    }
                  }
                };

                fileReader.onprogress = (e) => {
                  if (e.lengthComputable) {
                    setLoaded((e.loaded / e.total) * 100);

                    if (e.loaded === e.total) {
                      console.log("Loading completed!");
                      setLoaded(0);
                    }

                    if (e.loaded === 0) {
                      console.log("Loading started!");
                    }
                  }
                };

                fileReader.readAsText(file);
              }}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Button
              disabled={loading}
              value={
                fileName
                  ? `Laster opp ${fileName} (${loaded})`
                  : "Velg fil for opplasting"
              }
              icon={<BsFiletypeJson />}
            />
            {fileName && (
              <FaSpinner className="animate-spin text-neutral-700" />
            )}
          </div>
        </div>

        <div className="flex flex-row w-full max-w-md ">
          <AltButton value="Fyll ut ordskjema selv" disabled={loading} />
        </div>

        <div className="flex flex-col items-center w-full max-w-md space-y-2 mt-10">
          <p className="text-3xl font-bold text-center bg-gradient-to-r from-teal-600 via-blue-400 to-cyan-200 text-transparent bg-clip-text mb-2">
            Globalt
          </p>

          <div className="flex flex-col items-center w-full space-y-4">
            <Button value="Se alle ord" disabled={loading} />
            <Button value="Se alle brukere" disabled={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
