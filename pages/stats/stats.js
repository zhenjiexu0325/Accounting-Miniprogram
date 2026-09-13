const app = getApp();
const util = require('../../utils/util.js');

// Pie chart colors, reused in a cycle
const COLORS = ['#4A90D9', '#F5A623', '#E85C5C', '#3CB371', '#9B59B6', '#1ABC9C', '#95A5A6'];

Page({
  data: {
    month: '',
    statType: 'expense',
    breakdown: []
  },

  onShow() {
    app.loadRecords();
    if (!this.data.month) {
      this.setData({ month: util.formatDate(new Date()).slice(0, 7) }, () => this.refreshView());
    } else {
      this.refreshView();
    }
  },

  onPrevMonth() {
    this.shiftMonth(-1);
  },

  onNextMonth() {
    this.shiftMonth(1);
  },

  shiftMonth(delta) {
    const [y, m] = this.data.month.split('-').map(Number);
    const d = new Date(y, m - 1 + delta, 1);
    const newMonth = util.formatDate(d).slice(0, 7);
    this.setData({ month: newMonth }, () => this.refreshView());
  },

  onTypeChange(e) {
    this.setData({ statType: e.currentTarget.dataset.type }, () => this.refreshView());
  },

  refreshView() {
    const records = app.globalData.records || [];
    const rawBreakdown = util.calcCategoryBreakdown(records, this.data.month, this.data.statType);
    const total = rawBreakdown.reduce((sum, item) => sum + item.value, 0);

    const breakdown = rawBreakdown.map((item, index) => ({
      ...item,
      color: COLORS[index % COLORS.length],
      percent: total > 0 ? Math.round((item.value / total) * 1000) / 10 : 0
    }));

    this.setData({ breakdown }, () => {
      if (breakdown.length > 0) this.drawChart(breakdown);
    });
  },

  // Draw a simple pie chart with canvas 2d; no third-party chart library
  drawChart(breakdown) {
    const query = wx.createSelectorQuery().in(this);
    query.select('#pieCanvas')
      .fields({ node: true, size: true })
      .exec((res) => {
        if (!res || !res[0] || !res[0].node) return;

        const canvas = res[0].node;
        const ctx = canvas.getContext('2d');
        const dpr = wx.getWindowInfo().pixelRatio;
        const width = res[0].width;
        const height = res[0].height;

        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);

        const cx = width / 2;
        const cy = height / 2;
        const radius = Math.min(width, height) / 2 - 10;
        const total = breakdown.reduce((sum, item) => sum + item.value, 0);

        ctx.clearRect(0, 0, width, height);

        let startAngle = -Math.PI / 2;
        breakdown.forEach(item => {
          const sliceAngle = (item.value / total) * Math.PI * 2;
          ctx.beginPath();
          ctx.moveTo(cx, cy);
          ctx.arc(cx, cy, radius, startAngle, startAngle + sliceAngle);
          ctx.closePath();
          ctx.fillStyle = item.color;
          ctx.fill();
          startAngle += sliceAngle;
        });

        // Cut out the center for a cleaner donut look
        ctx.beginPath();
        ctx.arc(cx, cy, radius * 0.55, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      });
  }
});
