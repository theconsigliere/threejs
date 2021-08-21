import './style.css'
import * as THREE from 'three'
import gsap from 'gsap'

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)

// Sizes
const sizes = {
    width: 800,
    height: 600
}

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Clock
 const clock = new THREE.Clock()

// gsap.to(mesh.position, { duration: 1, delay: 1, x: 2 })

// animations
 const tick = () => {

    // Clock

    const elapsedTime = clock.getElapsedTime()  

    // update objects
     mesh.rotation.x = elapsedTime * Math.PI
     mesh.rotation.y = elapsedTime

     // in circles
     mesh.position.y = Math.sin(elapsedTime)
     mesh.position.x = Math.cos(elapsedTime)

    // render
     renderer.render(scene, camera)

     // call tick again on the next frame
     window.requestAnimationFrame(tick)
 }

 tick()