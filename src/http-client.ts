import {
  ApiConfig,
  ResponseRoot,
  StatusResponse,
  TickerResponse,
  OrderBooksResponse,
  TradesResponse,
  AccountMarginResponse,
  AccountAssetsResponse,
  OrdersResponse,
  Symbol,
  ActiveOrdersResponse,
  ExecutionsResponse,
  LatestExecutionsResponse,
  LeverageSymbol,
  OpenPositionsResponse,
  PositionSummaryResponse,
  OrderRequest,
  OrderResponse,
  ChangeOrderRequest,
  CancelOrderRequest,
  CancelOrdersRequest,
  CancelOrdersResponse,
  CancelBulkOrderRequest,
  CloseOrderRequest,
  CloseOrderResponse,
  CloseBulkOrderRequest,
  CloseBulkOrderResponse,
  ArrowedHttpMethod,
  HttpHeader,
} from './types';
import { makeAuthHeader } from './utils';
import { httpPublicEndPoint, httpPrivateEndPoint } from './constants';

const defaultTimeout = 3000;

export class GmoCoinApi {
  private readonly endPoints: {
    public: string;
    private: string;
  } = {
    public: httpPublicEndPoint,
    private: httpPrivateEndPoint,
  };
  private readonly timeout!: number;
  private readonly apiKey?: string;
  private readonly secretKey?: string;

  constructor(config: ApiConfig) {
    if (config.endPoints) {
      this.endPoints = config.endPoints;
    }
    this.timeout = config.timeout || defaultTimeout;
    this.apiKey = config.apiKey;
    this.secretKey = config.secretKey;
  }

  /**
   * Gets the service status of GMO Coin..
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#status | Service Status}
   */
  async getStatus() {
    return this.get<StatusResponse>('/v1/status');
  }

  /**
   * Gets the latest rates of the specified symbol.
   * If you want to get all symbols' rates, we recommend calling out it without a symbol.
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#ticker | Ticker}
   */
  async getTicker(params: { symbol?: Symbol }) {
    return this.get<TickerResponse>('/v1/ticker', params);
  }

  /**
   * Gets an order book (snapshot) of the specified symbol.
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#orderbooks | Order Books}
   */
  async getOrderBooks(params: { symbol: Symbol }) {
    return this.get<OrderBooksResponse>('/v1/orderbooks', params);
  }

  /**
   * Gets a trade history of the specified symbol.
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#trades | Trade History}
   */
  async getTrades(params: { symbol: Symbol; page?: number; count?: number }) {
    return this.get<TradesResponse>('/v1/trades', params);
  }

  /**
   * Gets information of trading capacity.
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#margin | Margin}
   */
  async getAccountMargin() {
    return this.getWithAuth<AccountMarginResponse>('/v1/account/margin');
  }

  /**
   * Retrieves asset data.
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#assets | Assets}
   */
  async getAccountAsset() {
    return this.getWithAuth<AccountAssetsResponse>('/v1/account/assets');
  }

  /**
   * Gets the specified order id's order information.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#orders | Orders}
   */
  async getOrders(params: { orderId: string }) {
    return this.getWithAuth<OrdersResponse>('/v1/orders', params);
  }

  /**
   * Gets active orders list of the specified symbol.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#active-orders | Active Orders}
   */
  async getActiveOrders(params: { symbol: Symbol; page?: number; count?: number }) {
    return this.getWithAuth<ActiveOrdersResponse>('/v1/activeOrders', params);
  }

  /**
   * Gets executed order information of the specified order id or execution id.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#executions | Executions}
   */
  async getExecutions(params: { orderId?: number; executionId?: string }) {
    return this.getWithAuth<ExecutionsResponse>('/v1/executions', params);
  }

  /**
   * Gets the latest executed order information.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#latest-executions | Latest Executions}
   */
  async getLatestExecutions(params: { symbol: Symbol; page?: number; count?: number }) {
    return this.getWithAuth<LatestExecutionsResponse>('/v1/latestExecutions', params);
  }

  /**
   * Gets a list of opened positions.
   * Target: Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#open-positions | Open Positions}
   */
  async getOpenPositions(params: { symbol: LeverageSymbol; page?: number; count?: number }) {
    return this.getWithAuth<OpenPositionsResponse>('/v1/openPositions', params);
  }

