import Image from "next/image";
import { DESIGN_CONFIG } from "../src/design-config";
import { Walkthrough } from "../src/Walkthrough";

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

      <Walkthrough />

      <section className="render-gallery" aria-labelledby="render-title">
        <div className="gallery-heading">
          <div>
            <p>RENDER GALLERY</p>
            <h2 id="render-title">精选效果图</h2>
          </div>
          <span>同一材料与空间逻辑 · 概念表现</span>
        </div>
        <div className="gallery-grid">
          <figure className="gallery-main">
            <Image src="/renders/kitchen-island.jpg" width={1448} height={1086} alt="客厅望向开放式厨房与独立中岛" priority unoptimized />
            <figcaption><span>01</span><strong>厨房与独立中岛</strong><em>海洋板 · 304 拉丝不锈钢</em></figcaption>
          </figure>
          <figure>
            <Image src="/renders/kitchen-detail.jpg" width={1448} height={1086} alt="海洋板柜体与不锈钢台面的厨房细节" unoptimized />
            <figcaption><span>02</span><strong>厨房材料细节</strong><em>电磁灶 · 北窗洗涤</em></figcaption>
          </figure>
          <figure>
            <Image src="/renders/living-storage.jpg" width={1448} height={1086} alt="客厅通顶储物墙与中岛连接关系" unoptimized />
            <figcaption><span>03</span><strong>客厅通顶储物</strong><em>340 mm 浅柜 · 轻量会客</em></figcaption>
          </figure>
        </div>
        <p className="gallery-disclaimer">效果图用于确认氛围、材质与收纳关系；最终尺寸以现场复尺和施工深化为准。</p>
      </section>
    </main>
  );
}
