var THREE = require('three');

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

var scene = new THREE.Scene();

//create a blue LineBasicMaterial
var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );

var points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

var geometry = new THREE.BufferGeometry().setFromPoints( points );

var line = new THREE.Line( geometry, material );
scene.add( line );
renderer.render( scene, camera );

function animate() {
  requestAnimationFrame(animate);

  line.rotation.x += 0.01;
  line.rotation.y += 0.01;

  renderer.render(scene, camera);
}
animate();
