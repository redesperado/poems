import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { LocationData } from '../../types/location';
import { PoetData } from '../../types/poet';
import { PoemData } from '../../types/poem';
import { MAJOR_CITIES, CityCulturalData } from '../../data/cities';
import { soundEngine } from '../../engine/audio/soundEngine';
import { CityDetailModal } from './CityDetailModal';
import {
  Compass,
  Eye,
  Camera,
  Sun,
  Sunrise,
  Moon,
  Layers,
  Sparkles,
  MapPin,
  Info,
} from 'lucide-react';

interface TravelMapStage3DProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
  currentYear?: number;
  currentPoet?: PoetData;
  activePoems?: PoemData[];
  onSelectPoemForPlay?: (poem: PoemData) => void;
  unlockedArtifactIds?: string[];
  onCollectArtifact?: (artifactId: string) => void;
  onSwitchTo2D?: () => void;
}

// -----------------------------------------------------------------------------
// 1. 古代官道拓扑
// -----------------------------------------------------------------------------
const ANCIENT_ROADS: Array<[string, string]> = [
  ['chang_an', 'sichuan'], // 剑阁蜀道 (连通关中与巴蜀)
  ['sichuan', 'chengdu'], // 锦官城官道
  ['chengdu', 'baidicheng'], // 巴峡道
  ['chang_an', 'luoyang'], // 两京官道 (经潼关)
  ['luoyang', 'kaifeng'], // 中原通衢 (汴京)
  ['kaifeng', 'yangzhou'], // 汴河运道
  ['baidicheng', 'huanghelou'], // 荆楚江道
  ['huanghelou', 'jiujiang'], // 浔阳江路
  ['jiujiang', 'yangzhou'], // 江南江道
  ['jiujiang', 'hangzhou'], // 钱塘官道
  ['yangzhou', 'hangzhou'], // 运河南段
];

// 水路判断
const WATER_ROUTES = new Set([
  'baidicheng-huanghelou',
  'huanghelou-jiujiang',
  'jiujiang-yangzhou',
  'kaifeng-yangzhou',
  'yangzhou-hangzhou',
]);

// -----------------------------------------------------------------------------
// 2. 坐标转换与程序化三维千里江山地貌高程函数
// -----------------------------------------------------------------------------
// 经度 98 ~ 124 映射为 3D X: -130 ~ 130 (中心 111)
// 纬度 22 ~ 42 映射为 3D Z: 95 ~ -95 (中心 32，北向为 -Z)
function geoTo3D(lng: number, lat: number): { x: number; z: number } {
  const x = ((lng - 111) / 13) * 130;
  const z = -((lat - 32) / 10) * 95;
  return { x, z };
}

// 基于真实中国宏观地理三大阶梯的高程函数
function getElevationAt(x: number, z: number): number {
  // 反求大致的经纬度用于宏观构造判定
  const lng = 111 + (x / 130) * 13;
  const lat = 32 - (z / 95) * 10;

  let h = 2.0; // 基础平原高度

  // 1. 青藏高原 / 川西横断山脉 (经度 < 103, 纬度 < 35)
  if (lng < 103) {
    const westWeight = Math.min(Math.max((103 - lng) / 5, 0), 1);
    h += westWeight * 26 + Math.sin(x * 0.15) * 4 + Math.cos(z * 0.18) * 3;
  }

  // 2. 巴蜀盆地 (四川盆地四周高中间低，经度 104 ~ 108，纬度 29 ~ 32.5)
  const dChengdu = Math.hypot(lng - 105.5, lat - 30.8);
  if (dChengdu < 3.2) {
    // 盆地内部平缓
    h = 3.5 + Math.sin(x * 0.3) * 0.8;
  } else if (dChengdu < 5.0) {
    // 四周环绕的秦岭南脉、龙门山、大巴山、巫山 (蜀道之险)
    const rimWeight = Math.sin(((dChengdu - 3.2) / 1.8) * Math.PI);
    h += rimWeight * 16.0;
  }

  // 3. 秦岭山脉 (经度 106 ~ 113, 纬度 33.3 ~ 34.4)
  const qinlingZ = lat - 33.85;
  if (lng >= 106 && lng <= 113.5 && Math.abs(qinlingZ) < 1.2) {
    const qWeight = (1 - Math.abs(qinlingZ) / 1.2) * (1 - Math.abs(lng - 109.5) / 4.5);
    h += Math.max(qWeight, 0) * 17.5 + Math.sin(x * 0.4) * 2.0;
  }

  // 4. 太行山脉 (经度 112 ~ 114.5, 纬度 35.5 ~ 40)
  if (lng >= 112 && lng <= 114.5 && lat >= 35.5 && lat <= 40) {
    const thWeight = Math.sin(((lat - 35.5) / 4.5) * Math.PI) * (1 - Math.abs(lng - 113.2) / 1.5);
    h += Math.max(thWeight, 0) * 13.0;
  }

  // 5. 东南丘陵 / 庐山 / 雁荡山脉 (经度 115 ~ 121, 纬度 26 ~ 30)
  if (lng >= 115 && lng <= 121 && lat >= 26 && lat <= 30.5) {
    h += 5.5 + Math.sin(x * 0.22) * 3.5 + Math.cos(z * 0.25) * 3.0;
  }

  // 庐山独立奇峰 (经度 115.98, 纬度 29.56)
  const dLushan = Math.hypot(lng - 115.98, lat - 29.56);
  if (dLushan < 1.0) {
    h += (1.0 - dLushan) * 12.0;
  }

  // 6. 长江与黄河、湖泊低地深切水网
  // 长江自白帝城穿巫山向江夏、九江、金陵奔流
  const riverT = (lng - 109) / 12; // 0 ~ 1
  if (riverT >= 0 && riverT <= 1) {
    const riverLat = 31.0 - riverT * 0.5 + Math.sin(riverT * Math.PI * 2) * 0.6;
    const dRiver = Math.abs(lat - riverLat);
    if (dRiver < 0.6) {
      h *= Math.max(dRiver / 0.6, 0.25); // 下切河谷
    }
  }

  // 华北与黄淮平原 (开封、洛阳东侧、沿海) 保持广袤开阔
  if (lng >= 113.5 && lng <= 120 && lat >= 33.5 && lat <= 38) {
    h = Math.min(h, 4.0);
  }

  // 细微自然噪波
  h += Math.sin(x * 0.5) * Math.cos(z * 0.5) * 0.8;

  return Math.max(h, 0.4);
}

