import './style.css'
import * as THREE from 'three'
import { MathUtils, Mesh } from 'three'

console.log('hello')



// TRANSFORM OBJECTS
// There are 4 properties to transform objects
// POSITION SCALE ROTATION QUATERNION


// DIRECTION
// The direction of each axis is arbitrary, in three.js we consider
// y axis is going upward
// z axis is going backward
// x axis is going to the right


// the distance of 1 unit is arbitrary too
// you should think of 1 according to what you are building(1 centimeter, 1 km, 1 inch)


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
const mesh = new THREE.Mesh(geometry, material)

scene.add(mesh)

/**
 * Sizes
 */
const sizes = {
    width: 800,
    height: 600
}

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
camera.position.z = 3
scene.add(camera)



// POSITION
// Position has 3 properties, X, Y, Z
// position can be made anywhere, but needs to be before render
// Position inherit from vector3 which has many useful methods you can get the length of a vector
mesh.position.y = 1
mesh.position.z = -5

// you cna change all 3 values of x, y & z at once using the set(...) method
mesh.position.set(0.7, -0.6, 1)

// positioning can be hard
// one good solution is to use the akeshelper to display a coloured line for each axis

const axesHelper = new THREE.AxesHelper()
scene.add(axesHelper)

// distance between center of scene and our object position
console.log(mesh.position.length())
// distance between object and camera
console.log(mesh.position.distanceTo(camera.position))



// SCALE
// mesh.scale.x = 2
// mesh.scale.y = 0.5
// mesh.scale.z = 0.5

mesh.scale.set(2, 0.5, 0.5)

// ROTATION
// With rotation or with quaternion updating one will automatically update the other

// rotation also has x, y, z properties but its Euler
// when you change to x, y and z properties you can imagine putting a stick through your objects center in the axis's direction and then roatating that object on a stick

mesh.rotation.y = 0.5


// the value of these axes is expressed in radians
// half a rotation = 3.14159 Math.PI
// full ration 2 x Math.PI

mesh.rotation.x = Math.PI * 0.25

// When rotating on an axis you might also rotate the other axis
// if this is no longer working this colud be beacuse of GIMBAL LOCK


// You can change this order by using the reorder(...) method
// do it before changing the rotation

// mesh.rotation.reorder('XYZ')


// QUATERNION

// Quaternion also expresses a rotation, quaternion updates when you change the rotation.



// Normalize
// take a vector and turn the scale to 1
// console.log(mesh.position.normalize())

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)


// CAMERA
renderer.render(scene, camera)

// LOOK AT METHOD
// Rotates the object so that its -z faces the target you provided

camera.lookAt(mesh.position)