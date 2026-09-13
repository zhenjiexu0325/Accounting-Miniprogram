# Accounting-Miniprogram

An accounting miniprogram for personal use.

A WeChat mini program for tracking expenses and income, using local storage only (no server). Built as a small, runnable project for hands-on practice.

## How to Run

1. Download and open WeChat DevTools
2. Choose "Import Project" and select this folder
3. Use a Test AppID (no real AppID needed for local preview)
4. Click Compile to see the app

## Project Structure

```
accounting-miniprogram/
├── app.js              # Global logic: load/save records from local storage
├── app.json             # Global config: page routes, tabBar
├── app.wxss             # Global styles
├── utils/
│   └── util.js          # Helpers: date format, categories, summary/breakdown stats
├── pages/
│   ├── index/            # Home: record list + monthly income/expense summary
│   ├── add/               # Add entry: type/category/amount/date/note form
│   └── stats/              # Stats: month switch + canvas donut chart + category share list
```

## Design Notes

### Data Storage
No cloud or backend APIs. All records are stored as an array via `wx.setStorageSync('records', ...)`.
`app.js` keeps `globalData.records` as a runtime cache; pages read via `getApp().globalData`,
and writes go through `app.saveRecords()` so local storage and memory stay in sync.

Single record shape:
```js
{
  id: 'timestamp_random',
  type: 'expense' | 'income',
  amount: 128.5,
  category: 'food',
  date: '2024-05-20',
  note: 'optional note',
  createTime: 1716200000000
}
```

### Cross-page Data Sync
After saving on "Add Entry", `navigateBack()` returns to Home. Home reloads data in `onShow()` (not `onLoad()`),
so returning from any entry point always shows the latest records and avoids the common multi-page sync pitfall.

### Charts
No ECharts or other chart libraries. A donut chart is drawn with the native `canvas type="2d"` API:
slice angles are computed from each category's share, drawn with `arc()`, then a white circle is filled in the center.
Pros: smaller package, fewer dependencies. Cons: less polish than a mature chart library — a useful trade-off to discuss in interviews.

## Possible Extensions
- Edit existing records (currently add and delete only)
- Filter the list by category
- Export data (e.g. JSON, or sync via mini program cloud for multi-device)
- Budgets: set a monthly budget and warn when overspent
