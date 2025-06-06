import { HashLoader } from "react-spinners";

export default function Loading() {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-gray-50">
      <HashLoader />
    </div>
  );
}
