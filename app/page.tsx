import { DESIGN_CONFIG } from "../src/design-config";

export default function Home() {
  return (
    <main className="app-shell">
      <header className="site-header">
        <div>
          <p className="eyebrow">INTERACTIVE INTERIOR · 2026</p>
          <h1>{DESIGN_CONFIG.project.name}</h1>
          <p className="subtitle">{DESIGN_CONFIG.project.subtitle}</p>
        </div>
        <div className="status-pill" aria-label="设计阶段">
          <span className="status-dot" />概念设计 01
        </div>
      </header>

      <section className="viewer-layout" aria-label="三维设计预览">
        <div className="viewer-card">
          <div className="viewer-loading" role="status">
            <span className="loading-mark">3D</span>
            <div>
              <strong>空间模型准备中</strong>
              <span>正在建立海洋板、不锈钢与暖光材质</span>
            </div>
          </div>
          <div className="concept-notice">{DESIGN_CONFIG.project.conceptualNotice}</div>
        </div>

        <aside className="design-brief">
          <p className="section-label">DESIGN BRIEF</p>
          <h2>把专业厨房的耐用感，放进温暖住宅。</h2>
          <div className="metric-grid">
            <div><strong>1600</strong><span>中岛长度 mm</span></div>
            <div><strong>980</strong><span>厨房侧净距 mm</span></div>
            <div><strong>304</strong><span>拉丝不锈钢</span></div>
            <div><strong>340</strong><span>客厅储物深 mm</span></div>
          </div>
        </aside>
      </section>
    </main>
  );
}
