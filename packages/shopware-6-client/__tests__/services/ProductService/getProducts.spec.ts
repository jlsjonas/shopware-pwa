import { getProducts } from "@shopware-pwa/shopware-6-client";
import { defaultInstance } from "../../../src/apiService";
import { Sort } from "@shopware-pwa/commons/interfaces/search/SearchCriteria";
const consoleWarnSpy = jest.spyOn(console, "warn");

jest.mock("../../../src/apiService");
const mockedApiInstance = defaultInstance as jest.Mocked<
  typeof defaultInstance
>;
describe("ProductService - getProducts", () => {
  const mockedPost = jest.fn();
  beforeEach(() => {
    jest.resetAllMocks();
    mockedApiInstance.invoke = {
      post: mockedPost,
    } as any;
    consoleWarnSpy.mockImplementation(() => {});
  });
  it("should return array of products (default amount of 10)", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { total: 3, data: [1, 2, 3] },
    });

    const result = await getProducts();
    expect(result.total).toEqual(3);
    expect(result.data).toHaveLength(result.total);
    expect(mockedPost).toBeCalledTimes(1);
  });
  it("should invoke api with limit", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { total: 3, data: [1, 2, 3] },
    });
    const pagination = {
      page: 1,
      limit: 5,
    };
    await getProducts({ pagination });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/sales-channel-api/v3/product", {
      limit: 5,
      page: 1,
    });
  });
  it("should invoke api with limit and sort", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { total: 3, data: [1, 2, 3] },
    });
    const pagination = {
      page: 1,
      limit: 75,
    };
    const sort: Sort = {
      field: `name`,
      desc: true,
    };
    await getProducts({ pagination, sort });
    expect(mockedPost).toBeCalledTimes(1);
    expect(mockedPost).toBeCalledWith("/sales-channel-api/v3/product", {
      limit: 75,
      page: 1,
      sort: "-name",
    });
  });
  it("should show deprecation info on this method", async () => {
    mockedPost.mockResolvedValueOnce({
      data: { total: 3, data: [1, 2, 3] },
    });
    await getProducts();
    expect(consoleWarnSpy).toBeCalledWith(
      '[DEPRECATED][@shopware-pwa/shopware-6-client][getProducts] This method has been deprecated. Use "getCategoryProductsListing" instead.'
    );
  });
});
