import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const auth = vi.hoisted(() => ({
  isAuthenticated: vi.fn(() => true),
  getToken: vi.fn(() => "tok"),
  getUser: vi.fn(() => ({ user_id: "u1", email: "a@b.co" })),
  login: vi.fn(),
}));
vi.mock("./auth", () => auth);

import { validatePromoCode, createPaymentTransaction } from "./payment";

const reply = (status: number, body: unknown) =>
  Promise.resolve({ ok: status < 400, status, json: () => Promise.resolve(body) } as Response);

describe("promo codes at checkout", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    auth.isAuthenticated.mockReturnValue(true);
    vi.stubGlobal("fetch", fetchMock);
    fetchMock.mockReset();
  });
  afterEach(() => vi.unstubAllGlobals());

  it("asks the service to price the code and maps the quote", async () => {
    fetchMock.mockReturnValue(
      reply(200, {
        success: true, valid: true, code: "SAVE20", list_usd: 99, discount_usd: 19.8,
        final_usd: 79.2, final_idr: 1267200,
      })
    );
    const result = await validatePromoCode("business", "SAVE20");

    expect(result).toEqual({
      valid: true,
      quote: { code: "SAVE20", listUsd: 99, discountUsd: 19.8, finalUsd: 79.2, finalIdr: 1267200 },
    });
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toContain("/api/v1/payments/promo/validate");
    expect(JSON.parse(init.body)).toEqual({ code: "SAVE20", product: "business" });
    expect(init.headers.Authorization).toBe("Bearer tok");
  });

  it("surfaces the service's reason for a refused code", async () => {
    fetchMock.mockReturnValue(
      reply(200, { success: false, valid: false, reason: "expired", error: "That promo code has expired." })
    );
    expect(await validatePromoCode("business", "OLD")).toEqual({
      valid: false,
      error: "That promo code has expired.",
    });
  });

  it("does not call the service when signed out", async () => {
    auth.isAuthenticated.mockReturnValue(false);
    const result = await validatePromoCode("business", "SAVE20");
    expect(result.valid).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends the code on order creation, and never an amount", async () => {
    fetchMock.mockReturnValue(reply(200, { success: true, token: "t", order_id: "o1" }));
    await createPaymentTransaction("business", undefined, "SAVE20");

    const body = JSON.parse(fetchMock.mock.calls[0][1].body);
    expect(body.promo_code).toBe("SAVE20");
    expect(body).not.toHaveProperty("amount");
  });

  it("reads a rejected code's message instead of printing [object Object]", async () => {
    fetchMock.mockReturnValue(
      reply(400, { detail: { error: "You've already used this promo code.", promo_error: "already_used" } })
    );
    await expect(createPaymentTransaction("business", undefined, "SAVE20")).rejects.toThrow(
      "You've already used this promo code."
    );
  });
});
