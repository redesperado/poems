import React, { useState, useRef, useEffect, useCallback } from 'react';
import * as THREE from 'three';
import { LocationData } from '../../types/location';
import { MAJOR_CITIES, CityCulturalData } from '../../data/cities';
import { CityDetailModal } from './CityDetailModal';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Compass,
  MapPin,
  Layers,
  Box,
  Mountain,
} from 'lucide-react';

interface TravelMapStageProps {
  currentLocation: LocationData;
  dynasty: 'tang' | 'song';
  onTravel: (locationId: string) => void;
  unlockedPoemIds: string[];
}

// 真实地理关键河流经纬度点集
const YELLOW_RIVER_LNG_LAT: [number, number][] = [
  [98.2, 35.8],
  [101.5, 35.8],
  [103.8, 36.05],
  [105.8, 37.5],
  [106.8, 39.0],
  [107.4, 40.8],
  [109.8, 40.8],
  [111.2, 40.3],
  [111.5, 39.5],
  [110.5, 37.8],
  [110.4, 36.1],
  [110.2, 34.6], // 潼关大拐弯
  [111.2, 34.8], // 三门峡
  [112.45, 34.9], // 洛阳北
  [114.34, 35.0], // 开封北
  [116.8, 36.5],
  [118.8, 37.6],
  [119.5, 37.8], // 入渤海
];

const YANGTZE_RIVER_LNG_LAT: [number, number][] = [
  [100.2, 27.2],
  [102.5, 27.8],
  [104.6, 28.8], // 宜宾
  [105.4, 28.9], // 泸州
  [106.5, 29.5], // 重庆
  [107.5, 29.8], // 涪陵
  [109.57, 31.04], // 白帝城夔门
  [110.0, 31.1], // 巫峡
  [111.3, 30.7], // 宜昌
  [112.2, 30.3], // 荆州
  [113.1, 29.4], // 岳阳洞庭湖
  [114.3, 30.54], // 武汉江夏
  [115.98, 29.72], // 九江浔阳/鄱阳湖
  [117.0, 30.5], // 安庆
  [118.4, 31.3], // 芜湖
  [118.79, 32.06], // 南京
  [119.41, 32.39], // 扬州
  [120.8, 31.8],
  [121.8, 31.23], // 入东海
];

const GRAND_CANAL_LNG_LAT: [number, number][] = [
  [112.45, 34.62], // 洛阳
  [114.34, 34.79], // 开封
  [117.0, 33.8],
  [119.1, 33.5], // 淮安
  [119.41, 32.39], // 扬州
  [119.5, 32.2], // 镇江
  [120.0, 31.8], // 常州
  [120.58, 31.3], // 苏州
  [120.15, 30.27], // 杭州
];

// 地理经纬度向三维沙盘坐标系转换 (X-Z 平面，Y 轴为高程)
// 地图范围：经度 98°E ~ 124°E，纬度 20°N ~ 42°N
const MAP_WIDTH = 100;
const MAP_DEPTH = 78;
const MIN_LNG = 98.0;
const MAX_LNG = 124.0;
const MIN_LAT = 20.0;
const MAX_LAT = 42.0;

export function geoTo3D(lng: number, lat: number): { x: number; z: number } {
  const normX = (lng - MIN_LNG) / (MAX_LNG - MIN_LNG);
  const normZ = (lat - MIN_LAT) / (MAX_LAT - MIN_LAT);

  const x = (normX - 0.5) * MAP_WIDTH;
  const z = -(normZ - 0.5) * MAP_DEPTH; // 北为 -Z，南为 +Z
  return { x, z };
}

