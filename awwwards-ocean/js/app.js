import * as THREE from "three"
import imagesLoaded from 'imagesloaded'
import gsap from 'gsap'
import FontFaceObserver from 'fontfaceobserver'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import fragment from './shader/fragment.glsl'
import vertex from './shader/vertex.glsl'
import noise from './shader/noise.glsl'
import Scroll from './scroll'

import ocean from '../img/ocean.jpg'

// POSTPROCESSING
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';


export default class Sketch {
    constructor (options) {
        this.time = 0
        this.scene = new THREE.Scene();
        this.container = options.dom
 
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        
        this.camera = new THREE.PerspectiveCamera( 70, this.width / this.height, 100, 2000 );
    	this.camera.position.z = 600;

        // get plane to be 100px so we can manipulate images on page. to do this, we need to do a calculation 
        // this part converts the answer from radians to degrees * (100/Math.PI)
        // calculation gets half the angle until we * 2
        this.camera.fov = 2*Math.atan( (this.height/2) / this.camera.position.z ) * (180/Math.PI)

        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(this.width, this.height);
        this.container.appendChild( this.renderer.domElement )
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        this.images = [...document.querySelectorAll('img')]
        this.materials = []
        this.currentScroll = 0
        this.raycaster = new THREE.Raycaster()
        this.mouse = new THREE.Vector2()

        const fontOpen = new Promise(resolve => {
            new FontFaceObserver("Open Sans").load().then(() => {
                resolve()
            })
        })

        const fontPlayfair = new Promise(resolve => {
            new FontFaceObserver("Playfair Display").load().then(() => {
                resolve()
            })
        })

        const preloadImages = new Promise((resolve, reject) => {
            imagesLoaded(this.images, {background: true }, resolve)
        })

        let allDone = [fontOpen, fontPlayfair, preloadImages]

        


        Promise.all(allDone).then(()=> {
            this.scroll = new Scroll()
            this.addImages()
            this.setPosition()
            this.mouseMove()
            this.resize()
            this.resizeListener()
         //   this.addObjects()
            this.composerPass()
            this.render()

            // USING NATIVE SCROLL, DOESN'T WORK WELL
            // window.addEventListener('scroll', ()=> {
            //     this.currentScroll = window.scrollY
            //     this.setPosition()
            // })

        })




    }

    composerPass(){
        this.composer = new EffectComposer(this.renderer);
        this.renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(this.renderPass);
  
        //custom shader pass
        var counter = 0.0;
        this.myEffect = {
          uniforms: {
            "tDiffuse": { value: null },
            "scrollSpeed": { value: null },
            "time": { value: null },
          },
          vertexShader: `
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix 
              * modelViewMatrix 
              * vec4( position, 1.0 );
          }
          `,
          fragmentShader: `
        uniform sampler2D tDiffuse;
        varying vec2 vUv;
        uniform float scrollSpeed;
        uniform float time;
        ${noise}
        void main(){
          vec2 newUV = vUv;
          float area = smoothstep(1.,0.8,vUv.y)*2. - 1.;
          float area1 = smoothstep(0.4,0.0,vUv.y);
          area1 = pow(area1,4.);
          float noise = 0.5*(cnoise(vec3(vUv*10.,time/5.)) + 1.);
          float n = smoothstep(0.5,0.51, noise + area/2.);
          newUV.x -= (vUv.x - 0.5)*0.1*area1*scrollSpeed;
          gl_FragColor = texture2D( tDiffuse, newUV);
        //   gl_FragColor = vec4(n,0.,0.,1.);
        gl_FragColor = mix(vec4(1.),texture2D( tDiffuse, newUV),n);
        // gl_FragColor = vec4(area,0.,0.,1.);
        }
        `
        }
  
        this.customPass = new ShaderPass(this.myEffect);
        this.customPass.renderToScreen = true;
  
        this.composer.addPass(this.customPass);
      }


    resizeListener() {
        window.addEventListener('resize', this.resize.bind(this))
    }


    resize() {
        // recalculate size of browser
        this.width = this.container.offsetWidth
        this.height = this.container.offsetHeight
        this.renderer.setSize(this.width, this.height)
        this.camera.aspect = this.width/this.height
        this.camera.updateProjectionMatrix()

    }

