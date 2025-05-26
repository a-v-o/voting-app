import CreateElection from "@/components/CreateElection";

export default async function Page() {
  return (
    <div className="w-full h-full flex flex-col gap-4 justify-center items-center">
      <CreateElection />
    </div>
  );
}