// 模拟中国地形真实高程函数 (三大阶梯、秦岭横亘、巴蜀盆地凹陷、东部平原与沧海)
function calculateElevation(x: number, z: number, reliefMultiplier: number = 1.0): number {
  const normX = (x / MAP_WIDTH) + 0.5; // 0 (西) ~ 1 (东)
  const normZ = (-z / MAP_DEPTH) + 0.5; // 0 (南) ~ 1 (北)

  // 1. 中国三大阶梯基础倾角 (西高东低)
  let h = 0;
  if (normX < 0.25) {
    // 青藏高原与西部高山
    h = 5.2 + Math.sin(normX * 12) * 1.5 + Math.cos(normZ * 10) * 1.2;
  } else if (normX < 0.55) {
    // 第二阶梯黄土高原、云贵、内蒙高原
    h = 2.4 + Math.sin(normX * 8 + 1) * 0.9 + Math.cos(normZ * 6) * 0.7;
  } else {
    // 第三阶梯平原与丘陵
    h = 0.5 + Math.sin(normX * 6) * 0.35 + Math.cos(normZ * 5) * 0.3;
  }

  // 2. 秦岭与大巴山脉天险 (约 lat 33.5°~34.5°，normZ 约 0.62~0.68，normX 约 0.32~0.60)
  const qinlingZDist = Math.abs(normZ - 0.65);
  if (qinlingZDist < 0.08 && normX > 0.28 && normX < 0.62) {
    const qinlingFactor = Math.cos((qinlingZDist / 0.08) * (Math.PI / 2));
    h += 3.8 * qinlingFactor * Math.sin((normX - 0.28) / 0.34 * Math.PI);
  }

  // 3. 太行山脉 (normX 约 0.55~0.60，normZ 约 0.70~0.92)
  const taihangXDist = Math.abs(normX - 0.57);
  if (taihangXDist < 0.04 && normZ > 0.70 && normZ < 0.92) {
    const taihangFactor = Math.cos((taihangXDist / 0.04) * (Math.PI / 2));
    h += 2.8 * taihangFactor;
  }

  // 4. 四川盆地凹陷 (normX 约 0.20~0.33，normZ 约 0.44~0.58)
  const sichuanCenterDist = Math.hypot(normX - 0.265, normZ - 0.51);
  if (sichuanCenterDist < 0.11) {
    const basinDepression = Math.cos((sichuanCenterDist / 0.11) * (Math.PI / 2)) * 2.2;
    h = Math.max(0.9, h - basinDepression);
  }

  // 5. 巫山与三峡峡谷突起 (normX 约 0.42~0.47，normZ 约 0.48~0.53)
  const wushanDist = Math.hypot(normX - 0.44, normZ - 0.50);
  if (wushanDist < 0.05) {
    h += 2.5 * Math.cos((wushanDist / 0.05) * (Math.PI / 2));
  }

  // 6. 东部海岸线与东海/黄海下陷 (normX > 0.88 或东南部)
  if (normX > 0.82) {
    const coastalSlope = (normX - 0.82) / 0.18;
    h = h * Math.max(0, 1 - coastalSlope * 1.3);
  }

  // 7. 高山与峰峦微扰 (高频纹理，增添山河立体层次)
  const mountainRuggedness =
    Math.sin(x * 0.45) * Math.cos(z * 0.45) * 0.35 +
    Math.sin(x * 0.9 + 1.2) * Math.cos(z * 0.8 + 0.5) * 0.18;

  const finalHeight = Math.max(0.12, (h + mountainRuggedness) * reliefMultiplier);
  return finalHeight;
}

// 根据高度与坡度计算水墨新东方青绿着色
function getTerrainColor(height: number, normX: number): THREE.Color {
  // 海洋与潮间滩涂
  if (normX > 0.88 && height < 0.3) {
    return new THREE.Color(0x0f766e); // 沧海青碧
  }
  // 平原与江南水乡 (低海拔)
  if (height < 1.4) {
    // 晨露草木新绿与浅青瓷
    return new THREE.Color(0xd7e7dd).lerp(new THREE.Color(0xb5d6c3), height / 1.4);
  }
  // 丘陵与中原腹地 (中低海拔)
  if (height < 3.2) {
    return new THREE.Color(0xb5d6c3).lerp(new THREE.Color(0x739c82), (height - 1.4) / 1.8);
  }
  // 崇山峻岭与秦岭太行 (中高海拔)
  if (height < 5.5) {
    return new THREE.Color(0x739c82).lerp(new THREE.Color(0x355345), (height - 3.2) / 2.3);
  }
  // 西部高原与雪峰崖壁 (最高海拔)
  return new THREE.Color(0x355345).lerp(new THREE.Color(0xedf2f0), Math.min(1.0, (height - 5.5) / 2.5));
}

