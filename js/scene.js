var $ = require('jquery');
var THREE = window.THREE = require('three');
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/loaders/MTLLoader');
require('three/examples/js/controls/OrbitControls');
require('three/examples/js/loaders/PCDLoader');

var scene = new THREE.Scene();
scene.background = new THREE.Color(0xeeeeee);

resetCamera = function() {
  camera.position.set(-0.7, -0.1, 0.6);
  camera.rotation.set(0, 0, 0);
  camera.up.set(0, 0, 1);
}

camera = new THREE.PerspectiveCamera(30, 640 / 480, 0.01, 1000);
// var camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 0.01, 1000);
resetCamera();

var ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

var pointLight = new THREE.PointLight(0xffffff, 0.8);
camera.add( pointLight );

var renderer = new THREE.WebGLRenderer();
// renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setSize(640, 480);
document.getElementById("canvas").appendChild(renderer.domElement);
// document.body.appendChild(renderer.domElement);

var manager = new THREE.LoadingManager();

var onProgress = function(xhr) {};
var onError = function() {};

controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;

toggleRotateCamera = function() {
  controls.autoRotate = !controls.autoRotate;
}

$.ajax({
  type: 'GET',
  url: '../examples/data/scene/0002-meta.json',
  dataType: 'json',
  success: function(data) {
    for (var i = 0; i < data.poses.length; i++) {
      loadObject(data, index=i);
    }
    var pose = data.poses[2];
    controls.target.set(pose.position[0] - 0.3, pose.position[1], pose.position[2]);

    for (var i = 0; i < data.camera_poses.length; i++) {
      loadCameraMarker(data.camera_poses[i].position, data.camera_poses[i].quaternion);
    }
  },
  async: false
});

function loadCameraMarker(position, quaternion) {
  var points = [
    new THREE.Vector3(0.013, 0.01, 0.03),
    new THREE.Vector3(-0.013, 0.01, 0.03),
    new THREE.Vector3(-0.013, -0.01, 0.03),
    new THREE.Vector3(0.013, -0.01, 0.03),
  ];
  var material = new THREE.LineBasicMaterial({color: 0x0000ff});
  for (var i = 0; i < points.length; i++) {
    var geometry = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(0, 0, 0), points[i]]);
    var line = new THREE.Line(geometry, material);
    line.position.set(position[0], position[1], position[2]);
    line.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
    scene.add(line);

    if (i < points.length - 1) {
      var geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[i + 1]]);
    } else {
      var geometry = new THREE.BufferGeometry().setFromPoints([points[i], points[0]]);
    }
    var line = new THREE.Line(geometry, material);
    line.position.set(position[0], position[1], position[2]);
    line.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]);
    scene.add(line);
  }
}

function loadObject(data, index) {
  new THREE.MTLLoader(manager)
    .setPath('../examples/data/models/' + data.poses[index].class_name + '/')
    .load('textured.mtl', function(materials) {
      materials.preload();
      new THREE.OBJLoader(manager)
        .setMaterials(materials)
        .setPath('../examples/data/models/' + data.poses[index].class_name + '/')
        .load('textured.obj', function(object) {
          object.position.x = data.poses[index].position[0];
          object.position.y = data.poses[index].position[1];
          object.position.z = data.poses[index].position[2];
          object.quaternion.x = data.poses[index].quaternion[0];
          object.quaternion.y = data.poses[index].quaternion[1];
          object.quaternion.z = data.poses[index].quaternion[2];
          object.quaternion.w = data.poses[index].quaternion[3];
          scene.add(object);
        }, onProgress, onError);
    });
}

function animate() {
  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}
animate();
