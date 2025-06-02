import { MetricsService } from '@metrics/metrics.service';

const gaugeSetMock = jest.fn();
const gaugeIncMock = jest.fn();
const gaugeDecMock = jest.fn();
const counterIncMock = jest.fn();
const histogramObserveMock = jest.fn();

jest.mock('prom-client', () => ({
  Counter: jest.fn().mockImplementation(() => ({
    inc: counterIncMock,
    labels: jest.fn(() => ({
      inc: counterIncMock,
    })),
  })),
  Gauge: jest.fn().mockImplementation(() => ({
    inc: gaugeIncMock,
    dec: gaugeDecMock,
    set: gaugeSetMock,
    labels: jest.fn(() => ({
      inc: gaugeIncMock,
      dec: gaugeDecMock,
      set: gaugeSetMock,
    })),
  })),
  Histogram: jest.fn().mockImplementation(() => ({
    startTimer: jest.fn(() => jest.fn()),
    labels: jest.fn(() => ({
      observe: histogramObserveMock,
    })),
  })),
}));

describe('MetricsService', () => {
  let service: MetricsService;

  beforeEach(() => {
    jest.clearAllMocks(); // Important for isolation
    service = new MetricsService();
  });

  it('should increment total HTTP requests counter', () => {
    service.incrementHttpRequests();
    expect(counterIncMock).toHaveBeenCalled();
  });

  it('should increment concurrent requests gauge', () => {
    service.incrementConcurrentRequests();
    expect(gaugeIncMock).toHaveBeenCalled();
  });

  it('should decrement concurrent requests gauge', () => {
    service.decrementConcurrentRequests();
    expect(gaugeDecMock).toHaveBeenCalled();
  });

  it('should set active users gauge', () => {
    service.setActiveUsers(10);
    expect(gaugeSetMock).toHaveBeenCalledWith(10);
  });

  it('should observe API request duration', () => {
    service.observeRequestDuration('GET', '/test', '200', 1.23);
    expect(histogramObserveMock).toHaveBeenCalledWith(1.23);
  });

  it('should increment API request counter', () => {
    service.incrementApiRequestCounter('GET', '/test', '200');
    expect(counterIncMock).toHaveBeenCalled();
  });

  it('should increment API error counter', () => {
    service.incrementApiErrorCounter('POST', '/error', '500');
    expect(counterIncMock).toHaveBeenCalled();
  });

  it('should increment user agent counter', () => {
    service.incrementUserAgentCounter(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
    );
    expect(counterIncMock).toHaveBeenCalled();
  });

  it('should increment referer counter', () => {
    service.incrementRefererCounter('https://example.com/page');
    expect(counterIncMock).toHaveBeenCalled();
  });

  it('should increment mobile web request counter - mobile', () => {
    service.incrementMobileWebReqCounter(true);
    expect(counterIncMock).toHaveBeenCalled();
  });

  it('should increment mobile web request counter - web', () => {
    service.incrementMobileWebReqCounter(false);
    expect(counterIncMock).toHaveBeenCalled();
  });
});