    addImages () {

            this.material = new THREE.ShaderMaterial({
            uniforms: {
                time: {value:0},
                uImage: {value:0},
                hover: {value: new THREE.Vector2(0.5,0.5)},
                hoverState: {value: 0},
                // load jpg as a textture for our shape
                oceanTexture: {value: new THREE.TextureLoader().load(ocean)}
            },
            side: THREE.DoubleSide,
            fragmentShader: fragment, 
            vertexShader: vertex,
            wireframe: false
            
        })


        this.imageStore = this.images.map(img => {
            // get image size so we can use this information later on
            let bounds = img.getBoundingClientRect()

            // create a mesh for each image at the image size and width
            let geometry = new THREE.PlaneBufferGeometry(bounds.width, bounds.height, 10,10)
            let texture = new THREE.Texture(img)
            texture.needsUpdate = true
            // let material = new THREE.MeshBasicMaterial({
            //    // color: 0xff0000,
            //     map: texture
            // })

            // cant use same material as we have different uniforms so we must clone
            let material = this.material.clone()

            // on HOVER
            // change the hoverstate number so that we start animating on hover and when we leave the mesh goes back to normal

            img.addEventListener('mouseenter', ()=> {
                gsap.to(material.uniforms.hoverState, {
                    duration: 1,
                    value: 1
                })
            })

            img.addEventListener('mouseout', ()=> {
                gsap.to(material.uniforms.hoverState, {
                    duration: 1,
                    value: 0
                })
            })

            this.materials.push(material)

            material.uniforms.uImage.value = texture

            let mesh = new THREE.Mesh(geometry, material)

            this.scene.add(mesh)


            // Retrun object with all image and image mesh info
            return {
                img: img,
                mesh: mesh,
                top: bounds.top,
                left: bounds.left,
                width: bounds.width,
                height: bounds.height
            }
        })

        console.log(this.imageStore)
    }

    setPosition () {
        // set postions of meshs to replace images on html
        // as getboundingclientrectangle is calculated from top left and three js is calculated from middle outwards
        this.imageStore.forEach(object => {
            // first part, -object.top and object.left is the actual position of the images in the dom
            // second part shifts the co-ordinate system between three js and the DOM 
            // this.currentscroll changes as we scroll
            object.mesh.position.y = this.currentScroll -object.top + this.height/2 - object.height/2
            object.mesh.position.x = object.left - this.width/2 + object.width/2
        })
    }

    // addObjects() {
    //     this.geometry = new THREE.PlaneBufferGeometry( 100, 100, 10, 10 );
    // //    this.geometry = new THREE.SphereBufferGeometry( 1, 50, 50 );
    //     this.material = new THREE.MeshNormalMaterial();

    //     this.material = new THREE.ShaderMaterial({
    //         uniforms: {
    //             time: {value:0},
    //             // load jpg as a textture for our shape
    //             oceanTexture: {value: new THREE.TextureLoader().load(ocean)}
    //         },
    //         side: THREE.DoubleSide,
    //         fragmentShader: fragment, 
    //         vertexShader: vertex,
    //         wireframe: true
            
    //     })
    //     this.mesh = new THREE.Mesh( this.geometry, this.material );
    //     this.scene.add( this.mesh );

    // }

    mouseMove() {
        window.addEventListener( 'mousemove', (event)=>{
            this.mouse.x = ( event.clientX / this.width ) * 2 - 1;
            this.mouse.y = - ( event.clientY / this.height ) * 2 + 1;

            // update the picking ray with the camera and mouse position
            this.raycaster.setFromCamera( this.mouse, this.camera );

            // calculate objects intersecting the picking ray
            const intersects = this.raycaster.intersectObjects( this.scene.children );

            if(intersects.length>0){
                // console.log(intersects[0]);
                 let obj = intersects[0].object;
                 obj.material.uniforms.hover.value = intersects[0].uv;
            }

        }, false );
    }
 
    render(){
        this.time+=0.05
        // run custom scroll
        this.scroll.render()
        // change current scroll variable to custom scroll value
        this.currentScroll = this.scroll.scrollToRender
        // run method
        this.setPosition()
        // pass scrollSpeed to customPass method to amplify full page effect
        this.customPass.uniforms.scrollSpeed.value = this.scroll.speedTarget
        this.customPass.uniforms.time.value = this.time

        // this.material.uniforms.time.value = this.time

        this.materials.forEach(mat => {
            mat.uniforms.time.value = this.time
        })
    
       // this.renderer.render( this.scene, this.camera );
       this.composer.render()
        window.requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch({
    dom: document.getElementById('container')
})