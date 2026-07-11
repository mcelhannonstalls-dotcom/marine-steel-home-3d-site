"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { createApartment } from "./apartment";
import { DESIGN_CONFIG } from "./design-config";
import { createMaterials } from "./materials";
import { createNavigation } from "./navigation";
import { SHADOW_MAP_TYPE } from "./render-config";

type Inspection = {
  label: string;
  detail: string;
  size?: string;
  warning?: string;
};

const DEFAULT_INSPECTION: Inspection = {
  label: "全屋改造概览",
  detail: "点击空间中的中岛、厨房、卫浴或储物柜，可以查看材料、尺寸与施工提示。",
  size: "套内主要宽度约 4282 mm",
};

export function Walkthrough() {
  const mountRef = useRef<HTMLDivElement>(null);
  const viewerRef = useRef<HTMLDivElement>(null);
  const navigationRef = useRef<ReturnType<typeof createNavigation> | null>(null);
  const [activeView, setActiveView] = useState("overview");
  const [inspection, setInspection] = useState<Inspection>(DEFAULT_INSPECTION);
  const [planOpen, setPlanOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [webglError, setWebglError] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
    } catch {
      setWebglError(true);
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = SHADOW_MAP_TYPE;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.08;
    renderer.domElement.setAttribute("aria-label", "可拖动浏览的室内三维模型");
    renderer.domElement.setAttribute("data-testid", "three-canvas");
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xd7d5cd);
    scene.fog = new THREE.Fog(0xd7d5cd, 12, 24);

    const camera = new THREE.PerspectiveCamera(42, mount.clientWidth / mount.clientHeight, 0.05, 60);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.minDistance = 1.1;
    controls.maxDistance = 18;
    controls.maxPolarAngle = Math.PI * 0.49;
    controls.screenSpacePanning = true;

    const materials = createMaterials();
    const apartment = createApartment(DESIGN_CONFIG, materials);
    scene.add(apartment.root);

    const hemisphere = new THREE.HemisphereLight(0xfff6e8, 0x69726d, 2.55);
    scene.add(hemisphere);
    const daylight = new THREE.DirectionalLight(0xfff4dc, 4.1);
    daylight.position.set(-4, 8.5, -7);
    daylight.castShadow = true;
    daylight.shadow.mapSize.set(2048, 2048);
    daylight.shadow.camera.left = -7;
    daylight.shadow.camera.right = 7;
    daylight.shadow.camera.top = 9;
    daylight.shadow.camera.bottom = -9;
    scene.add(daylight);

    const islandLight = new THREE.PointLight(0xffc98f, 19, 6, 2);
    islandLight.position.set(0.44, 2.25, -0.62);
    scene.add(islandLight);
    const livingLight = new THREE.PointLight(0xffd7a3, 11, 5, 2);
    livingLight.position.set(0.1, 2.35, 0.8);
    scene.add(livingLight);
    const bedroomLight = new THREE.PointLight(0xffd4a0, 10, 5, 2);
    bedroomLight.position.set(0.4, 2.25, 3.7);
    scene.add(bedroomLight);

    const navigation = createNavigation(camera, controls, apartment.bounds);
    navigation.goToPreset("overview", true);
    navigationRef.current = navigation;

    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();
    const handlePointer = (event: PointerEvent) => {
      const bounds = renderer.domElement.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width) * 2 - 1;
      pointer.y = -((event.clientY - bounds.top) / bounds.height) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(apartment.root.children, true);
      for (const hit of hits) {
        let object: THREE.Object3D | null = hit.object;
        while (object && !object.userData.inspectable) object = object.parent;
        if (object?.userData.inspectable) {
          setInspection({
            label: object.userData.label,
            detail: object.userData.detail,
            size: object.userData.size,
            warning: object.userData.warning,
          });
          break;
        }
      }
    };
    renderer.domElement.addEventListener("pointerup", handlePointer);

    const resizeObserver = new ResizeObserver(() => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      if (!width || !height) return;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    });
    resizeObserver.observe(mount);

    let frame = 0;
    const render = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    render();
    setReady(true);

    return () => {
      cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      renderer.domElement.removeEventListener("pointerup", handlePointer);
      navigation.dispose();
      navigationRef.current = null;
      controls.dispose();
      apartment.root.traverse((object) => {
        if (object instanceof THREE.Mesh) object.geometry.dispose();
      });
      Object.values(materials).forEach((material) => material.dispose());
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const selectView = (id: string) => {
    setActiveView(id);
    navigationRef.current?.goToPreset(id);
  };

  const toggleFullscreen = async () => {
    if (!viewerRef.current) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await viewerRef.current.requestFullscreen();
  };

  return (
    <section className="walkthrough-layout" data-walkthrough="true" aria-label="交互式三维看房">
      <div className="viewer-card" ref={viewerRef}>
        <div className="canvas-mount" ref={mountRef} />
        {!ready && !webglError && (
          <div className="viewer-loading" role="status">
            <span className="loading-mark">3D</span>
            <div><strong>正在载入空间模型</strong><span>海洋板 · 304 不锈钢 · 暖色灯光</span></div>
          </div>
        )}
        {webglError && (
          <div className="viewer-loading" role="alert">
            <span className="loading-mark">!</span>
            <div><strong>当前浏览器无法显示 3D</strong><span>请开启硬件加速或更换新版浏览器。</span></div>
          </div>
        )}

        <nav className="room-nav" aria-label="房间视角">
          {DESIGN_CONFIG.cameras.map((camera) => (
            <button
              className={activeView === camera.id ? "active" : ""}
              key={camera.id}
              onClick={() => selectView(camera.id)}
              type="button"
            >
              <span>{camera.id === "overview" ? "00" : String(DESIGN_CONFIG.cameras.indexOf(camera)).padStart(2, "0")}</span>
              {camera.label}
            </button>
          ))}
        </nav>

        <div className="viewer-actions">
          <button type="button" onClick={() => setPlanOpen(true)}>查看户型</button>
          <button type="button" onClick={() => setHelpOpen(true)} aria-label="操作帮助">操作</button>
          <button type="button" onClick={toggleFullscreen}>全屏</button>
        </div>

        <div className="interaction-hint">拖动旋转 · 滚轮缩放 · 点击家具查看说明</div>
        <div className="concept-notice">{DESIGN_CONFIG.project.conceptualNotice}</div>
      </div>

      <aside className="design-panel" aria-live="polite">
        <div className="panel-topline"><span>DESIGN NOTE</span><span>01 / 01</span></div>
        <h2>{inspection.label}</h2>
        <p>{inspection.detail}</p>
        {inspection.size && <div className="detail-chip">{inspection.size}</div>}
        {inspection.warning && <div className="warning-note"><strong>现场复核</strong>{inspection.warning}</div>}

        <div className="material-list">
          <div><span>柜体</span><strong>海洋板</strong></div>
          <div><span>台面</span><strong>304 拉丝不锈钢</strong></div>
          <div><span>灯光</span><strong>3000–3500K</strong></div>
          <div><span>中岛</span><strong>1600 × 780 mm</strong></div>
        </div>
      </aside>

      {planOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="改造后户型">
          <div className="plan-dialog">
            <div className="dialog-head"><div><span>PLAN 01</span><h2>改造后空间关系</h2></div><button type="button" onClick={() => setPlanOpen(false)} aria-label="关闭户型图">关闭</button></div>
            <div className="diagram-plan" aria-label="概念户型图">
              <div className="plan-wet plan-bath"><strong>新卫生间</strong><span>原厨房 · 5.8㎡</span></div>
              <div className="plan-wet plan-kitchen"><strong>开放式厨房</strong><span>原卫生间 · 4.7㎡</span></div>
              <div className="plan-living"><strong>客厅 + 独立中岛</strong><span>13.6㎡ · 通顶储物墙</span><i>ISLAND</i></div>
              <div className="plan-bedroom"><strong>卧室</strong><span>14.9㎡</span></div>
              <div className="plan-balcony"><strong>阳台</strong><span>5.6㎡</span></div>
            </div>
            <p className="plan-caption">概念尺寸来自原户型图；承重墙、排污立管与烟道必须现场复核。</p>
          </div>
        </div>
      )}

      {helpOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="操作帮助">
          <div className="help-dialog">
            <div className="dialog-head"><div><span>HOW TO VIEW</span><h2>像看房一样浏览</h2></div><button type="button" onClick={() => setHelpOpen(false)} aria-label="关闭帮助">关闭</button></div>
            <ol><li><strong>选择房间</strong><span>点击底部视角，平滑移动到对应空间。</span></li><li><strong>环绕观看</strong><span>拖动旋转，滚轮或双指缩放。</span></li><li><strong>查看做法</strong><span>点击中岛、柜体、卫浴和家具查看材料说明。</span></li></ol>
          </div>
        </div>
      )}
    </section>
  );
}
