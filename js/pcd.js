var THREE = window.THREE = require('three');
require('three/examples/js/loaders/PCDLoader');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var loader = new THREE.PCDLoader();

var bunny;

loader.load('https://raw.githubusercontent.com/PointCloudLibrary/pcl/master/test/bunny.pcd', function(pcd) {
    bunny = pcd;
    scene.add(pcd);
}, undefined, function(error) {
    console.error(error);
});

camera.position.z = 0.3;

function animate() {
    requestAnimationFrame(animate);

    if (bunny) {
        bunny.rotation.x += 0.01;
        bunny.rotation.y += 0.01;
    }

    renderer.render(scene, camera);
}
animate();
