import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import Stats from 'three/addons/libs/stats.module.js';

let camera,
    scene,
    renderer,
    stats = {};
function init() {
    // 场景
    scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x000000, 0.0008);

    //添加物体
    const TextureLoader = new THREE.TextureLoader();
    const assignSRGB = (texture) => {
        texture.colorSpace = THREE.SRGBColorSpace;
    };

    const textureCube = new THREE.CubeTextureLoader().setPath('../src/assets/env/').load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);

    const sprite1 = TextureLoader.load('../src/assets/images/snowflake1.png', assignSRGB);
    const sprite2 = TextureLoader.load('../src/assets/images/snowflake2.png', assignSRGB);
    const sprite3 = TextureLoader.load('../src/assets/images/snowflake3.png', assignSRGB);
    const sprite4 = TextureLoader.load('../src/assets/images/snowflake4.png', assignSRGB);
    const sprite5 = TextureLoader.load('../src/assets/images/snowflake5.png', assignSRGB);

    const geometry = new THREE.BufferGeometry();
    const vertices = [];
    for (let i = 0; i < 3000; i++) {
        const x = Math.random() * 2000 - 1000;
        const y = Math.random() * 2000 - 1000;
        const z = Math.random() * 2000 - 1000;
        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    let parameters = [
        [sprite1, 10],
        [sprite2, 20],
        [sprite3, 15],
        [sprite4, 5],
        [sprite5, 8],
    ];
    let materials = [];
    for (let i = 0; i < parameters.length; i++) {
        const sprite = parameters[i][0];
        const size = parameters[i][1];
        materials[i] = new THREE.PointsMaterial({
            size: size,
            map: sprite,
            blending: THREE.AdditiveBlending,
            depthTest: false,
            transparent: true,
        });

        const particles = new THREE.Points(geometry, materials[i]);
        particles.rotation.x = Math.random() * 6;
        particles.rotation.y = Math.random() * 6;
        particles.rotation.z = Math.random() * 6;
        scene.add(particles);
    }
    scene.background = textureCube;


    // 相机
    camera = new THREE.PerspectiveCamera(
        60, // 视野角度
        window.innerWidth / window.innerHeight, // 长宽比
        0.1, // 近截面（near）
        1000 // 远截面（far）
    );
    camera.position.set(20, 0, 20);
    camera.lookAt(0, 40, 0);

    // 光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // 渲染器
    renderer = new THREE.WebGLRenderer({ antialias: true });
    // 获取你屏幕对应的设备像素比.devicePixelRatio告诉threejs,以免渲染模糊问题
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
    document.body.appendChild(renderer.domElement);
    window.onresize = onWindowResize;
    initHelper();
}

function animate() {
    const time = Date.now() * 0.00005;
    for (let i = 0; i < scene.children.length; i++) {
        const object = scene.children[i];
        if (object instanceof THREE.Points) {
            object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
        }
    }

    // 浏览器刷新的时候渲染器重新渲染
    renderer.render(scene, camera);
    requestAnimationFrame(animate);
    stats.update();
}

function onWindowResize() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    // 如果相机的一些属性发生了变化，需要执行updateProjectionMatrix ()方法更新相机的投影矩阵
    camera.updateProjectionMatrix();
}

function initHelper() {
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.maxDistance = 100;
    controls.maxPolarAngle = THREE.MathUtils.degToRad(90);
    controls.addEventListener('change', () => {
        renderer.render(scene, camera);
    });

    //创建stats对象
    stats = new Stats();
    //stats.domElement:web页面上输出计算结果,一个div元素，
    document.body.appendChild(stats.domElement);
}

init();
animate();
