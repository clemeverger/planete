import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <>
      <Canvas
        camera={{ position: [0, 0, 50], fov: 15 }}
        style={{
          backgroundColor: 'black',
          width: '100vw',
          height: '100vh'
        }}
      >
        <ambientLight intensity={1} />
        <Suspense fallback={null}>
          <App></App>
        </Suspense>
      </Canvas>
    </>
  </React.StrictMode>
)
