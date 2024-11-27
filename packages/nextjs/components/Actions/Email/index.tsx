import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

export const SubscribeForm = () => {
  return (
    <form className="bg-white bg-opacity-10 rounded-[50px] overflow-hidden text-white flex flex-grow items-center mt-6 md:max-w-[500px]">
      <input
        name="email"
        className="bg-transparent py-4 px-5 placeholder:text-lg placeholder:text-white placeholder:text-opacity-80 focus:outline-none grow"
        type="email"
        placeholder="Enter email"
        required
      />
      <button className="text-xl font-semibold duration-500 hover:text-blue-600 mr-7">
        <PaperAirplaneIcon className="w-8 h-8 opacity-60" />
      </button>
    </form>
  );
};
