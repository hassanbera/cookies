const firstText = document.querySelector("#firstText");
const lastText = document.querySelector("#lastText");
const submitBtn = document.querySelector("#submitBtn");
const cookieBtn = document.querySelector("#cookieBtn");
const deleteBtn = document.querySelector("#deleteBtn");
const cookieStatus = document.getElementById("cookieStatus");

// Three.js setup
let scene, camera, renderer, cookieMesh, crackMeshes = [], chips = [];
const canvas = document.getElementById("cookieCanvas");

function initThreeCookie() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
    renderer.setSize(220, 220);
    camera.position.z = 3.5;

    // Cookie geometry (thick cylinder)
    const geometry = new THREE.CylinderGeometry(1, 1, 0.4, 64);
    const material = new THREE.MeshStandardMaterial({ color: 0xd2a86a });
    cookieMesh = new THREE.Mesh(geometry, material);
    scene.add(cookieMesh);

    // Chocolate chips as child meshes
    chips = [];
    for (let i = 0; i < 8; i++) {
        const chipGeo = new THREE.SphereGeometry(0.11, 16, 16);
        const chipMat = new THREE.MeshStandardMaterial({ color: 0x4b2e13 });
        const chip = new THREE.Mesh(chipGeo, chipMat);
        const angle = Math.random() * Math.PI * 2;
        const radius = 0.7 + Math.random() * 0.15;
        chip.position.x = Math.cos(angle) * radius;
        chip.position.y = Math.sin(angle) * radius;
        chip.position.z = 0.22; // slightly above cookie surface
        cookieMesh.add(chip);
        chips.push(chip);
    }

    // Light
    const light = new THREE.PointLight(0xffffff, 1, 100);
    light.position.set(2, 2, 4);
    scene.add(light);

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    if (cookieMesh) {
        cookieMesh.rotation.z += 0.008; // horizontal spin
        cookieMesh.rotation.x += 0.006; // vertical spin
    }
    renderer.render(scene, camera);
}

function showCookie() {
    if (!scene) initThreeCookie();
    canvas.style.display = "block";
}

function hideCookie() {
    canvas.style.display = "none";
    // Remove crack meshes if any
    crackMeshes.forEach(m => scene.remove(m));
    crackMeshes = [];
}

function crackCookie() {
    // Add crack lines
    for (let i = 0; i < 5; i++) {
        const crackGeo = new THREE.BufferGeometry();
        const x1 = Math.cos((i/5)*Math.PI*2) * 0.2;
        const y1 = Math.sin((i/5)*Math.PI*2) * 0.2;
        const x2 = Math.cos((i/5)*Math.PI*2) * 0.9;
        const y2 = Math.sin((i/5)*Math.PI*2) * 0.9;
        const vertices = new Float32Array([x1, y1, 0, x2, y2, 0]);
        crackGeo.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
        const crackMat = new THREE.LineBasicMaterial({ color: 0x7a5c2e });
        const crack = new THREE.Line(crackGeo, crackMat);
        scene.add(crack);
        crackMeshes.push(crack);
    }
    setTimeout(hideCookie, 1200);
}

function setCookie(name, value , daysToLive){
    const date = new Date();
    date.setTime(date.getTime() + (daysToLive*24*60*60*1000));
    let expires = "expires="+date.toUTCString();
    document.cookie = `${name}=${value}; ${expires}; path=/`;
}

function deleteCookie(name){
    setCookie(name, null, null);
}

function getCookie(name){
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split("; ");
    let result = null;
    cArray.forEach(element =>{
        if(element.indexOf(name) == 0){
            result = element.substring(name.length+1)
        }
    })
    return result;
}

function hasCookies() {
    return getCookie("firstName") || getCookie("lastName");
}

submitBtn.addEventListener("click", ()=> {
    setCookie("firstName", firstText.value, 365);
    setCookie("lastName",lastText.value, 365);
    cookieStatus.textContent = "Cookie set!";
    showCookie();
});

cookieBtn.addEventListener("click", ()=>{
    firstText.value = getCookie("firstName") || "";
    lastText.value = getCookie("lastName") || "";
    cookieStatus.textContent = hasCookies() ? "Cookie loaded!" : "No cookie found.";
    if (hasCookies()) showCookie();
    else hideCookie();
});

deleteBtn.addEventListener("click", ()=> {
    deleteCookie("firstName");
    deleteCookie("lastName");
    cookieStatus.textContent = "Cookie deleted!";
    crackCookie();
});

// On load, show cookie if exists
window.addEventListener("DOMContentLoaded", () => {
    if (hasCookies()) {
        showCookie();
        cookieStatus.textContent = "Cookie loaded!";
    } else {
        hideCookie();
    }
});