export const TravelMapStage: React.FC<TravelMapStageProps> = ({
  currentLocation,
  dynasty,
  onTravel,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [activeCityDetail, setActiveCityDetail] = useState<CityCulturalData | null>(null);

  // 视角模式与状态
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const [reliefLevel, setReliefLevel] = useState<number>(1.2); // 地形立体强化倍率
  const [screenCoords, setScreenCoords] = useState<Record<string, { x: number; y: number; visible: boolean }>>({});

  // Three.js 核心对象引用保存
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const terrainMeshRef = useRef<THREE.Mesh | null>(null);
  const beaconGroupRef = useRef<THREE.Group | null>(null);
  const currentPinRippleRef = useRef<THREE.Mesh | null>(null);
  const animFrameIdRef = useRef<number>(0);

  // 交互控制状态
  const isDraggingRef = useRef(false);
  const isRightDraggingRef = useRef(false);
  const previousMousePositionRef = useRef({ x: 0, y: 0 });
  const cameraTargetRef = useRef<THREE.Vector3>(new THREE.Vector3(0, 0, -2));
  const cameraSphericalRef = useRef({
    radius: 95,
    theta: 0, // 水平方位角
    phi: Math.PI / 3.4, // 俯仰倾斜角 (约 53度 3D 鸟瞰)
  });

  // 更新相机位置
  const updateCameraPosition = useCallback(() => {
    if (!cameraRef.current) return;
    const { radius, theta, phi } = cameraSphericalRef.current;
    const target = cameraTargetRef.current;

    const x = target.x + radius * Math.sin(phi) * Math.sin(theta);
    const y = target.y + radius * Math.cos(phi);
    const z = target.z + radius * Math.sin(phi) * Math.cos(theta);

    cameraRef.current.position.set(x, y, z);
    cameraRef.current.lookAt(target);
  }, []);

  // 重置视角
  const handleResetView = useCallback(() => {
    cameraTargetRef.current.set(0, 0, -2);
    if (viewMode === '3d') {
      cameraSphericalRef.current = {
        radius: 95,
        theta: 0,
        phi: Math.PI / 3.4,
      };
    } else {
      cameraSphericalRef.current = {
        radius: 100,
        theta: 0,
        phi: 0.01, // 接近垂直正俯视
      };
    }
    updateCameraPosition();
  }, [viewMode, updateCameraPosition]);

  // 切换 3D 沙盘视角 vs 2D 顶视地图
  const toggleViewMode = useCallback(() => {
    const nextMode = viewMode === '3d' ? '2d' : '3d';
    setViewMode(nextMode);
    if (nextMode === '2d') {
      cameraSphericalRef.current.phi = 0.01;
      cameraSphericalRef.current.theta = 0;
    } else {
      cameraSphericalRef.current.phi = Math.PI / 3.4;
    }
    updateCameraPosition();
  }, [viewMode, updateCameraPosition]);

  // 放大
  const handleZoomIn = () => {
    cameraSphericalRef.current.radius = Math.max(35, cameraSphericalRef.current.radius * 0.82);
    updateCameraPosition();
  };

  // 缩小
  const handleZoomOut = () => {
    cameraSphericalRef.current.radius = Math.min(150, cameraSphericalRef.current.radius * 1.22);
    updateCameraPosition();
  };

  // 切换地形高程强化
  const toggleRelief = () => {
    setReliefLevel((prev) => (prev >= 1.5 ? 1.0 : prev + 0.3));
  };

  // =========================================================================
  // Three.js 场景初始化与生命周期
  // =========================================================================
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 600;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0xf3f7f4); // 晨露微冷白底色

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000);
    cameraRef.current = camera;
    updateCameraPosition();

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      alpha: true,
    });
    rendererRef.current = renderer;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 清理旧 canvas 并挂载
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // 4. 灯光系统 (模拟晴空日照与山间柔和天光)
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    scene.add(ambientLight);

    // 主方向光 (斜射阳光，刻画山脉阴影)
    const sunLight = new THREE.DirectionalLight(0xfff7ed, 1.35);
    sunLight.position.set(45, 80, 50);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 10;
    sunLight.shadow.camera.far = 200;
    const shadowDist = 65;
    sunLight.shadow.camera.left = -shadowDist;
    sunLight.shadow.camera.right = shadowDist;
    sunLight.shadow.camera.top = shadowDist;
    sunLight.shadow.camera.bottom = -shadowDist;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    // 辅助补光 (来自背面的柔和青绿天光)
    const fillLight = new THREE.DirectionalLight(0xccfbf1, 0.45);
    fillLight.position.set(-50, 40, -40);
    scene.add(fillLight);

    // 5. 三维沙盘台座 (沙盘基座木质/墨玉底座)
    const pedestalGeo = new THREE.BoxGeometry(MAP_WIDTH + 4, 3, MAP_DEPTH + 4);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x1b2823, // 墨绿青铜玉质底座
      roughness: 0.6,
      metalness: 0.2,
    });
    const pedestalMesh = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestalMesh.position.set(0, -1.6, 0);
    pedestalMesh.receiveShadow = true;
    scene.add(pedestalMesh);

    // 金玉台座内线装饰边框
    const frameGeo = new THREE.BoxGeometry(MAP_WIDTH + 0.8, 0.3, MAP_DEPTH + 0.8);
    const frameMat = new THREE.MeshStandardMaterial({
      color: 0xb45309, // 沉古金描边
      roughness: 0.3,
      metalness: 0.7,
    });
    const frameMesh = new THREE.Mesh(frameGeo, frameMat);
    frameMesh.position.set(0, -0.15, 0);
    scene.add(frameMesh);

    // 6. 三维地形曲面 (细分网格 + 顶点高度计算 + 顶点着色)
    const segX = 120;
    const segZ = 90;
    const terrainGeo = new THREE.PlaneGeometry(MAP_WIDTH, MAP_DEPTH, segX, segZ);
    terrainGeo.rotateX(-Math.PI / 2); // 旋转平卧在 X-Z 平面

    const posAttr = terrainGeo.attributes.position;
    const colors: number[] = [];

    for (let i = 0; i < posAttr.count; i++) {
      const vx = posAttr.getX(i);
      const vz = posAttr.getZ(i);

      // 计算地形真实高程
      const vy = calculateElevation(vx, vz, reliefLevel);
      posAttr.setY(i, vy);

      // 计算顶点青绿着色
      const normX = vx / MAP_WIDTH + 0.5;
      const c = getTerrainColor(vy, normX);
      colors.push(c.r, c.g, c.b);
    }

    terrainGeo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    terrainGeo.computeVertexNormals();

    const terrainMat = new THREE.MeshStandardMaterial({
      vertexColors: true,
      roughness: 0.82,
      metalness: 0.08,
      flatShading: false,
    });
    const terrainMesh = new THREE.Mesh(terrainGeo, terrainMat);
    terrainMesh.castShadow = true;
    terrainMesh.receiveShadow = true;
    scene.add(terrainMesh);
    terrainMeshRef.current = terrainMesh;

    // 7. 三维江海水体雕刻 (黄河泥金光流、长江碧水东流、运河水系)
    const create3DRiver = (coords: [number, number][], colorHex: number, riverRadius: number) => {
      const pts3D: THREE.Vector3[] = coords.map(([lng, lat]) => {
        const { x, z } = geoTo3D(lng, lat);
        const y = calculateElevation(x, z, reliefLevel) + 0.16; // 贴地略微浮起
        return new THREE.Vector3(x, y, z);
      });

      const curve = new THREE.CatmullRomCurve3(pts3D);
      const tubeGeo = new THREE.TubeGeometry(curve, 100, riverRadius, 8, false);
      const tubeMat = new THREE.MeshStandardMaterial({
        color: colorHex,
        roughness: 0.2,
        metalness: 0.3,
        emissive: colorHex,
        emissiveIntensity: 0.25,
      });
      const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
      scene.add(tubeMesh);
      return tubeMesh;
    };

    // 黄河之水天上来 (泥金色)
    create3DRiver(YELLOW_RIVER_LNG_LAT, 0xd97706, 0.42);
    // 万里长江浩荡东去 (碧水青玉色)
    create3DRiver(YANGTZE_RIVER_LNG_LAT, 0x0d9488, 0.46);
    // 京杭大运河 (青翠翡翠色)
    create3DRiver(GRAND_CANAL_LNG_LAT, 0x059669, 0.24);

    // 8. 名城三维地标灯柱组 (Beacons Group)
    const beaconGroup = new THREE.Group();
    scene.add(beaconGroup);
    beaconGroupRef.current = beaconGroup;

    Object.values(MAJOR_CITIES).forEach((city) => {
      const { x, z } = geoTo3D(city.coordinates[0], city.coordinates[1]);
      const y = calculateElevation(x, z, reliefLevel);

      const isCurrent =
        city.id === currentLocation.id ||
        (currentLocation.name_cn && city.name_cn.includes(currentLocation.name_cn));

      // 3D 柱体
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.4, 2.2, 8);
      const pillarMat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0xb45309 : 0x047857,
        emissive: isCurrent ? 0xb45309 : 0x047857,
        emissiveIntensity: isCurrent ? 0.6 : 0.25,
        roughness: 0.3,
      });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, y + 1.1, z);
      beaconGroup.add(pillar);

      // 柱顶发光光珠
      const orbGeo = new THREE.SphereGeometry(isCurrent ? 0.65 : 0.45, 12, 12);
      const orbMat = new THREE.MeshStandardMaterial({
        color: isCurrent ? 0xf59e0b : 0x10b981,
        emissive: isCurrent ? 0xf59e0b : 0x059669,
        emissiveIntensity: 0.8,
      });
      const orb = new THREE.Mesh(orbGeo, orbMat);
      orb.position.set(x, y + 2.3, z);
      beaconGroup.add(orb);

      // 当前所在地的呼吸光环
      if (isCurrent) {
        const ringGeo = new THREE.RingGeometry(0.8, 1.4, 24);
        ringGeo.rotateX(-Math.PI / 2);
        const ringMat = new THREE.MeshBasicMaterial({
          color: 0xb45309,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0.8,
        });
        const ringMesh = new THREE.Mesh(ringGeo, ringMat);
        ringMesh.position.set(x, y + 0.1, z);
        beaconGroup.add(ringMesh);
        currentPinRippleRef.current = ringMesh;
      }
    });

    // 9. 动画与渲染循环 (实时计算 3D 标签向 2D 屏幕投影)
    let animationTime = 0;
    const renderLoop = () => {
      animationTime += 0.025;

      // 当前所在地光环呼吸动效
      if (currentPinRippleRef.current) {
        const scale = 1.0 + Math.sin(animationTime * 3) * 0.35;
        currentPinRippleRef.current.scale.set(scale, scale, scale);
      }

      renderer.render(scene, camera);

      // 计算所有名城在 2D 屏幕坐标系中的投影位置
      const nextCoords: Record<string, { x: number; y: number; visible: boolean }> = {};
      const halfW = container.clientWidth / 2;
      const halfH = container.clientHeight / 2;

      Object.values(MAJOR_CITIES).forEach((city) => {
        const { x, z } = geoTo3D(city.coordinates[0], city.coordinates[1]);
        const y = calculateElevation(x, z, reliefLevel) + 2.8;

        const pos = new THREE.Vector3(x, y, z);
        pos.project(camera);

        // 判断是否在屏幕正面视野内
        const isVisible = pos.z < 1.0 && pos.x >= -1.2 && pos.x <= 1.2 && pos.y >= -1.2 && pos.y <= 1.2;

        nextCoords[city.id] = {
          x: pos.x * halfW + halfW,
          y: -pos.y * halfH + halfH,
          visible: isVisible,
        };
      });

      setScreenCoords(nextCoords);
      animFrameIdRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    // 10. 视口大小自适应监听
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const nw = container.clientWidth;
      const nh = container.clientHeight;
      cameraRef.current.aspect = nw / nh;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(nw, nh);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      terrainGeo.dispose();
      pedestalGeo.dispose();
      frameGeo.dispose();
    };
  }, [reliefLevel, currentLocation, updateCameraPosition]);

  // =========================================================================
  // 鼠标与触控漫游交互事件处理
  // =========================================================================
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      isDraggingRef.current = true;
    } else if (e.button === 2) {
      isRightDraggingRef.current = true;
    }
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const deltaX = e.clientX - previousMousePositionRef.current.x;
    const deltaY = e.clientY - previousMousePositionRef.current.y;
    previousMousePositionRef.current = { x: e.clientX, y: e.clientY };

    // 左键拖拽：在 X-Z 地图平面平移
    if (isDraggingRef.current) {
      const panSpeed = cameraSphericalRef.current.radius * 0.0012;
      const theta = cameraSphericalRef.current.theta;

      // 根据当前朝向计算世界坐标平移
      const moveX = (-deltaX * Math.cos(theta) - deltaY * Math.sin(theta)) * panSpeed;
      const moveZ = (deltaX * Math.sin(theta) - deltaY * Math.cos(theta)) * panSpeed;

      cameraTargetRef.current.x = Math.max(-45, Math.min(45, cameraTargetRef.current.x + moveX));
      cameraTargetRef.current.z = Math.max(-35, Math.min(35, cameraTargetRef.current.z + moveZ));
      updateCameraPosition();
    }

    // 右键拖拽（或按住 Shift 左键拖拽）：旋转水平方位角与俯仰角
    if (isRightDraggingRef.current || (isDraggingRef.current && e.shiftKey)) {
      const rotSpeed = 0.006;
      cameraSphericalRef.current.theta -= deltaX * rotSpeed;
      cameraSphericalRef.current.phi = Math.max(
        0.05,
        Math.min(Math.PI / 2.1, cameraSphericalRef.current.phi + deltaY * rotSpeed)
      );
      updateCameraPosition();
    }
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
    isRightDraggingRef.current = false;
  };

  // 鼠标滚轮缩放
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomFactor = e.deltaY < 0 ? 0.9 : 1.11;
    cameraSphericalRef.current.radius = Math.max(
      32,
      Math.min(145, cameraSphericalRef.current.radius * zoomFactor)
    );
    updateCameraPosition();
  };

  // 移动端单指平移与双指捏合缩放
  const touchStartDistRef = useRef<number | null>(null);
  const touchLastPosRef = useRef<{ x: number; y: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchLastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      touchStartDistRef.current = null;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchStartDistRef.current = Math.hypot(dx, dy);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && touchLastPosRef.current) {
      const deltaX = e.touches[0].clientX - touchLastPosRef.current.x;
      const deltaY = e.touches[0].clientY - touchLastPosRef.current.y;
      touchLastPosRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };

      const panSpeed = cameraSphericalRef.current.radius * 0.0012;
      const theta = cameraSphericalRef.current.theta;
      const moveX = (-deltaX * Math.cos(theta) - deltaY * Math.sin(theta)) * panSpeed;
      const moveZ = (deltaX * Math.sin(theta) - deltaY * Math.cos(theta)) * panSpeed;

      cameraTargetRef.current.x = Math.max(-45, Math.min(45, cameraTargetRef.current.x + moveX));
      cameraTargetRef.current.z = Math.max(-35, Math.min(35, cameraTargetRef.current.z + moveZ));
      updateCameraPosition();
    } else if (e.touches.length === 2 && touchStartDistRef.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      if (dist > 10) {
        const factor = touchStartDistRef.current / dist;
        touchStartDistRef.current = dist;
        cameraSphericalRef.current.radius = Math.max(
          32,
          Math.min(145, cameraSphericalRef.current.radius * factor)
        );
        updateCameraPosition();
      }
    }
  };

  const handleTouchEnd = () => {
    touchLastPosRef.current = null;
    touchStartDistRef.current = null;
  };

  // 城市列表
  const cityList = Object.values(MAJOR_CITIES);

  return (
    <div
      className="relative w-full h-full flex-1 overflow-hidden select-none bg-[#F4F7F3] touch-none"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onContextMenu={(e) => e.preventDefault()}
      onWheel={handleWheel}
    >
      {/* 1. WebGL 3D 渲染挂载画布 */}
      <div ref={mountRef} className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing" />

      {/* 2. 覆盖层：投影到 2D 视口的全部名城高清玉牌 (黑字锐利，全域探索) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {cityList.map((city) => {
          const coords = screenCoords[city.id];
          if (!coords || !coords.visible) return null;

          const isCurrent =
            city.id === currentLocation.id ||
            (currentLocation.name_cn && city.name_cn.includes(currentLocation.name_cn));
          const dynastyData = dynasty === 'tang' ? city.tang : city.song;
          const dynastyName = dynastyData.name || city.name_cn;

          return (
            <div
              key={city.id}
              style={{
                left: `${coords.x}px`,
                top: `${coords.y}px`,
                transform: 'translate(-50%, -100%)',
              }}
              className="absolute pointer-events-auto z-20"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveCityDetail(city);
                }}
                className={`group relative flex flex-col items-center transition-transform duration-200 ${
                  isCurrent ? 'scale-110 z-30' : 'hover:scale-115 hover:z-25'
                }`}
              >
                {/* 城市名牌 (深黑色文字，极高对比度，告别发虚发白) */}
                <div
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-full font-poetry whitespace-nowrap shadow-md border backdrop-blur-md transition-all ${
                    isCurrent
                      ? 'bg-amber-600 text-white border-amber-300 font-bold shadow-amber-500/30 ring-2 ring-white/80'
                      : 'bg-white/95 text-[#09131C] border-emerald-700/40 font-semibold group-hover:border-emerald-600 group-hover:bg-emerald-50'
                  }`}
                >
                  <MapPin
                    className={`w-3 h-3 ${isCurrent ? 'text-white' : 'text-emerald-700'}`}
                  />
                  <span className="text-xs tracking-wide">{dynastyName}</span>
                </div>

                {/* 底部定位针尖小倒三角 */}
                <div
                  className={`w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] ${
                    isCurrent ? 'border-t-amber-600' : 'border-t-white/95'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>

      {/* 3. 悬浮的 3D/2D 模式与缩放控制器 (右下角) */}
      <div className="absolute right-4 bottom-24 z-30 flex flex-col items-center bg-white/95 backdrop-blur-md border border-slate-300/80 rounded-2xl p-1.5 shadow-xl space-y-1.5">
        {/* 3D 鸟瞰 vs 2D 顶视切换 */}
        <button
          onClick={toggleViewMode}
          title={viewMode === '3d' ? '切换为 2D 顶视平览' : '切换为 3D 鸟瞰沙盘'}
          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
            viewMode === '3d'
              ? 'bg-emerald-700 text-white shadow-sm'
              : 'text-slate-800 hover:bg-slate-100 hover:text-emerald-800'
          }`}
        >
          {viewMode === '3d' ? <Box className="w-4 h-4" /> : <Layers className="w-4 h-4" />}
        </button>

        {/* 地形立体起伏强化 */}
        <button
          onClick={toggleRelief}
          title={`当前地形起伏: ${reliefLevel.toFixed(1)}x (点击切换)`}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 transition-all relative"
        >
          <Mountain className="w-4 h-4" />
          <span className="absolute bottom-1 right-1 text-[8px] font-bold text-emerald-800">
            {reliefLevel.toFixed(1)}x
          </span>
        </button>

        <div className="w-5 h-[1px] bg-slate-300 my-0.5" />

        {/* 放大 */}
        <button
          onClick={handleZoomIn}
          title="拉近视角"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        {/* 缩小 */}
        <button
          onClick={handleZoomOut}
          title="拉远全览"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-5 h-[1px] bg-slate-300 my-0.5" />

        {/* 复位 */}
        <button
          onClick={handleResetView}
          title="复位视角"
          className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-800 hover:bg-slate-100 hover:text-emerald-800 active:scale-95 transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* 4. 探索操作指南与当前位置 (左下角) */}
      <div className="absolute left-4 bottom-24 z-20 hidden sm:flex items-center space-x-3 bg-white/95 backdrop-blur-md border border-slate-300/80 px-4 py-2 rounded-full text-xs text-[#09131C] shadow-lg">
        <Compass className="w-4 h-4 text-emerald-700 shrink-0" />
        <span className="font-medium">
          左键平移 · 右键(或Shift)旋转俯仰 · 滚轮缩放 · 点击名城开启当朝风土人文
        </span>
      </div>

      {/* 5. 城市人文详情弹窗 (点击任意地名时展开，严格只呈现当前朝代信息) */}
      {activeCityDetail && (
        <CityDetailModal
          city={activeCityDetail}
          dynasty={dynasty}
          isCurrentLocation={Boolean(
            activeCityDetail.id === currentLocation.id ||
            (currentLocation.name_cn && activeCityDetail.name_cn.includes(currentLocation.name_cn))
          )}
          onTravelHere={(cityId) => {
            onTravel(cityId);
          }}
          onClose={() => setActiveCityDetail(null)}
        />
      )}
    </div>
  );
};
