# AeroTrade UK: Commercial Client Pitch & Product Deck
**Client Audience:** UK Energy Utility — Wholesale Day-Ahead Trading Desk & Power Purchase Team  
**Author:** Product Engineering & Quantitative Solutions Team  
**Evaluation Window:** January 2026 Elexon BMRS Market Data  

---

## Executive Summary

As a UK electricity supplier, your commercial obligation is to ensure that your consumer demand is 100% matched with contracted energy every half-hour Settlement Period. In today's transitioning grid, renewable wind generation constitutes a critical, zero-marginal-cost component of your portfolio.

However, **wind is variable and weather-dependent**, whereas wholesale Day-Ahead auction decisions on EPEX SPOT and Nord Pool must be **locked in by 11:00 GMT on Day D-1**. 

Any error between your day-ahead procurement plan and real-time outturn forces your utility into the **Balancing Mechanism (BM)**:
- **Over-forecasting wind:** You purchase insufficient thermal/day-ahead power. You are left **SHORT** in real time, forced to buy emergency power at the **System Buy Price (SBP)**, which often spikes above £150–£300/MWh.
- **Under-forecasting wind:** You over-procure thermal power. You are left **LONG**, forced to spill or sell excess power at discounted **System Sell Prices (SSP)**.

**AeroTrade UK** is a bespoke decision-support platform designed specifically for your trading desk to eliminate blind spots, ingest the latest valid Elexon BMRS forecasts at decision time, and replace guesswork with quantified statistical hedging margins.

---

## 1. Ground Truth from January 2026: The Risk You Face Today

Using national-level outturn (`FUELHH: WIND`) and forecasts (`WINDFOR`) from Elexon BMRS across January 2026 (744 hourly settlement periods), AeroTrade UK uncovered a critical systemic bias:

```
+-------------------------------------------------------------------------+
|                    JANUARY 2026 MARKET SUMMARY                           |
+------------------------------------+------------------------------------+
| Metric                             | Value                              |
+------------------------------------+------------------------------------+
| Total Actual Wind Generation       | 8,616.07 GWh                       |
| Total Forecasted Wind Generation   | 9,985.25 GWh                       |
| Net Wind Imbalance Volume          | +1,369.18 GWh (Over-forecast)      |
| Mean Absolute Error (MAE)          | 2,122.8 MW                         |
| Root Mean Squared Error (RMSE)     | 2,616.7 MW                         |
| Mean Directional Bias (MBE)        | +1,840.3 MW                        |
| Over-Forecast Frequency            | 84.4% of all hours in the month    |
| P90 Value-at-Risk Error Buffer     | +4,313.0 MW                        |
| Peak Actual Generation             | 17,755.5 MW                        |
+------------------------------------+------------------------------------+
```

### The Key Finding:
In January 2026, the national wind forecast **over-estimated actual generation in 84.4% of hours** by an average of **+1,840 MW**.

> **Commercial Impact:** If your trading desk naively procured thermal power based on the raw forecast without a buffer, your utility was **chronically short 84% of the time**, bleeding cash in the Balancing Mechanism throughout January 2026.

---

## 2. How AeroTrade UK Transforms Your Decision Workflow

### Pillar 1: True Decision-Time Visibility (Zero Lookahead Bias)
- Day-Ahead auctions close at **11:00 GMT on D-1**. Weather forecasts published *after* 11:00 GMT are useless for the day-ahead auction.
- AeroTrade UK filters the forecast stream to identify the **latest valid forecast published on or before your exact decision cutoff**.
- Allows traders to run sensitivity analysis comparing 09:00 vs 11:00 vs 14:00 intraday positions.

### Pillar 2: Actionable Hedging Margins (Beyond Abstract Error)
- Knowing the MAE is 2,122 MW is not enough to execute a trade. Traders need to know: *"How much extra thermal power should I buy right now to protect my book?"*
- AeroTrade UK calculates empirical quantiles:
  - **P50 (Median):** +1,643 MW
  - **P90 Hedging Margin:** +4,313 MW
  - **P95 Stress Tail:** +5,421 MW
- A risk-neutral trader applies the +1,840 MW mean bias correction. A risk-averse trader procuring during high-priced winter evenings applies the **P90 margin**, hedging 90% of shortfall scenarios.

### Pillar 3: Diurnal & Peak Demand Timing
- UK balancing penalties are most punishing during the **17:00–19:00 evening demand peak**, when CCGT and peaker plant costs surge.
- AeroTrade’s **Diurnal Pattern Engine** pinpoints hour-by-hour uncertainty, allowing traders to concentrate hedging capital where market spread risk is greatest.

### Pillar 4: Interactive Day-Ahead Thermal Procurement Simulator
- Traders enter their utility’s consumer demand load (e.g. 25,000 MW).
- The platform calculates:
  $$\text{Naive Thermal Need} = \text{Demand} - \text{Wind Forecast}$$
  $$\text{Recommended Hedged Procurement} = \text{Demand} - (\text{Wind Forecast} - \text{P90 Safety Buffer})$$
- Shows real-time estimated balancing penalty savings based on live market price spreads.

---

## 3. Financial Return on Investment (ROI)

Consider a utility with a 15% share of the national portfolio:
- **Average short position per hour without buffer:** $\approx 276\text{ MW}$
- **Typical winter spread penalty (System Buy Price vs Day-Ahead):** $\approx £65/\text{MWh}$
- **Hourly imbalance penalty risk:** $276\text{ MW} \times £65/\text{MWh} = £17,940/\text{hour}$
- **Monthly exposure across 744 hours:** $\mathbf{> £13,000,000}$ in potential balancing costs.

By applying AeroTrade’s calibrated Day-Ahead thermal procurement buffer, your desk avoids unpredictable cash-out settlement exposure and captures power at predictable Day-Ahead auction prices.

---

## 4. Product Demonstration Highlights

1. **Live Interactive Curve:** Inspect January 2026 storm events and high-pressure lulls with smooth zoom brushes.
2. **Preset Filter Profiles:** Instant toggle between full-month macro trends and high-volatility storm weeks (e.g., Jan 1–7).
3. **Daily Ledger & CSV Export:** Direct audit trail for risk compliance and quantitative model backtesting.

---

## 5. Next Steps & Integration Roadmap

- **Week 1–2:** Deploy AeroTrade UK on your private cloud (Docker / AWS ECS / Azure).
- **Week 3:** Connect your utility's proprietary PPA wind asset telemetry alongside national Elexon benchmarks.
- **Week 4:** Automated morning trade advisory alerts delivered to your desk at 10:15 GMT (45 minutes ahead of EPEX Gate Closure).
