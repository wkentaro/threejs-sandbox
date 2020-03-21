var THREE = window.THREE = require('three');
require('three/examples/js/loaders/OBJLoader');
require('three/examples/js/loaders/MTLLoader');

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

var ambientLight = new THREE.AmbientLight( 0xffffff, 0.8 );
scene.add( ambientLight );

// var pointLight = new THREE.PointLight( 0xffffff, 0.8 );
// camera.add( pointLight );

var renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

var manager = new THREE.LoadingManager();

var onProgress = function ( xhr ) {

        if ( xhr.lengthComputable ) {

                var percentComplete = xhr.loaded / xhr.total * 100;
                console.log( Math.round( percentComplete, 2 ) + '% downloaded' );

        }

};

var onError = function () { };

var drill;

new THREE.MTLLoader( manager )
        .setPath( 'https://raw.githubusercontent.com/mmatl/pyrender/master/examples/models/' )
        .load( 'drill.obj.mtl', function ( materials ) {

                materials.preload();

                new THREE.OBJLoader( manager )
                        .setMaterials( materials )
                        .setPath( 'https://raw.githubusercontent.com/mmatl/pyrender/master/examples/models/' )
                        .load( 'drill.obj', function ( object ) {

                                drill = object;
                                scene.add( object );

                        }, onProgress, onError );

        } );

camera.position.z = 0.3;

function animate() {
  requestAnimationFrame(animate);

  if (drill) {
    drill.rotation.x += 0.01;
    drill.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}
animate();
