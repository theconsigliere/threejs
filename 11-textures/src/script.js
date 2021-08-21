import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import gsap from 'gsap'
import * as dat from 'dat.gui'




/**
 * Textures
 */

const loadingManager = new THREE.LoadingManager()
const textureLoader = new THREE.TextureLoader()

// we are creating an object that gives us an accessible variable
const parameters = {
    color: 0xff0000,
    spin: () => {
        gsap.to(mesh.rotation, { duration: 1, y: mesh.rotation.y + Math.PI * 2 })
    },
    textures: textureLoader.load('/textures/door/color.jpg')
}


const textures = {
    color : textureLoader.load('/textures/door/color.jpg'),
    alpha : textureLoader.load('/textures/door/alpha.jpg'),
    height : textureLoader.load('/textures/door/height.jpg'),
    normal : textureLoader.load('/textures/door/normal.jpg'),
    ambientOcclusion : textureLoader.load('/textures/door/ambientOcclusion.jpg'),
    metalness : textureLoader.load('/textures/door/metalness.jpg'),
    roughness : textureLoader.load('/textures/door/roughness.jpg'),
    checkerboard : textureLoader.load('/textures/door/checkerboard.png'),
    checkerboard2 : textureLoader.load('/textures/door/checkerboard2.png'),
    minecraft : textureLoader.load('/textures/door/minecraft.png')
}

// ...


// colorTexture.repeat.x = 2
// colorTexture.repeat.y = 3
// colorTexture.wrapS = THREE.MirroredRepeatWrapping
//colorTexture.wrapT = THREE.MirroredRepeatWrapping

// colorTexture.offset.x = 0.5
// colorTexture.offset.y = 0.5

textures.color.rotation = Math.PI * 0.25

// CHANGE PIVOT POINT TO CENTER
textures.color.center.x = 0.5
textures.color.center.y = 0.5





// texture loader
// 3 functions after the path
//-------------------------------------------------
// load - when the image loaded successfully
// progress  -when the loading is progressing
// error if  -something went wrong




/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Object
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ map: parameters.textures })
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)






/**
 * Debug
 */

const gui = new dat.GUI({
    closed: false,
    width: 400
})

// add to gui to move y position, parameters are, minimum, maximum or step
gui.add(mesh.position, 'y', -3, 3, 0.01).name('Elevation')
// we can also use for same results
gui.add(mesh.position, 'z').min(-3).max(3).step(0.01)
// boolean as 'visible' is a boolean attached to the mesh object
gui.add(mesh, 'visible')
// also boolean
gui.add(material, 'wireframe')

gui
    .addColor(parameters, 'color')
    .onChange(() => {
        material.color.set(parameters.color)
    })

gui.add(parameters, 'spin')


gui
    .add(parameters, 'textures', ['color', 'alpha', 'height', 'normal', 'ambientOcclusion', 'metalness', 'roughness', 'checkerboard', 'checkerboard2', 'minecraft'])
    .onChange((value) => {

        // if (value in textures) {
        //     console.log(value)
        //     material.map.set(textures.value)
        // }

        for (const [key, output] of Object.entries(textures)) {
           
           if (key == value ) {
               material.map = output
              
               material.map.magFilter = THREE.NearestFilter
              // material.map.minFilter = THREE.NearestFilter

           }
        }
     

    })



/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 1
camera.position.y = 1
camera.position.z = 1
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()