// -----------------------------------------------------------------------------
// 3. 千里江山青绿山水色谱纹理生成器
// -----------------------------------------------------------------------------
function createQingluCanvasTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d')!;

  // 宣纸暖金熟赭打底
  ctx.fillStyle = '#c7ab77';
  ctx.fillRect(0, 0, 1024, 1024);

  // 绘制水墨与青绿渐变色斑模拟宋画墨韵
  const gradient = ctx.createLinearGradient(0, 0, 1024, 1024);
  gradient.addColorStop(0.0, 'rgba(32, 64, 48, 0.4)'); // 松石墨青
  gradient.addColorStop(0.3, 'rgba(40, 96, 72, 0.35)'); // 孔雀石绿
  gradient.addColorStop(0.6, 'rgba(196, 160, 104, 0.3)'); // 熟赭
  gradient.addColorStop(1.0, 'rgba(28, 54, 82, 0.45)'); // 青金石青
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1024, 1024);

  // 随机宣纸细密纤维与雨点皴水墨噪点
  const imgData = ctx.getImageData(0, 0, 1024, 1024);
  const data = imgData.data;
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * 16;
    data[i] = Math.min(255, Math.max(0, data[i] + noise));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
  }
  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 4);
  return texture;
}

// -----------------------------------------------------------------------------
// 4. 城市悬浮 3D 古篆名牌 Canvas Sprite
// -----------------------------------------------------------------------------
function createCityPlaqueSprite(
  cityName: string,
  dynastyName: string,
  isCurrent: boolean,
  hasPoem: boolean,
  poetShortName?: string
): THREE.Sprite {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 140;
  const ctx = canvas.getContext('2d')!;

  // 名牌底板 (宋代绢帛木刻牌匾)
  ctx.save();
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 12;
  ctx.shadowOffsetY = 4;

  const bgGrad = ctx.createLinearGradient(0, 0, 320, 140);
  if (isCurrent) {
    bgGrad.addColorStop(0, 'rgba(180, 83, 9, 0.94)'); // 琥珀金
    bgGrad.addColorStop(1, 'rgba(120, 53, 15, 0.96)');
  } else {
    bgGrad.addColorStop(0, 'rgba(28, 25, 23, 0.9)'); // 玄墨
    bgGrad.addColorStop(1, 'rgba(41, 37, 36, 0.92)');
  }

  // 圆角矩形牌匾
  const r = 16;
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.moveTo(r, 0);
  ctx.arcTo(320, 0, 320, 140, r);
  ctx.arcTo(320, 140, 0, 140, r);
  ctx.arcTo(0, 140, 0, 0, r);
  ctx.arcTo(0, 0, 320, 0, r);
  ctx.closePath();
  ctx.fill();

  // 描边金线
  ctx.strokeStyle = isCurrent ? '#fef08a' : '#d4af37';
  ctx.lineWidth = isCurrent ? 3.5 : 2;
  ctx.stroke();
  ctx.restore();

  // 标题文字：当朝名 (如 长安 / 京兆府)
  ctx.font = 'bold 36px "Noto Serif SC", "Songti SC", "SimSun", serif';
  ctx.fillStyle = isCurrent ? '#ffffff' : '#fef3c7';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(dynastyName || cityName, 160, 50);

  // 副标文字 (现代城市或地位)
  ctx.font = '20px "Noto Serif SC", serif';
  ctx.fillStyle = isCurrent ? '#fef08a' : '#a8a29e';
  const subtitle = isCurrent
    ? `★ ${poetShortName || '文人'}当前驻足`
    : cityName;
  ctx.fillText(subtitle, 160, 95);

  // 诗词待发气泡印记
  if (hasPoem) {
    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    ctx.arc(285, 25, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = 'bold 16px sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('诗', 285, 26);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
  });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(16, 7, 1);
  return sprite;
}

