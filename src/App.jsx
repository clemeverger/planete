import { Point, useTexture } from '@react-three/drei';
import React, { useRef, useMemo, useState } from 'react'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

import atmosphereVertex from './shaders/atmosphereVertex.glsl'
import atmosphereFragment from './shaders/atmosphereFragment.glsl'

import { AdditiveBlending } from 'three';
import { BackSide } from 'three';
import { useFrame, extend } from '@react-three/fiber';
import { BufferAttribute } from "three";
import { DoubleSide } from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import myFont from './shaders/montserrat.json'
import gsap from 'gsap';


extend({ TextGeometry })
const font = new FontLoader().parse(myFont);

const App = () => {

  console.log("Qu'en pensez vous SouthVibes ?")
  const c = useTexture('planet-c++.png');
  const css = useTexture('planet-css.png');
  const html = useTexture('planet-html.png');
  const js = useTexture('planet-js.png');
  const php = useTexture('planet-php.png');
  const python = useTexture('planet-python.png');
  const ruby = useTexture('planet-ruby.png');
  const vuejs = useTexture('planet-vuejs.png');

  const groupRef = useRef();

  const points = useMemo(() => {
    const p = new Array(1000).fill(0).map((v) => (0.5 - Math.random()) * 25);
    return new BufferAttribute(new Float32Array(p), 3);
  }, []);

  useFrame(() => {
    groupRef.current.rotation.y += 0.0025;
    groupRef.current.rotation.x += 0.0025;
    groupRef.current.rotation.z += 0.0025;
  })

  const [focus, setFocus] = useState(false);

  return (
    <>
      <group ref={groupRef}>
        <Planete texture={c} position={[-6, 3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <Planete texture={css} position={[-2, 3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <Planete texture={html} position={[2, 3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <Planete texture={js} position={[6, 3, 0]} focus={focus} setFocus={setFocus}></Planete>

        <Planete texture={php} position={[-6, -3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <Planete texture={python} position={[-2, -3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <Planete texture={ruby} position={[2, -3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <Planete texture={vuejs} position={[6, -3, 0]} focus={focus} setFocus={setFocus}></Planete>
        <points>
          <bufferGeometry>
            <bufferAttribute attach={"attributes-position"} {...points} />
          </bufferGeometry>
          <pointsMaterial
            size={0.15}
            color={0xffffff}
          />
        </points>
      </group>
    </>
  )
}

export default App

const Planete = ({ texture, position, focus, setFocus }) => {
  const planet = useRef();
  useFrame(({ camera }) => {
    if (!focus) {
      planet.current.rotation.y += 0.0025;
      planet.current.rotation.x += 0.0025;
      planet.current.rotation.z += 0.0025;
    }
    else {
      camera.position.z -= 0.1;
    }
  })
  return (
    <>
      <mesh onClick={() => setFocus(true)} ref={planet} position={position}>
        <sphereGeometry />
        <shaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          uniforms={{
            globeTexture: {
              value: texture
            }
          }}
        />
      </mesh>
      <mesh position={position} scale={[1.2, 1.2, 1.2]}>
        <sphereGeometry />
        <shaderMaterial
          vertexShader={atmosphereVertex}
          fragmentShader={atmosphereFragment}
          blendin={AdditiveBlending}
          side={BackSide}
        />
      </mesh>
    </>
  )
}