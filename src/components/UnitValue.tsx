import { useState, ChangeEvent } from "react";

export default function UnitValue() {
  const [unit, setUnit] = useState<"%" | "px">("%");
  const [value, setValue] = useState(1.0);
  const [inputValue, setInputValue] = useState("1.0");

  const handleUnitSwitch = (newUnit: "%" | "px") => {
    let newVal = value;
    if (newUnit === "%" && value > 100) newVal = 100;
    setUnit(newUnit);
    setValue(newVal);
    setInputValue(newVal.toString());
  };

  const sanitizeInput = (input: string): string => {
    // Thay tất cả dấu phẩy thành dấu chấm
    let cleaned = input.replace(/,/g, ".");

    // Tìm chuỗi số hợp lệ liên tiếp đầu tiên (có thể có dấu trừ ở đầu, có thể có dấu chấm)
    const match = cleaned.match(/^-?\d*\.?\d*/);
    if (match) {
      cleaned = match[0];
    } else {
      cleaned = "";
    }
    return cleaned;
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const sanitized = sanitizeInput(raw);
    setInputValue(sanitized);
    const parsed = parseFloat(sanitized);
    if (!isNaN(parsed)) setValue(parsed);
  };

  const stepValue = (delta: number) => {
    let newVal = value + delta;
    if (unit === "%" && newVal > 100) newVal = 100;
    if (newVal < 0) newVal = 0;
    setValue(newVal);
    setInputValue(newVal.toString());
  };
  const isSubDisabled = Number(inputValue) <= 0;
  const isAddDisabled = unit === "%" && Number(inputValue) >= 100;

  const handleBlur = () => {
    let finalVal = value;
    if (value < 0) finalVal = 0;
    if (unit === "%" && value > 100) finalVal = 100;
    setValue(finalVal);
    setInputValue(finalVal.toString());
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#181818] font-inter">
      <div className="bg-[#181818] flex flex-col gap-8 p-0 w-fit">
        {/* Unit row */}
        <div className="flex flex-row items-center gap-6">
          <div className="text-xs leading-5 font-medium text-[#AAA] tracking-[0] w-[90px] text-left font-inter">
            Unit
          </div>
          <div className="item flex bg-[#232323] rounded-[6px] p-1">
            <button
              onClick={() => handleUnitSwitch("%")}
              className={`w-full text-[#F9F9F9] cursor-pointer flex items-center justify-center rounded-[6px] text-xs leading-5 font-medium tracking-[0] font-inter transition-colors transition-border duration-150 border-none px-7 py-1 ${
                unit === "%"
                  ? "bg-[#444]"
                  : "hover:bg-[#232323]"
              }`}
            >
              %
            </button>
            <button
              onClick={() => handleUnitSwitch("px")}
              className={`w-full cursor-pointer text-[#F9F9F9] flex items-center justify-center rounded-[6px] text-xs leading-5 font-medium tracking-[0] font-inter transition-colors transition-border duration-150 border-none px-7 py-1 ${
                unit === "px"
                  ? "bg-[#444]"
                  : "hover:bg-[#232323]"
              }`}
            >
              px
            </button>
          </div>
        </div>
        {/* Value row */}
        <div className="flex flex-row items-center gap-6">
          <div className="text-xs leading-5 font-medium text-[#AAA] tracking-[0] w-[90px] text-left font-inter">
            Value
          </div>
          <div className="item flex bg-[#232323] rounded-[6px] p-0 items-center group value-group transition-colors duration-150">
            <div className="relative group">
              <button
                onClick={() => stepValue(-1)}
                disabled={isSubDisabled}
                className={`flex items-center justify-center rounded-l-[6px] text-xs leading-5 font-medium font-inter text-[#F9F9F9] transition-colors duration-150 hover:bg-[#444] px-4 py-2 ${isSubDisabled ? 'cursor-not-allowed text-[#666]' : 'cursor-pointer'}`}
                tabIndex={-1}
                type="button"
              >
                −
              </button>
              {isSubDisabled && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#222] text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 mt-2">
                  Value must greater than 0
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#222]" />
                </div>
              )}
            </div>

            <input
              type="text"
              value={inputValue}
              aria-label="unit-value-input"
              onChange={handleChange}
              onBlur={handleBlur}
              className="step-input text-center bg-transparent text-[#F9F9F9] text-xs leading-5 font-medium font-inter border-none outline-none py-2 m-w-[65px] group-input"
            />

            <div className="relative group">
              <button
                onClick={() => stepValue(1)}
                disabled={isAddDisabled}
                className={`flex items-center justify-center rounded-r-[6px] text-xs leading-5 font-medium font-inter text-[#F9F9F9] transition-colors duration-150 hover:bg-[#444] px-4 py-2 ${isAddDisabled ? 'cursor-not-allowed text-[#666]' : 'cursor-pointer'}`}
                type="button"
              >
                +
              </button>
              {isAddDisabled && (
                <div className="absolute -top-14 left-1/2 -translate-x-1/2 bg-[#222] text-white text-sm px-4 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition pointer-events-none z-10 mt-2">
                  Value must smaller than 100
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-[#222]" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