  /**
   * Gets a list of the position summary.
   * Target: Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#position-summary | Position Summary}
   */
  async getPositionSummary(params: { symbol: LeverageSymbol }) {
    return this.getWithAuth<PositionSummaryResponse>('/v1/positionSummary', params);
  }

  /**
   * Creates a new order.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#order | Order}
   */
  async postOrder(params: OrderRequest) {
    return this.postWithAuth<OrderResponse>('/v1/order', params);
  }

  /**
   * Changes an order.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#change-order | Change Order}
   */
  async postChangeOrder(params: ChangeOrderRequest) {
    return this.postWithAuth<undefined>('/v1/changeOrder', params);
  }

  /**
   * Cancels an order.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#cancel-order | Cancel Order}
   */
  async postCancelOrder(params: CancelOrderRequest) {
    return this.postWithAuth<undefined>('/v1/cancelOrder', params);
  }

  /**
   * Cancels multiple order.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/#cancel-orders | Cancel Order}
   */
  async postCancelOrders(params: CancelOrdersRequest) {
    return this.postWithAuth<CancelOrdersResponse>('/v1/cancelOrders', params);
  }

  /**
   * Cancels multiple order.
   * Target: Spot and Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/#cancel-bulk-order | Cancel Order}
   */
  async postCancelBulkOrder(params: CancelBulkOrderRequest) {
    return this.postWithAuth<number[]>('/v1/cancelBulkOrder', params);
  }

  /**
   * Closes a position.
   * Target: Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#close-order | Close Order}
   */
  async postCloseOrder(params: CloseOrderRequest) {
    return this.postWithAuth<CloseOrderResponse>('/v1/closeOrder', params);
  }

  /**
   * Closes bulk orders.
   * Target: Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#close-bulk-order | Close Bulk Order}
   */
  async postCloseBulkOrder(params: CloseBulkOrderRequest) {
    return this.postWithAuth<CloseBulkOrderResponse>('/v1/closeBulkOrder', params);
  }

  /**
   * Changes the margin call rate of the specified position.
   * Target: Margin trading
   *
   * @remarks
   * API Docs: {@link https://api.coin.z.com/docs/en/#change-losscut-price | Change Margin Call Rate}
   */
  async postChangeLosscutPrice(params: { positionId: number; losscutPrice: string }) {
    return this.postWithAuth<undefined>('/v1/changeLosscutPrice', params);
  }

  private async get<T>(path: string, params?: {}) {
    return this.request<T>(this.endPoints.public, 'GET', path, params);
  }

  private async getWithAuth<T>(path: string, params?: {}) {
    return this.requestWithAuth<T>(this.endPoints.private, 'GET', path, params);
  }

  private async postWithAuth<T>(path: string, data?: {}) {
    return this.requestWithAuth<T>(this.endPoints.private, 'POST', path, {}, data);
  }

  private async request<T>(baseUrl: string, method: ArrowedHttpMethod, path: string, params?: {}, data?: {}, headers?: HttpHeader) {
    const url = new URL(baseUrl + path);

    if (params && Object.keys(params).length > 0) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    const fetchHeaders: HeadersInit = {
      'Content-Type': 'application/json',
      ...headers,
    };

    const options: RequestInit = {
      method,
      headers: fetchHeaders,
      body: data && Object.keys(data).length > 0 ? JSON.stringify(data) : undefined,
    };

    try {
      const response = await fetch(url.toString(), options);
      if (!response.ok) {
        const errorMessage = `HTTP error! Status: ${response.status} ${response.statusText}`;
        throw new Error(errorMessage);
      }
      const responseData: ResponseRoot<T> = await response.json();
      if (responseData.messages) {
        for (const error of responseData.messages) {
          throw new Error(error.message_string);
        }
      }
      return responseData;
    } catch (error) {
      console.error("Fetch request error:", error);
      throw error;
    }
  }

  private async requestWithAuth<T>(baseUrl: string, method: ArrowedHttpMethod, path: string, params?: {}, data?: {}) {
    if (!this.apiKey) {
      throw new Error('You need to pass an API Key to create this instance.');
    }

    if (!this.secretKey) {
      throw new Error('You need to pass an API Secret to create this instance.');
    }

    const headers = await makeAuthHeader(this.apiKey, this.secretKey, method, path, params, data);

    return this.request<T>(baseUrl, method, path, params, data, headers);
  }
}
