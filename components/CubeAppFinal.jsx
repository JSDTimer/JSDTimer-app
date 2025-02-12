import React, {useState, useEffect, useRef} from 'react';
import { View, Text } from 'react-native';
import { Renderer, THREE } from 'expo-three';
import { GLView } from 'expo-gl';
import { styles } from "../styles/default"
import * as RootNavigation from "../global/rootNavigation"

const Cube = (props) => {
    const [scrambleState, setScrambleSet] = useState(props.scramble);
    const scramble = useRef(props.scramble);
    const reset = useRef(props.reset)
    let sequence = [...scramble.current];
    let inScramble = useRef(true);
    let newScramble = useRef(false);
    let newType = useRef(false);
    let firstRun = useRef(true);
    let firstRun2 = useRef(true);
    let cubeType = useRef(props.cubeType);
    let actualCubeType = 3;

    function setCubeType() {
      switch (cubeType.current) {
        case "2x2":
          actualCubeType = 2;
          break;
        case "3x3":
          actualCubeType = 3
          break;
        case "4x4":
            actualCubeType = 4;
            break;
        case "5x5":
            actualCubeType = 5
            break;
        case "6x6":
            actualCubeType = 6;
            break;
        case "7x7":
            actualCubeType = 7;
            break;
        default:
          actualCubeType = 0;
      }
    }

    const onContextCreate = async (gl) => {
        let scene, camera, renderer, rollObject, group;
        const setVariables = (type) => {
            if (type < 2 || type > 7) throw new Error("MAN WTF. THE FUNCTION PARAMETER IS AN INT BETWEEN 2 & 7. GET IT RIGHT");
            const bounds = [.5,-.5];
            bounds[0] = [bounds[0] + .5 * (type - 2)];
            bounds[1] = [bounds[1] - .5 * (type - 2)];
            const rotateConditions = {
              R: { axis: "x", value: bounds[0] },
              L: { axis: "x", value: bounds[1] },
              U: { axis: "y", value: bounds[0] },
              D: { axis: "y", value: bounds[1] },
              F: { axis: "z", value: bounds[0] },
              B: { axis: "z", value: bounds[1] },
            };
            const cPositions = (() => {
              const res = [];
              const lower = bounds[1][0];
              for (let i = 0; i < type; i++) {
                res.push(lower + i);
              }
              return res;
            })();
            const positive = cPositions.filter(elm => elm > 0);
            const negative = cPositions.filter(elm => elm < 0);
            const colorConditions = [
                ["x", positive, "red"],
                ["x", negative, "orange"],
                ["y", positive, "white"],
                ["y", negative, "yellow"],
                ["z", positive, "green"],
                ["z", negative, "blue"]
            ];
            return [rotateConditions, colorConditions, cPositions];
        } 

        const rotateDirections = { 
            L: 1,
            R: -1,
            D: 1,
            U: -1,
            B: 1,
            F: -1
          };
          
        // 2x2 - 7x7
        setCubeType()
        var type = actualCubeType; // TODO CHANGE THIS TO SET THE LAYER
        var [rotateConditions, colorConditions, cPositions] = setVariables(type);

        // const step = Math.PI / 2;
        var cubes = [];
        var vertexShader = `
            varying vec2 vUv;    
            void main() {
                vUv = uv;
                gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
            }
        `;
    
        var fragmentShader = `
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
    
        var createMaterial = color => {
          return new THREE.ShaderMaterial({
            fragmentShader,
            vertexShader,
            uniforms: { faceColor: { type: 'v3', value: color } }
          });
        }
    
        var materials = Object.entries({
          white: new THREE.Vector4(1.000,1.000,1.000), //0xFFFFFF
          red: new THREE.Vector4(0.769,0.118,0.227), //0xC41E3A
          blue: new THREE.Vector4(0.000,0.318,0.729), //0x0051BA
          orange: new THREE.Vector4(1.000,0.345,0.000), //0xFF5800
          yellow: new THREE.Vector4(1.000,0.835,0.000), //0xFFD500
          green: new THREE.Vector4(0.000,0.620,0.376), //0x009E60
          gray: new THREE.Vector4(0.502,0.502,0.502), //0x808080
        }).reduce((acc, [key, val]) => ({ ...acc, [key]: createMaterial(val) }), {});
    
        function init() {
          inScramble.current = true;
          const [innerWidth, innerHeight] = [gl.drawingBufferWidth, gl.drawingBufferHeight];
          scene = new THREE.Scene();

          renderer = new Renderer({ gl, antialias: true });
          renderer.setClearColor(styles.main.backgroundColor);
          renderer.setSize(innerWidth, innerHeight);
          camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000);
          camera.position.set(8,8,8);
          camera.lookAt(0,0,0);

          if(type != 0) { 
            createObjects();
          }
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
            this.stepTotal = 20; // TODO CHANGE THIS TO CHANGE CUBE SPEED (SMALLER = FASTER)
            this.stepAmount = Math.PI / (2 * this.stepTotal);
            this.steps = 0;
            this.active = true;
            this.direction = direction;
            this.init();
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
            if (this.steps !== this.stepTotal) {
              group.rotation[this.face.axis] += this.direction * this.stepAmount;
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
            var cube = new THREE.Mesh(geometry, mat);
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
          if (!rollObject || type == 0) return;
          if (rollObject.active) rollObject.rollFace();
          else {
            const move = sequence.shift()
            if (move === undefined) {
              return;
            };
            const baseMove = move.replace(/['2w]/g, '');
            const layer = rotateConditions[baseMove];
            if (move.includes('w')) layer.value = wideLayerFaces(layer.value, /^3.w/.test(move) ? 3 : 2);
            rollObject = new Roll(layer, (move.includes('\'') ? -1 : move.includes('2') ? 2 : 1) * rotateDirections[baseMove])
          }
        }
    
        function render() {
          if(newType.current) {
            setCubeType();
            type = actualCubeType;

            if(type == 0) {
              [rotateConditions, colorConditions, cPositions] = [0,0,0];
            } else {
              [rotateConditions, colorConditions, cPositions] = setVariables(type);
            }
            newType.current = false;
            cubes = [];
            sequence = [];
            init();
          }

          if((sequence.length < 1 && newScramble.current)) {
            sequence = [...scramble.current];
            cubes = [];
            console.log("New Scramble: " + newScramble.current)
            console.log("In scramble: " + inScramble.current)
            newScramble.current = false;
            init();
          }
    
          if(RootNavigation.getCurrentRoute() && RootNavigation.getCurrentRoute().name != "Main") {
            sequence = [...scramble.current];
          }
    
          if(RootNavigation.getCurrentRoute() && RootNavigation.getCurrentRoute().name === "Main") {
            requestAnimationFrame(render);
            update();
            renderer.render(scene, camera);
            gl.endFrameEXP();
          }
        }

        init();
        render();
    };

    useEffect(() => {
        scramble.current = props.scramble;
        setScrambleSet(props.scramble);
        inScramble.current = false;

        if (firstRun.current) {
            firstRun.current = false;
        } else {
            newScramble.current = true;
        }
    }, [props.scramble]);

    useEffect(() => {
      cubeType.current = props.cubeType;
      setCubeType();

      if (firstRun2.current) {
        firstRun2.current = false;
      } else {
        newType.current = true;
      }
    }, [props.cubeType]);

    //Remove later - in a future update
    let sadComp = (
      <View style={{flex: 5}}>
          <Text style={{color: "white"}}>{props.cubeType} is currently not supported by the 3D viewer :(</Text>
      </View>
    );


    return (
        <View style={{flex: 5}}>
          { props.cubeType === "Pyraminx" || props.cubeType ===  "Megaminx" || props.cubeType ===   "Skewb" || props.cubeType ===  "Clock" ? sadComp : "" }
            <GLView
                onContextCreate={onContextCreate}
                // Set height and width of GLView
                style={{ width: 420, height: 400 }}
            />
        </View>
    )
}

export default Cube;