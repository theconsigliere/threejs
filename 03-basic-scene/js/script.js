

// SCENE
// Like a container
// we put objects, models, lights, etc in it


const scene = new THREE.Scene()

// OBJECTS
// Can be many things
// Primitive Geometries, imported models, particles, lights, etc

//--------------------------------------------------------------------------

// MESH
// To create an object we need to create a mesh
// a MESH is a combination of geometry (the shape) and a material ( how it looks, colour etc )
// start with a BoxGeometry & a MeshBasicMaterial
//-------------------------------------------------------------

// GEOMETRY
// Instantiate a BoxGeometry, the first 3 parameters correspond to the box's size

const geometry = new THREE.BoxGeometry(1,1,1)

// MATERIAL
//Instantiate a MeshBasicMaterial

const material = new THREE.MeshBasicMaterial({ color: 'blue' })

// MESH
// Instantiate the Mesh with the Geometry & the material

const mesh = new THREE.Mesh(geometry, material)

// ADD THE MESH TO THE SCENE

scene.add(mesh)

//-------------------------------------------------------------

// CAMERA
// Serves as a point of view when doing a render
// can have multiple and switch between them
// there are different types of camera

// PARAMETERS FOR CAMERA

// FIELD OF VIEW
// -----------------
// Vertical vision angle
// in degrees, as known as fov

// ASPECT RATIO
// The width of the render divided by the height of the render
const sizes = {
    width: 800,
    height: 600
}

const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height  )
scene.add(camera)

// move the camera backward before doing the render
camera.position.z = 3

// RENDERER
// Render the scene from the camera point of view
// result drawn into a canvas
// a canvas is a HTML element which you can draw stuff
//  three.js will use WebGL to draw the render inside this canvas
// you can create it or you can let three.js do it

const canvas = document.querySelector('canvas.webgl')

const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})

//  use setSize(..) method to update the size of the renderer

renderer.setSize(sizes.width, sizes.height)

// FIRST RENDER
// Cal the render(...) method on the renderer with scene and the camera as parameters

renderer.render(scene, camera )


// to transform an object we can use the following properties
// POSITION, ROTATION SCALE
// The position property is also an object with x, y and z properties three.js considers the forward/ backward axis to be z





