export interface Contribution {
  title: string;
  repo: string;
  pr: number;
  description: string;
  stars: string;
  lines: string;
  url: string;
}

export const contributions: Contribution[] = [
  {
    title: "weightedRoundRobin Load-Balancing Algorithm",
    repo: "zalando/skipper",
    pr: 4124,
    description:
      "Designed and shipped a smooth weighted round-robin algorithm with dynamic health-derived endpoint weights. Defended the locking design under maintainer review with a self-built C benchmark harness sustaining ~31k req/s at 1,000 endpoints — the harness was kept in the repo for testing all algorithms.",
    stars: "3.1K+",
    lines: "+599/−4",
    url: "https://github.com/zalando/skipper/pull/4124",
  },
  {
    title: "Prometheus Native Histogram Support",
    repo: "zalando/skipper",
    pr: 4108,
    description:
      "Implemented opt-in native histogram support with OTEL-recommended bucket tuning, deploying to production Kubernetes clusters while maintaining backward compatibility with existing dashboards.",
    stars: "3.1K+",
    lines: "+245/−146",
    url: "https://github.com/zalando/skipper/pull/4108",
  },
  {
    title: "Per-Data-Client Load Latency Metrics",
    repo: "zalando/skipper",
    pr: 4087,
    description:
      "Added instrumentation to measure route-loading latency per data source, giving SRE teams visibility into which integrations are slow.",
    stars: "3.1K+",
    lines: "+76/−1",
    url: "https://github.com/zalando/skipper/pull/4087",
  },
  {
    title: "TLS Certificate Matching Documentation",
    repo: "etcd-io/website",
    pr: 1171,
    description:
      "Clarified security documentation for certificate-matching semantics across v3.5–v3.7, resolving a long-standing confusion about wildcard support.",
    stars: "48K+",
    lines: "+6/−3",
    url: "https://github.com/etcd-io/website/pull/1171",
  },
  {
    title: "Go Toolchain Security Updates",
    repo: "etcd-io/gofail",
    pr: 149,
    description:
      "Patched three CVEs by bumping Go to 1.25.11 as part of etcd organization's tracked security effort.",
    stars: "CNCF",
    lines: "+2/−2",
    url: "https://github.com/etcd-io/gofail/pull/149",
  },
];