// -----------------------------------------------------------------------------
// 5. 主组件实现
// -----------------------------------------------------------------------------
export const TravelMapStage3D: React.FC<TravelMapStage3DProps> = ({
  currentLocation,
  dynasty,
  onTravel,
  unlockedPoemIds,
  currentYear = 744,
  currentPoet,
  activePoems = [],
  onSelectPoemForPlay,
  unlockedArtifactIds,
  onCollectArtifact,
  onSwitchTo2D,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  // 交互与状态
  const [activeCityDetail, setActiveCityDetail] = useState<CityCulturalData | null>(null);
  const [hoveredCityName, setHoveredCityName] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<'dawn' | 'noon' | 'dusk' | 'night'>('noon');
  const [isCinematicTour, setIsCinematicTour] = useState<boolean>(false);
  const [showRoads, setShowRoads] = useState<boolean>(true);

  // Three.js 核心对象引用
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const controlsStateRef = useRef<{
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    targetLookAt: THREE.Vector3;
    currentLookAt: THREE.Vector3;
    distance: number;
    targetDistance: number;
    phi: number; // 俯仰角
    theta: number; // 水平环绕角
  }>({
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    targetLookAt: new THREE.Vector3(0, 0, 0),
    currentLookAt: new THREE.Vector3(0, 0, 0),
    distance: 140,
    targetDistance: 140,
    phi: Math.PI / 3.2,
    theta: -Math.PI / 12,
  });

  const cityObjectsMapRef = useRef<Map<string, THREE.Group>>(new Map());
  const clickableMeshesRef = useRef<THREE.Mesh[]>([]);
  const meshToCityIdMapRef = useRef<Map<THREE.Mesh, string>>(new Map());
  const sunLightRef = useRef<THREE.DirectionalLight | null>(null);
  const hemiLightRef = useRef<THREE.HemisphereLight | null>(null);
  const playerAuraMeshRef = useRef<THREE.Mesh | null>(null);
  const playerPillarMeshRef = useRef<THREE.Mesh | null>(null);
  const cloudsGroupRef = useRef<THREE.Group | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // 判定某城市是否有未解锁诗词
  const getCityPoemStatus = useCallback(
    (locId: string) => {
      const cityPoems = activePoems.filter((p) => p.location_id === locId);
      if (cityPoems.length === 0) return { hasPoem: false, uncompleted: null };
      const uncompleted = cityPoems.find((p) => !unlockedPoemIds.includes(p.id));
      return {
        hasPoem: cityPoems.length > 0,
        uncompleted: uncompleted || null,
      };
    },
    [activePoems, unlockedPoemIds]
  );

  // 计算当前城市在 3D 中的坐标与高度
  const getCurrentCityPos3D = useCallback(() => {
    const coords = currentLocation.coordinates; // [lat, lng]
    const { x, z } = geoTo3D(coords[1], coords[0]);
    const y = getElevationAt(x, z);
    return { x, y, z };
  }, [currentLocation]);

  // 相机飞跃聚焦到特定城市
  const flyToCity = useCallback((cityId: string) => {
    const city = MAJOR_CITIES[cityId];
    if (!city) return;
    const { x, z } = geoTo3D(city.coordinates[0], city.coordinates[1]);
    const y = getElevationAt(x, z);

    controlsStateRef.current.targetLookAt.set(x, y, z);
    controlsStateRef.current.targetDistance = 75; // 近距特写
    soundEngine.playJadeChime(523.25); // 清越玉磬声
  }, []);

  // ---------------------------------------------------------------------------
  // 6. 初始化 Three.js 场景、地形与灯光
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // A. 场景与雾效 (水墨远霭)
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xd6c29c); // 宋代古绢黄
    scene.fog = new THREE.FogExp2(0xd6c29c, 0.0035);

    // B. 相机
    const width = container.clientWidth;
    const height = container.clientHeight;
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;

    // C. 渲染器 (开启阴影与抗锯齿)
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // D. 光源系统
    // 1. 半球环境光 (天光带暖金，地光带黛绿)
    const hemiLight = new THREE.HemisphereLight(0xfff6dd, 0x1f3a2b, 0.85);
    hemiLight.position.set(0, 150, 0);
    scene.add(hemiLight);
    hemiLightRef.current = hemiLight;

    // 2. 太阳主光源 (斜射金乌光，雕刻山脊立体阴影)
    const sunLight = new THREE.DirectionalLight(0xfff1cf, 1.8);
    sunLight.position.set(120, 160, 100);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 400;
    const d = 160;
    sunLight.shadow.camera.left = -d;
    sunLight.shadow.camera.right = d;
    sunLight.shadow.camera.top = d;
    sunLight.shadow.camera.bottom = -d;
    sunLight.shadow.bias = -0.0008;
    scene.add(sunLight);
    sunLightRef.current = sunLight;

    // E. 千里江山青绿地貌地形网格 (Procedural Qinglü Landscape Terrain)
    const terrainWidth = 320;
    const terrainDepth = 240;
    const segX = 160;
    const segZ = 120;
    const terrainGeo = new THREE.PlaneGeometry(terrainWidth, terrainDepth, segX, segZ);
    terrainGeo.rotateX(-Math.PI / 2);

    // 依高程算法位移顶点并着色
    const posAttr = terrainGeo.attributes.position;
    const count = posAttr.count;
    const colors = new Float32Array(count * 3);

    // 金碧青绿颜色标尺
    const colWater = new THREE.Color(0x1a434c); // 深青碧江水
    const colPlains = new THREE.Color(0xbe9e68); // 暖赭宣纸平原
    const colGreenLow = new THREE.Color(0x2f6b4d); // 石绿低峰
    const colGreenMid = new THREE.Color(0x194b39); // 孔雀深绿
    const colBlueHigh = new THREE.Color(0x1a3852); // 石青峻岭
    const colGoldPeak = new THREE.Color(0xd4af37); // 金碧山脊描金
    const colSnow = new THREE.Color(0xf1ece1); // 极高太白雪峰

    for (let i = 0; i < count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);
      const vy = getElevationAt(vx, vz);
      posAttr.setY(i, vy);

      // 根据海拔与起伏进行青绿山水晕染上色
      const finalCol = new THREE.Color();
      if (vy < 1.0) {
        finalCol.lerpColors(colWater, colPlains, vy / 1.0);
      } else if (vy < 6.0) {
        finalCol.lerpColors(colPlains, colGreenLow, (vy - 1.0) / 5.0);
      } else if (vy < 12.0) {
        finalCol.lerpColors(colGreenLow, colGreenMid, (vy - 6.0) / 6.0);
      } else if (vy < 18.0) {
        finalCol.lerpColors(colGreenMid, colBlueHigh, (vy - 12.0) / 6.0);
      } else if (vy < 24.0) {
        finalCol.lerpColors(colBlueHigh, colGoldPeak, (vy - 18.0) / 6.0);
      } else {
        finalCol.lerpColors(colGoldPeak, colSnow, (vy - 24.0) / 6.0);
      }

      colors[i * 3] = finalCol.r;
      colors[i * 3 + 1] = finalCol.g;
      colors[i * 3 + 2] = finalCol.b;
    }

    terrainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const qingluTexture = createQingluCanvasTexture();
    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      map: qingluTexture,
      roughness: 0.82,
      metalness: 0.12,
      flatShading: false,
    });

    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);

    // 水面基底层 (波光泛光，当河道下切时露出清透江水)
    const waterGeo = new THREE.PlaneGeometry(330, 250);
    waterGeo.rotateX(-Math.PI / 2);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0x18444c,
      roughness: 0.15,
      metalness: 0.6,
      transparent: true,
      opacity: 0.85,
    });
    const waterMesh = new THREE.Mesh(waterGeo, waterMat);
    waterMesh.position.y = 0.6;
    scene.add(waterMesh);

    // F. 云海与山谷水墨雾气 (Floating Shanshui Clouds)
    const cloudsGroup = new THREE.Group();
    const cloudMat = new THREE.MeshBasicMaterial({
      color: 0xfcf7ea,
      transparent: true,
      opacity: 0.28,
      depthWrite: false,
    });

    for (let c = 0; c < 24; c++) {
      const cw = 20 + Math.random() * 30;
      const ch = 12 + Math.random() * 20;
      const cGeo = new THREE.PlaneGeometry(cw, ch);
      cGeo.rotateX(-Math.PI / 2);
      const cMesh = new THREE.Mesh(cGeo, cloudMat);
      cMesh.position.set(
        (Math.random() - 0.5) * 220,
        7.0 + Math.random() * 12.0,
        (Math.random() - 0.5) * 160
      );
      cMesh.rotation.y = Math.random() * Math.PI;
      cloudsGroup.add(cMesh);
    }
    scene.add(cloudsGroup);
    cloudsGroupRef.current = cloudsGroup;

    // G. 初始镜头对准主角文人驻足城市
    const initCoords = currentLocation.coordinates;
    const { x: initX, z: initZ } = geoTo3D(initCoords[1], initCoords[0]);
    const initY = getElevationAt(initX, initZ);
    controlsStateRef.current.targetLookAt.set(initX, initY, initZ);
    controlsStateRef.current.currentLookAt.set(initX, initY, initZ);

    // H. 窗口大小自适应
    const handleResize = () => {
      if (!container || !camera || !renderer) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      terrainGeo.dispose();
      terrainMat.dispose();
      waterGeo.dispose();
      waterMat.dispose();
    };
  }, []); // 仅挂载一次初始化底层场景

  // ---------------------------------------------------------------------------
  // 7. 构建十六大名城 3D 楼阁建筑、立体古篆牌匾与交互碰撞网格
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // 清理旧城市对象
    cityObjectsMapRef.current.forEach((grp) => scene.remove(grp));
    cityObjectsMapRef.current.clear();
    clickableMeshesRef.current = [];
    meshToCityIdMapRef.current.clear();

    const cityRootGroup = new THREE.Group();
    cityRootGroup.name = 'cityRootGroup';

    // 建筑公用经典材质
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0x3e3835, // 汉白玉/青砖基座
      roughness: 0.65,
    });
    const woodMat = new THREE.MeshStandardMaterial({
      color: 0x852e1d, // 盛唐朱红廊柱
      roughness: 0.5,
    });
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // 金碧飞檐琉璃顶
      roughness: 0.35,
      metalness: 0.5,
    });

    Object.entries(MAJOR_CITIES).forEach(([cityId, cityData]) => {
      const [lng, lat] = cityData.coordinates;
      const { x, z } = geoTo3D(lng, lat);
      const y = getElevationAt(x, z);

      const cityGroup = new THREE.Group();
      cityGroup.position.set(x, y, z);

      const isCurrent = cityId === currentLocation.id;
      const { hasPoem } = getCityPoemStatus(cityId);
      const dynastyName = dynasty === 'tang' ? cityData.tang.name : cityData.song.name;

      // 1. 城台基座 (八角形夯土青砖石台)
      const baseGeo = new THREE.CylinderGeometry(2.8, 3.4, 1.4, 8);
      const baseMesh = new THREE.Mesh(baseGeo, baseMat);
      baseMesh.position.y = 0.7;
      baseMesh.castShadow = true;
      baseMesh.receiveShadow = true;
      cityGroup.add(baseMesh);

      // 2. 楼阁殿宇重檐 (根据长安/黄鹤楼定制特色)
      if (cityId === 'chang_an') {
        // 长安：大雁塔七级浮屠微缩
        for (let lvl = 0; lvl < 5; lvl++) {
          const tw = 2.0 - lvl * 0.35;
          const th = 1.2;
          const towerBlock = new THREE.Mesh(new THREE.BoxGeometry(tw, th, tw), baseMat);
          towerBlock.position.y = 1.4 + lvl * 1.3;
          towerBlock.castShadow = true;
          cityGroup.add(towerBlock);

          const eaves = new THREE.Mesh(new THREE.ConeGeometry(tw * 0.95, 0.45, 4), roofMat);
          eaves.position.y = 1.4 + lvl * 1.3 + 0.7;
          eaves.rotation.y = Math.PI / 4;
          cityGroup.add(eaves);
        }
      } else if (cityId === 'huanghelou') {
        // 黄鹤楼：三重飞檐名楼
        for (let lvl = 0; lvl < 3; lvl++) {
          const w = 2.2 - lvl * 0.4;
          const pillar = new THREE.Mesh(new THREE.CylinderGeometry(w * 0.8, w * 0.8, 1.0, 8), woodMat);
          pillar.position.y = 1.4 + lvl * 1.2;
          cityGroup.add(pillar);

          const eaves = new THREE.Mesh(new THREE.ConeGeometry(w * 1.4, 0.5, 8), roofMat);
          eaves.position.y = 1.4 + lvl * 1.2 + 0.6;
          cityGroup.add(eaves);
        }
      } else {
        // 常规名城：唐宋飞檐城楼
        const pillar = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.2, 2.4), woodMat);
        pillar.position.y = 1.4 + 0.6;
        cityGroup.add(pillar);

        const eaves = new THREE.Mesh(new THREE.ConeGeometry(2.4, 0.9, 4), roofMat);
        eaves.position.y = 1.4 + 1.2 + 0.45;
        eaves.rotation.y = Math.PI / 4;
        eaves.castShadow = true;
        cityGroup.add(eaves);
      }

      // 3. 悬浮古风 3D 牌匾 Sprite
      const poetShortName = currentPoet?.name_cn?.slice(-2);
      const sprite = createCityPlaqueSprite(cityData.name_cn, dynastyName, isCurrent, hasPoem, poetShortName);
      sprite.position.y = cityId === 'chang_an' ? 14.0 : 8.5;
      cityGroup.add(sprite);

      // 4. 拾取碰撞盒 (Invisible Raycast Hit Box)
      const hitGeo = new THREE.CylinderGeometry(4.2, 4.2, 12, 8);
      const hitMat = new THREE.MeshBasicMaterial({ visible: false });
      const hitMesh = new THREE.Mesh(hitGeo, hitMat);
      hitMesh.position.y = 5.0;
      cityGroup.add(hitMesh);

      // 注册交互拾取
      clickableMeshesRef.current.push(hitMesh);
      meshToCityIdMapRef.current.set(hitMesh, cityId);

      cityRootGroup.add(cityGroup);
      cityObjectsMapRef.current.set(cityId, cityGroup);
    });

    scene.add(cityRootGroup);

    return () => {
      scene.remove(cityRootGroup);
    };
  }, [dynasty, currentLocation.id, getCityPoemStatus]);

  // ---------------------------------------------------------------------------
  // 8. 主角文人专属 3D 贯天光柱与金印同心圆动画组件
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    if (playerAuraMeshRef.current) scene.remove(playerAuraMeshRef.current);
    if (playerPillarMeshRef.current) scene.remove(playerPillarMeshRef.current);

    const { x, y, z } = getCurrentCityPos3D();

    // 1. 地面金色同心波纹 (印章水墨涟漪)
    const ringGeo = new THREE.RingGeometry(3.2, 4.5, 32);
    ringGeo.rotateX(-Math.PI / 2);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf59e0b,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(x, y + 0.25, z);
    scene.add(ringMesh);
    playerAuraMeshRef.current = ringMesh;

    // 2. 贯通天地的金色灵蕴光柱 (Vertical Pillar of Light)
    const pillarGeo = new THREE.CylinderGeometry(0.8, 1.8, 48, 16, 1, true);
    const pillarMat = new THREE.MeshBasicMaterial({
      color: 0xfde047,
      transparent: true,
      opacity: 0.35,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    const pillarMesh = new THREE.Mesh(pillarGeo, pillarMat);
    pillarMesh.position.set(x, y + 24, z);
    scene.add(pillarMesh);
    playerPillarMeshRef.current = pillarMesh;

    return () => {
      if (playerAuraMeshRef.current) scene.remove(playerAuraMeshRef.current);
      if (playerPillarMeshRef.current) scene.remove(playerPillarMeshRef.current);
    };
  }, [currentLocation.id, getCurrentCityPos3D]);

  // ---------------------------------------------------------------------------
  // 9. 古代官道与长江水系 3D 流光光轨
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene || !showRoads) return;

    const roadsRoot = new THREE.Group();
    roadsRoot.name = 'ancientRoads3D';

    ANCIENT_ROADS.forEach(([fromId, toId]) => {
      const cityA = MAJOR_CITIES[fromId];
      const cityB = MAJOR_CITIES[toId];
      if (!cityA || !cityB) return;

      const pA = geoTo3D(cityA.coordinates[0], cityA.coordinates[1]);
      const pB = geoTo3D(cityB.coordinates[0], cityB.coordinates[1]);

      // 沿地形生成多段贴地贝塞尔样条点
      const points: THREE.Vector3[] = [];
      const numSteps = 12;
      for (let s = 0; s <= numSteps; s++) {
        const t = s / numSteps;
        const curX = pA.x + (pB.x - pA.x) * t;
        const curZ = pA.z + (pB.z - pA.z) * t;
        const curY = getElevationAt(curX, curZ) + 0.35; // 略微浮于地表
        points.push(new THREE.Vector3(curX, curY, curZ));
      }

      const curve = new THREE.CatmullRomCurve3(points);
      const tubeGeo = new THREE.TubeGeometry(curve, 32, 0.3, 6, false);

      const isWater =
        WATER_ROUTES.has(`${fromId}-${toId}`) || WATER_ROUTES.has(`${toId}-${fromId}`);

      const tubeMat = new THREE.MeshBasicMaterial({
        color: isWater ? 0x2dd4bf : 0xf59e0b, // 水路碧色，陆路暖金
        transparent: true,
        opacity: 0.65,
      });

      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      roadsRoot.add(tubeMesh);
    });

    scene.add(roadsRoot);

    return () => {
      scene.remove(roadsRoot);
    };
  }, [showRoads]);

  // ---------------------------------------------------------------------------
  // 10. 时辰与光影切换响应 (晨曦 / 暖阳 / 晚霞 / 月夜)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const scene = sceneRef.current;
    const sunLight = sunLightRef.current;
    const hemiLight = hemiLightRef.current;
    if (!scene || !sunLight || !hemiLight) return;

    if (timeOfDay === 'dawn') {
      // 晨曦薄霭
      scene.background = new THREE.Color(0xd4b896);
      if (scene.fog) scene.fog.color = new THREE.Color(0xd4b896);
      sunLight.color.setHex(0xffcb8c);
      sunLight.intensity = 1.4;
      sunLight.position.set(-140, 70, 90);
      hemiLight.color.setHex(0xffe6cb);
      hemiLight.groundColor.setHex(0x283b32);
    } else if (timeOfDay === 'noon') {
      // 午后暖阳 (金碧明朗，青绿山水最为璀璨)
      scene.background = new THREE.Color(0xd8c59f);
      if (scene.fog) scene.fog.color = new THREE.Color(0xd8c59f);
      sunLight.color.setHex(0xfff3d4);
      sunLight.intensity = 1.85;
      sunLight.position.set(110, 160, 90);
      hemiLight.color.setHex(0xfffaec);
      hemiLight.groundColor.setHex(0x1a3326);
    } else if (timeOfDay === 'dusk') {
      // 晚霞落日
      scene.background = new THREE.Color(0xa86c52);
      if (scene.fog) scene.fog.color = new THREE.Color(0xa86c52);
      sunLight.color.setHex(0xf97316);
      sunLight.intensity = 1.6;
      sunLight.position.set(150, 45, -80);
      hemiLight.color.setHex(0xfdcba2);
      hemiLight.groundColor.setHex(0x26191b);
    } else {
      // 月夜清辉 (春江花月夜)
      scene.background = new THREE.Color(0x131f28);
      if (scene.fog) scene.fog.color = new THREE.Color(0x131f28);
      sunLight.color.setHex(0x93c5fd);
      sunLight.intensity = 0.65;
      sunLight.position.set(80, 130, -60);
      hemiLight.color.setHex(0x38bdf8);
      hemiLight.groundColor.setHex(0x061118);
    }
  }, [timeOfDay]);

  // ---------------------------------------------------------------------------
  // 11. 渲染主循环与交互控制 (Orbit, Pan, Smooth FlyTo, Tour)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    let clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const delta = clock.getDelta();
      const elapsed = clock.getElapsedTime();
      const state = controlsStateRef.current;

      // A. 电影级自动巡航 (Cinematic Tour)
      if (isCinematicTour) {
        state.theta += delta * 0.12;
      }

      // B. 平滑插值更新观察中心点 (LookAt Lerp)
      state.currentLookAt.lerp(state.targetLookAt, 0.06);
      state.distance += (state.targetDistance - state.distance) * 0.08;

      // C. 球面极坐标转换为相机世界坐标
      const r = state.distance;
      const phi = Math.max(0.25, Math.min(Math.PI / 2.2, state.phi)); // 限制仰俯角防止入地
      const theta = state.theta;

      const camX = state.currentLookAt.x + r * Math.sin(phi) * Math.sin(theta);
      const camY = state.currentLookAt.y + r * Math.cos(phi);
      const camZ = state.currentLookAt.z + r * Math.sin(phi) * Math.cos(theta);

      if (cameraRef.current) {
        cameraRef.current.position.set(camX, camY, camZ);
        cameraRef.current.lookAt(state.currentLookAt);
      }

      // D. 主角文人金色光柱与涟漪呼吸动画
      if (playerAuraMeshRef.current) {
        const s = 1.0 + Math.sin(elapsed * 2.8) * 0.12;
        playerAuraMeshRef.current.scale.set(s, s, s);
      }
      if (playerPillarMeshRef.current) {
        playerPillarMeshRef.current.rotation.y = elapsed * 0.6;
      }

      // E. 云海缓慢飘动
      if (cloudsGroupRef.current) {
        cloudsGroupRef.current.children.forEach((cloud, i) => {
          cloud.position.x += Math.sin(elapsed * 0.2 + i) * 0.04;
        });
      }

      // F. 执行渲染
      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }
    };

    animFrameIdRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
    };
  }, [isCinematicTour]);

  // ---------------------------------------------------------------------------
  // 12. 鼠标与触控手势监听 (Orbit, Zoom, Pan, Click Raycast)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let touchStartDist = 0;

    // 鼠标按下
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0 || e.button === 2) {
        controlsStateRef.current.isDragging = true;
        controlsStateRef.current.previousMousePosition = { x: e.clientX, y: e.clientY };
        setIsCinematicTour(false); // 用户交互时停止自动巡航
      }
    };

    // 鼠标移动
    const handleMouseMove = (e: MouseEvent) => {
      const state = controlsStateRef.current;
      if (state.isDragging) {
        const deltaX = e.clientX - state.previousMousePosition.x;
        const deltaY = e.clientY - state.previousMousePosition.y;

        if (e.buttons === 1) {
          // 左键旋转视角
          state.theta -= deltaX * 0.005;
          state.phi -= deltaY * 0.005;
        } else if (e.buttons === 2) {
          // 右键平移观察中心
          const panSpeed = state.distance * 0.001;
          const forward = new THREE.Vector3();
          cameraRef.current?.getWorldDirection(forward);
          const right = new THREE.Vector3().crossVectors(forward, new THREE.Vector3(0, 1, 0)).normalize();

          state.targetLookAt.addScaledVector(right, -deltaX * panSpeed);
          state.targetLookAt.z += deltaY * panSpeed;
        }

        state.previousMousePosition = { x: e.clientX, y: e.clientY };
      }

      // 悬停检测 (Raycast)
      if (!cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(clickableMeshesRef.current);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const cId = meshToCityIdMapRef.current.get(hit);
        if (cId && MAJOR_CITIES[cId]) {
          container.style.cursor = 'pointer';
          setHoveredCityName(MAJOR_CITIES[cId].name_cn);
          return;
        }
      }
      container.style.cursor = 'grab';
      setHoveredCityName(null);
    };

    // 鼠标抬起
    const handleMouseUp = () => {
      controlsStateRef.current.isDragging = false;
    };

    // 滚轮缩放
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      const state = controlsStateRef.current;
      state.targetDistance = Math.min(Math.max(state.targetDistance + e.deltaY * 0.1, 45), 260);
      setIsCinematicTour(false);
    };

    // 点击事件检测名城点击
    const handleClick = (e: MouseEvent) => {
      if (!cameraRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );
      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);
      const intersects = raycaster.intersectObjects(clickableMeshesRef.current);

      if (intersects.length > 0) {
        const hit = intersects[0].object as THREE.Mesh;
        const cId = meshToCityIdMapRef.current.get(hit);
        if (cId && MAJOR_CITIES[cId]) {
          const targetCity = MAJOR_CITIES[cId];
          flyToCity(cId);
          setActiveCityDetail(targetCity);
        }
      }
    };

    // 触控支持 (移动端兼容 Touch Events)
    const handleTouchStart = (e: TouchEvent) => {
      setIsCinematicTour(false);
      if (e.touches.length === 1) {
        controlsStateRef.current.isDragging = true;
        controlsStateRef.current.previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      const state = controlsStateRef.current;
      if (e.touches.length === 1 && state.isDragging) {
        const deltaX = e.touches[0].clientX - state.previousMousePosition.x;
        const deltaY = e.touches[0].clientY - state.previousMousePosition.y;

        state.theta -= deltaX * 0.006;
        state.phi -= deltaY * 0.006;

        state.previousMousePosition = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
      } else if (e.touches.length === 2) {
        const currentDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const pinchDelta = (touchStartDist - currentDist) * 0.25;
        state.targetDistance = Math.min(Math.max(state.targetDistance + pinchDelta, 45), 260);
        touchStartDist = currentDist;
      }
    };

    const handleTouchEnd = () => {
      controlsStateRef.current.isDragging = false;
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);

      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [flyToCity]);

  // ---------------------------------------------------------------------------
  // 13. 快速预设视角切换
  // ---------------------------------------------------------------------------
  const handleOverviewCamera = () => {
    setIsCinematicTour(false);
    controlsStateRef.current.targetLookAt.set(0, 0, 0);
    controlsStateRef.current.targetDistance = 210;
    controlsStateRef.current.phi = Math.PI / 3.4;
    controlsStateRef.current.theta = 0;
    soundEngine.playJadeChime(440);
  };

  const handleFollowPoetCamera = () => {
    setIsCinematicTour(false);
    const { x, y, z } = getCurrentCityPos3D();
    controlsStateRef.current.targetLookAt.set(x, y, z);
    controlsStateRef.current.targetDistance = 75;
    controlsStateRef.current.phi = Math.PI / 3.0;
    soundEngine.playJadeChime(587.33);
  };

  const handleToggleTour = () => {
    setIsCinematicTour((prev) => !prev);
    soundEngine.playInkDab();
  };

  // 当前城市可创作诗词
  const currentCityPoem = useMemo(() => {
    return activePoems.find(
      (p) => p.location_id === currentLocation.id && !unlockedPoemIds.includes(p.id)
    );
  }, [activePoems, currentLocation.id, unlockedPoemIds]);

  return (
    <div className="relative w-full h-full select-none overflow-hidden bg-stone-900 font-poetry">
      {/* 3D WebGL 舞台容器 */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 顶部中央：3D千里江山视界标题与当前时空 */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 pointer-events-none flex flex-col items-center">
        <div className="px-5 py-2 rounded-full bg-stone-900/85 backdrop-blur-md border border-amber-600/40 shadow-2xl flex items-center space-x-3 text-amber-100">
          <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shadow-gold-glow" />
          <span className="text-sm font-bold tracking-widest">
            【3D 千里江山立体沙盘】
          </span>
          <span className="text-xs text-amber-200/80">
            {dynasty === 'tang' ? '盛唐' : '两宋'} · 公元 {currentYear} 年
          </span>
          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
            驻足：{currentLocation.name_cn}
          </span>
        </div>

        {/* 鼠标悬停城市提示浮标 */}
        {hoveredCityName && (
          <div className="mt-2 px-3 py-1 rounded-md bg-black/75 border border-amber-400/50 text-xs text-amber-300 font-bold animate-fadeIn">
            点击巡视：{hoveredCityName}
          </div>
        )}
      </div>

      {/* 2D / 3D 核心切换开关 (右上角显著位置) */}
      <div className="absolute top-4 right-4 z-20 flex items-center space-x-2">
        {onSwitchTo2D && (
          <button
            onClick={onSwitchTo2D}
            className="flex items-center space-x-1.5 px-4 py-2 rounded-full bg-theme-surface-card/90 hover:bg-theme-surface border border-theme-primary/40 text-theme-text hover:text-theme-primary text-xs font-bold transition-all shadow-xl active:scale-95 cursor-pointer backdrop-blur-md group"
            title="切换回 2D 详尽工笔水墨舆图"
          >
            <Compass className="w-4 h-4 text-theme-primary group-hover:rotate-45 transition-transform" />
            <span>切回 2D 舆图</span>
          </button>
        )}
      </div>

      {/* 左侧控制栏：运镜预设与时辰光影调节 */}
      <div className="absolute top-20 left-4 z-20 flex flex-col space-y-2 pointer-events-auto">
        {/* 运镜模式按钮组 */}
        <div className="p-1.5 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/60 shadow-2xl flex flex-col space-y-1 text-xs">
          <button
            onClick={handleFollowPoetCamera}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer text-left"
            title="镜头迅速聚焦至主角文人所在名城"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>聚焦文人</span>
          </button>

          <button
            onClick={handleOverviewCamera}
            className="flex items-center space-x-2 px-3 py-2 rounded-xl text-stone-300 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer text-left"
            title="镜头升空俯览华夏九州全貌"
          >
            <Eye className="w-3.5 h-3.5 text-teal-400 shrink-0" />
            <span>全景鸟瞰</span>
          </button>

          <button
            onClick={handleToggleTour}
            className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all cursor-pointer text-left ${
              isCinematicTour
                ? 'bg-amber-600 text-white font-bold shadow-gold-glow animate-pulse'
                : 'text-stone-300 hover:text-white hover:bg-stone-800'
            }`}
            title="开启电影级自动环绕漫游，领略山川险峻"
          >
            <Camera className="w-3.5 h-3.5 shrink-0" />
            <span>{isCinematicTour ? '巡航中...' : '电影级巡航'}</span>
          </button>
        </div>

        {/* 时辰光影切换 (晨曦 / 暖阳 / 晚霞 / 月夜) */}
        <div className="p-1.5 rounded-2xl bg-stone-900/85 backdrop-blur-md border border-stone-700/60 shadow-2xl flex items-center justify-between space-x-1 text-xs">
          <button
            onClick={() => setTimeOfDay('dawn')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              timeOfDay === 'dawn'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="晨曦微茫"
          >
            <Sunrise className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeOfDay('noon')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              timeOfDay === 'noon'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="午后暖阳"
          >
            <Sun className="w-4 h-4" />
          </button>
          <button
            onClick={() => setTimeOfDay('night')}
            className={`p-2 rounded-xl transition-all cursor-pointer ${
              timeOfDay === 'night'
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
            title="月夜清辉"
          >
            <Moon className="w-4 h-4" />
          </button>
        </div>

        {/* 古代官道路线开关 */}
        <button
          onClick={() => setShowRoads(!showRoads)}
          className={`flex items-center space-x-2 px-3 py-2 rounded-2xl border text-xs transition-all cursor-pointer backdrop-blur-md shadow-xl ${
            showRoads
              ? 'bg-stone-900/85 border-amber-600/50 text-amber-300'
              : 'bg-stone-900/50 border-stone-800 text-stone-500'
          }`}
          title="开关古代官道与长江水路光轨"
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{showRoads ? '官道光轨 · 开' : '官道光轨 · 隐'}</span>
        </button>
      </div>

      {/* 底部右侧：快捷创作诗词浮动光标 (若当前城市有未解锁名篇) */}
      {currentCityPoem && onSelectPoemForPlay && (
        <div className="absolute bottom-6 right-6 z-20 animate-bounce">
          <button
            onClick={() => onSelectPoemForPlay(currentCityPoem)}
            className="flex items-center space-x-2.5 px-5 py-3 rounded-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-sm shadow-2xl border-2 border-amber-300 cursor-pointer active:scale-95 transition-all"
          >
            <Sparkles className="w-5 h-5 text-amber-200 animate-spin" />
            <span>
              灵感迸发 · 创作《{currentCityPoem.title}》
            </span>
          </button>
        </div>
      )}

      {/* 底部左侧：3D 手势交互小指南 */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md text-[11px] text-stone-300 border border-stone-800">
        <Info className="w-3.5 h-3.5 text-amber-400" />
        <span>拖拽旋转视角 · 滚轮缩放 · 右键平移 · 点击城池巡视游历</span>
      </div>

      {/* 城市文化与名胜详情弹窗 (与 2D 模式完全打通) */}
      {activeCityDetail && (
        <CityDetailModal
          city={activeCityDetail}
          dynasty={dynasty}
          isCurrentLocation={activeCityDetail.id === currentLocation.id}
          onTravelHere={(locId: string) => {
            onTravel(locId);
            setActiveCityDetail(null);
            handleFollowPoetCamera();
          }}
          onClose={() => setActiveCityDetail(null)}
          onSelectPoemForPlay={onSelectPoemForPlay}
          unlockedPoemIds={unlockedPoemIds}
          activePoems={activePoems}
          unlockedArtifactIds={unlockedArtifactIds}
          onCollectArtifact={onCollectArtifact}
        />
      )}
    </div>
  );
};
