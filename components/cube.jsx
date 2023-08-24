import React, {useState, useEffect} from 'react';
import { View } from 'react-native';
import * as THREE from 'three';
import { Renderer } from 'expo-three';
import { GLView } from 'expo-gl';
import * as scrambler from 'cube-scramble.js';
import { styles } from "../styles/default"

const Cube = (props) => {
  const [scramble, setscramble ] = useState(null);
  useEffect(() => {
    setscramble(props.scramble);
  }, [props]);

  const onContextCreate = async (gl) => {
    let scene, camera, renderer, controls, rollObject, group;

    const rotateDirections = { 
      L: 1,
      R: -1,
      D: 1,
      U: -1,
      B: 1,
      F: -1
    };

    const rotateConditions = {
      R: { axis: 'x', value: [1] },
      L: { axis: 'x', value: [-1] },
      U: { axis: 'y', value: [1] },
      D: { axis: 'y', value: [-1] },
      F: { axis: 'z', value: [1] },
      B: { axis: 'z', value: [-1] }
    };

    const colorConditions = [
      ['x', [1], 'red'],
      ['x', [-1], 'orange'],
      ['y', [1], 'white'],
      ['y', [-1], 'yellow'],
      ['z', [1], 'green'],
      ['z', [-1], 'blue']
    ];

    const cPositions = [-1,0,1];
    
    const step = Math.PI / 100;
    const cubes = [];
    const type = '3x3';
    let sequence = scramble;
    console.log(sequence);

    const vertexShader = `
      varying vec2 vUv;
          
      void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
      }
    `;

    const fragmentShader = `
        varying vec2 vUv;
        uniform vec3 faceColor;
        
        void main() {
            vec3 border = vec3(0.533);
            float bl = smoothstep(0.0, 0.03, vUv.x);
            float br = smoothstep(1.0, 0.97, vUv.x);
            float bt = smoothstep(0.0, 0.03, vUv.y);
            float bb = smoothstep(1.0, 0.97, vUv.y);
            vec3 c = mix(border, faceColor, bt*br*bb*bl);
            gl_FragColor = vec4(c, 1.0);
        }
    `;

    const createMaterial = color => {
      return new THREE.ShaderMaterial({
        fragmentShader,
        vertexShader,
        uniforms: { faceColor: { type: 'v3', value: color } }
      });
    }

    const materials = Object.entries({
      white: new THREE.Vector4(1.000,1.000,1.000), //0xFFFFFF
      red: new THREE.Vector4(0.769,0.118,0.227), //0xC41E3A
      blue: new THREE.Vector4(0.000,0.318,0.729), //0x0051BA
      orange: new THREE.Vector4(1.000,0.345,0.000), //0xFF5800
      yellow: new THREE.Vector4(1.000,0.835,0.000), //0xFFD500
      green: new THREE.Vector4(0.000,0.620,0.376), //0x009E60
      gray: new THREE.Vector4(0.502,0.502,0.502), //0x808080
    }).reduce((acc, [key, val]) => ({ ...acc, [key]: createMaterial(val) }), {});

    function init() {
      const [innerWidth, innerHeight] = [gl.drawingBufferWidth, gl.drawingBufferHeight];
      scene = new THREE.Scene();

      renderer = new Renderer({ gl, antialias: true });
      renderer.setClearColor(styles.main.backgroundColor);
      renderer.setSize(innerWidth, innerHeight);
      camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
      camera.position.set(8,8,8);
      camera.lookAt(0,0,0);
      createObjects();
    }

    const wideLayerFaces = function(input,type) {
      if (type !== 2 && type !== 3 || input.length !== 1 || input.length[0] === 0) return input;
      const isNeg = input[0] < 0;
      const start = input[0];
      for (let i = 1; i < type; i++) {
        input.push(start + i * (isNeg ? 1 : -1));
      }
      return input;
    }

    class Roll {
      constructor(face, direction) {
        this.face = face;
        this.steps = 0;
        this.active = true;
        this.init();
        this.direction = direction;
      }

      init() {
        cubes.forEach(item => {
          if (this.face.value.includes(item.position[this.face.axis])) {
            scene.remove(item);
            group.add(item);
          }
        });
      }

      rollFace() {
        if (this.steps !== 50) {
          group.rotation[this.face.axis] += this.direction * step;
          this.steps++;
        } else if (this.active) {
          this.active = false;
          this.clearGroup();
        }
      }

      clearGroup() {
        for (let i = group.children.length - 1; i >= 0; i--) {
          const item = group.children[i];
          item.getWorldPosition(item.position);
          item.getWorldQuaternion(item.rotation);
          item.position.x = Math.round(item.position.x * 2) / 2;
          item.position.y = Math.round(item.position.y * 2) / 2;
          item.position.z = Math.round(item.position.z * 2) / 2;
          group.remove(item);
          scene.add(item);
        }
        group.rotation[this.face.axis] = 0;
      }
    }

    function createObjects() {
      const geometry = new THREE.BoxGeometry(1,1,1);
      const createCube = position => {
        const mat = [];
        for (let i = 0; i < 6; i++) {
          const cnd = colorConditions[i];
          if (cnd[1].includes(position[cnd[0]])) mat.push(materials[cnd[2]]);
          else mat.push(materials.gray);
        }
        const cube = new THREE.Mesh(geometry, mat);
        cube.position.set(position.x, position.y, position.z);
        cubes.push(cube);
        scene.add(cube);
      };
      cPositions.forEach(x => {
        cPositions.forEach(y => {
          cPositions.forEach(z => {
            createCube({ x, y, z });
          });
        });
      });

      group = new THREE.Group();
      scene.add(group);
      const move = sequence.shift();
      if (move !== undefined) {
        const baseMove = move.replace(/['2w]/g, '');
        const layer = rotateConditions[baseMove];
        if (move.includes('w')) layer.value = wideLayerFaces(layer.value, /^3.w/.test(move) ? 3 : 2);
        rollObject = new Roll(layer, (move.includes('\'') ? -1 : move.includes('2') ? 2 : 1) * rotateDirections[baseMove]);
      }
    }

    function update() {
      if (!rollObject) return;
      if (rollObject.active) rollObject.rollFace();
      else {
        const move = sequence.shift();
        if (move === undefined) return;
        const baseMove = move.replace(/['2w]/g, '');
        const layer = rotateConditions[baseMove];
        if (move.includes('w')) layer.value = wideLayerFaces(layer.value, /^3.w/.test(move) ? 3 : 2);
        rollObject = new Roll(layer, (move.includes('\'') ? -1 : move.includes('2') ? 2 : 1) * rotateDirections[baseMove])
      }
    }

    function render() {
      requestAnimationFrame(render);
      update();
      renderer.render(scene, camera);
      gl.endFrameEXP();
    }
    init();
    render();
  };

  return (
    <View>
      <GLView
        onContextCreate={onContextCreate}
        // set height and width of GLView
        style={{ width: 400, height: 400 }}
      />
    </View>
  );
};

export default Cube;