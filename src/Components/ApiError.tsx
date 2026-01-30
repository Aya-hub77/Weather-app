import { MdNotInterested } from "react-icons/md";
import { HiMiniArrowPath } from "react-icons/hi2";

type ApiErrorProps = {
  onRetry: () => void;
};

const ApiError = ({ onRetry }: ApiErrorProps) => {
   return (
      <section>
        <div className="text-white flex flex-col justify-center items-center p-5 gap-10 mt-[5%]">
            <MdNotInterested className="text-[50px] text-offWhite" />
            <h1 className="text-[50px] font-bold leading-tight font-gro text-center">Something went wrong</h1>
            <p className="text-[20px] text-center text-offWhite">We couldn't connect to the server (API error). Please try again in a few moments.</p>
            <button onClick={onRetry} className="flex flex-row items-center gap-2 text-[25px] bg-bgWhite py-2 px-4 rounded-[10px]"><HiMiniArrowPath className="text-[30px]" />Retry</button>
        </div>
      </section>
   )
}
export default ApiError