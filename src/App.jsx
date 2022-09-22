import { OrbitControls, Point, useTexture } from '@react-three/drei';
import React, { useRef, useMemo, useState, useEffect } from 'react'
import vertexShader from './shaders/vertexShader.glsl'
import fragmentShader from './shaders/fragmentShader.glsl'

import atmosphereVertex from './shaders/atmosphereVertex.glsl'
import atmosphereFragment from './shaders/atmosphereFragment.glsl'

import { AdditiveBlending } from 'three';
import { BackSide } from 'three';
import { useFrame } from '@react-three/fiber';
import { BufferAttribute } from "three";
import gsap from 'gsap';

const App = () => {

  const c = useTexture('planet-c++.png');
  const css = useTexture('planet-css.png');
  const html = useTexture('planet-html.png');
  const js = useTexture('planet-js.png');
  const php = useTexture('planet-php.png');
  const python = useTexture('planet-python.png');
  const ruby = useTexture('planet-ruby.png');
  const vuejs = useTexture('planet-vuejs.png');

  const points = useMemo(() => {
    const p = new Array(10000).fill(0).map((v) => (0.5 - Math.random()) * 100);
    return new BufferAttribute(new Float32Array(p), 3);
  }, []);

  const [active, setActive] = useState(false);
  const [textureActive, setTextureActive] = useState(c);

  const orbitControls = useRef();
  useEffect(() => {
    if (orbitControls.current) orbitControls.current.minPolarAngle = Math.PI / 2;
    if (orbitControls.current) orbitControls.current.maxPolarAngle = Math.PI / 2;
  }, [orbitControls.current])

  useEffect(() => {
    if (active.material?.uniforms?.globeTexture?.value) {
      setTextureActive(active.material?.uniforms?.globeTexture?.value);
      gsap.to(group.current.position, { y: 10, duration: .25, ease: 'easeInOut' });
    }

  }, [active])

  const surface = useRef();
  const group = useRef();
  useFrame(() => {
    if (group.current) group.current.rotation.y += 0.0025
  })

  return (
    <>
      <group ref={group}>
        <Planete texture={c} position={[-6, 3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
        <Planete texture={css} position={[-2, 3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
        <Planete texture={html} position={[2, 3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
        <Planete texture={js} position={[6, 3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>

        <Planete texture={php} position={[-6, -3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
        <Planete texture={python} position={[-2, -3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
        <Planete texture={ruby} position={[2, -3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
        <Planete texture={vuejs} position={[6, -3, 0]} active={active} setActive={setActive} orbitControls={orbitControls} surface={surface}></Planete>
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

      <mesh ref={surface} position={[0, -100, 0]} rotation={[-90 * Math.PI / 180, 0, 0]}>
        <planeGeometry args={[250, 250, 250]} />
        <meshBasicMaterial map={textureActive}></meshBasicMaterial>
      </mesh>


    </>
  )
}

export default App

const Planete = ({ texture, position, active, setActive, orbitControls, surface }) => {

  const planet = useRef();
  const [zoom, setZoom] = useState(false);

  useFrame(({ camera }) => {
    if (planet.current) {
      planet.current.rotation.y += 0.0025;
      planet.current.rotation.x += 0.0025;
      planet.current.rotation.z += 0.0025;
    }
    if (planet.current === active) {
      if (!zoom) {
        let timeline = gsap.timeline();
        timeline.to(camera.position, { z: 0, duration: .25, ease: 'easeInOut' });
        timeline.to(surface.current.position, { y: -5, duration: 0 });
        timeline.to(camera.position, { z: 150 }, "<");

        setZoom(true);
      }
    }
  })

  return (
    <>
      <mesh onClick={() => setActive(planet.current)} ref={planet} position={position}>
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
