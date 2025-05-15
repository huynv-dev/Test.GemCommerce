import { render, fireEvent, screen } from "@testing-library/react";
import { expect, it, describe } from "vitest";
import UnitValue from "../components/UnitValue";

function setup() {
  render(<UnitValue />);
  const input = screen.getAllByRole("textbox")[0];
  const percentBtn = screen.getAllByRole("button", { name: "%" })[0];
  const pxBtn = screen.getAllByRole("button", { name: "px" })[0];
  const minusBtn = screen.getAllByRole("button", { name: /−/ })[0];
  const plusBtn = screen.getAllByRole("button", { name: /\+/ })[0];
  return { input, percentBtn, pxBtn, minusBtn, plusBtn };
}

describe("UnitValue", () => {
  it("Unit mặc định là %", () => {
    const { percentBtn } = setup();
    expect(percentBtn).toHaveClass("bg-[#444]");
  });

  it("Cho phép nhập integer và float", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "12" } });
    expect(input).toHaveValue("12");
    fireEvent.change(input, { target: { value: "12.3" } });
    expect(input).toHaveValue("12.3");
  });

  it("Nhập dấu phẩy sẽ tự động thành dấu chấm", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "12,3" } });
    expect(input).toHaveValue("12.3");
  });

  it("Loại bỏ ký tự lạ, chỉ lấy phần số hợp lệ đầu tiên", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "123a" } });
    expect(input).toHaveValue("123");
    fireEvent.change(input, { target: { value: "12a3" } });
    expect(input).toHaveValue("12");
    fireEvent.change(input, { target: { value: "a123" } });
    expect(input).toHaveValue("");
  });

  it("Nhập < 0 và blur thì nhảy về 0", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "-5" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("0");
  });

  it("Unit %: nhập > 100 và blur thì nhảy về 100", () => {
    const { input } = setup();
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("100");
  });

  it("Unit %: input là 0 thì disable nút -", () => {
    const { input, minusBtn } = setup();
    fireEvent.change(input, { target: { value: "0" } });
    fireEvent.blur(input);
    expect(minusBtn).toBeDisabled();
  });

  it("Unit %: input là 100 thì disable nút +", () => {
    const { input, plusBtn } = setup();
    fireEvent.change(input, { target: { value: "100" } });
    fireEvent.blur(input);
    expect(plusBtn).toBeDisabled();
  });

  it("Switch từ px sang % và value > 100 thì update về 100", () => {
    const { input, pxBtn, percentBtn } = setup();
    fireEvent.click(pxBtn);
    fireEvent.change(input, { target: { value: "150" } });
    fireEvent.blur(input);
    expect(input).toHaveValue("150");
    fireEvent.click(percentBtn);
    expect(input).toHaveValue("100");
  });

  it("stepValue hoạt động đúng: +1, -1", () => {
    const { input, plusBtn, minusBtn } = setup();
    fireEvent.click(plusBtn);
    expect(input).toHaveValue("2");
    fireEvent.click(minusBtn);
    expect(input).toHaveValue("1");
  });
});