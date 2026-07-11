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
    </main>
  );
}
