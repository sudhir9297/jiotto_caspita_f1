import {
  ViewerApp,
  AssetManagerPlugin,
  GBufferPlugin,
  ProgressivePlugin,
  TonemapPlugin,
  SSRPlugin,
  SSAOPlugin,
  DiamondPlugin,
  FrameFadePlugin,
  GLTFAnimationPlugin,
  GroundPlugin,
  BloomPlugin,
  TemporalAAPlugin,
  AnisotropyPlugin,
  addBasePlugins,
  ITexture,

  // Color, // Import THREE.js internals
  // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Pane } from "tweakpane";

gsap.registerPlugin(ScrollTrigger);

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas"),
    useRgbm: false,
    isAntialiased: true,
  });

  const data = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };

  const pane = new Pane();

  // Add some plugins
  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;
  const position = camera.position;
  const target = camera.target;

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm));
  await viewer.addPlugin(SSRPlugin);
  await viewer.addPlugin(SSAOPlugin);
  await viewer.addPlugin(BloomPlugin);

  // or use this to add all main ones at once.
  // await addBasePlugins(viewer);

  viewer.renderer.refreshPipeline();

  const model = await manager.addFromPath("./assets/scene.glb");
  const object3d = model[0].modelObject;
  const modelPosition = object3d.position;
  const modelRotation = object3d.rotation;

  pane.addInput(data, "position", {
    x: { step: 0.01 },
    y: { step: 0.01 },
    z: { step: 0.01 },
  });
  pane.addInput(data, "rotation", {
    x: { min: -6.28319, max: 6.28319, step: 0.001 },
    y: { min: -6.28319, max: 6.28319, step: 0.001 },
    z: { min: -6.28319, max: 6.28319, step: 0.001 },
  });

  pane.on("change", (e) => {
    if (e.presetKey === "rotation") {
      const { x, y, z } = e.value;
      modelRotation.set(x, y, z);
    } else {
      const { x, y, z } = e.value;
      modelPosition.set(x, y, z);
    }

    onUpdate();
  });

  function setupScrollanimation() {
    const tl = gsap.timeline();
    // FIRST SECTION
    // tl.to(position, {
    //   x: 6.2679582376,
    //   y: -0.3000825538,
    //   z: -0.0613352655,
    //   scrollTrigger: {
    //     trigger: ".second",
    //     start: "top top",
    //     end: "top top",
    //     scrub: true,
    //     immediateRender: false,
    //   },
    //   onUpdate,
    // })
    //   // .to(target, {
    //   //   x: 0.8889835439,
    //   //   y: -0.1677423829,
    //   //   z: -0.0885035654,
    //   //   scrollTrigger: {
    //   //     trigger: ".first",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   //   onUpdate,
    //   // })

    //   // .to(modelPosition, {
    //   //   x: 0,
    //   //   y: -1,
    //   //   z: -1,
    //   //   scrollTrigger: {
    //   //     trigger: ".second",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   //   onUpdate,
    //   // })
    //   .to(position, {
    //     x: 2.0792887274,
    //     y: 0.8686823658,
    //     z: 5.2767068977,
    //     scrollTrigger: {
    //       trigger: ".second",
    //       start: "top bottom",
    //       end: "top top",
    //       scrub: true,
    //       immediateRender: false,
    //     },
    //     onUpdate,
    //   })
    //   // .to(target, {
    //   //   x: -0.7337104261,
    //   //   y: -0.0771266666,
    //   //   z: 0.7982769596,
    //   //   scrollTrigger: {
    //   //     trigger: ".second",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   // })

    //   // Second SECTION
    //   // .to(modelPosition, {
    //   //   x: -1.9,
    //   //   y: -1,
    //   //   z: 0,
    //   //   scrollTrigger: {
    //   //     trigger: ".third",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   //   onUpdate,
    //   // })
    //   .to(position, {
    //     x: 0.0804048402,
    //     y: -0.4764409517,
    //     z: 5.867911129,
    //     scrollTrigger: {
    //       trigger: ".third",
    //       start: "top bottom",
    //       end: "top top",
    //       scrub: true,
    //       immediateRender: false,
    //     },
    //     onUpdate,
    //   })
    //   // .to(target, {
    //   //   x: 1.0577207057,
    //   //   y: -0.1224391666,
    //   //   z: 0.5885970371,
    //   //   scrollTrigger: {
    //   //     trigger: ".third",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   // })

    //   // .to(modelPosition, {
    //   //   x: -2,
    //   //   y: -1,
    //   //   z: 0,
    //   //   scrollTrigger: {
    //   //     trigger: ".four",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   //   onUpdate,
    //   // })
    //   .to(position, {
    //     x: -0.0593327237,
    //     y: 5.7109014543,
    //     z: -0.0618609263,
    //     scrollTrigger: {
    //       trigger: ".four",
    //       start: "top bottom",
    //       end: "top top",
    //       scrub: true,
    //       immediateRender: false,
    //     },
    //     onUpdate,
    //   })
    //   // .to(target, {
    //   //   x: -0.1292888874,
    //   //   y: -0.1224397683,
    //   //   z: -0.0624858106,
    //   //   scrollTrigger: {
    //   //     trigger: ".four",
    //   //     start: "top bottom",
    //   //     end: "top top",
    //   //     scrub: true,
    //   //     immediateRender: false,
    //   //   },
    //   // })

    //   .to(position, {
    //     x: 0.3619849159,
    //     y: 0.2848419386,
    //     z: -4.8679337022,

    //     scrollTrigger: {
    //       trigger: ".five",
    //       start: "top bottom",
    //       end: "top top",
    //       scrub: true,
    //       immediateRender: false,
    //     },
    //     onUpdate,
    //   });

    // // .to(target, {
    // //   x: 0.9456145574,
    // //   y: -0.1650833494,
    // //   z: -0.0908099508,
    // //   scrollTrigger: {
    // //     trigger: ".five",
    // //     start: "top bottom",
    // //     end: "top top",
    // //     scrub: true,
    // //     immediateRender: false,
    // //   },
    // // });

    tl.to(modelPosition, {
      x: 0,
      y: 0,
      z: 0,
      scrollTrigger: {
        trigger: ".first",
        start: "top top",
        end: "top top",
        scrub: true,
        immediateRender: false,
      },
      onUpdate,
    })
      .to(modelPosition, {
        x: 0.99,
        y: -0.56,
        z: -1.23,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: 0.3,
        y: 0.93,
        z: -0.33,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: 0.0,
        y: -0.21,
        z: 0.0,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: 0.0,
        y: 0,
        z: -1.57,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 1.71,
        y: -0.69,
        z: 0.78,
        scrollTrigger: {
          trigger: ".four",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: 0,
        y: 1.729,
        z: 0,
        scrollTrigger: {
          trigger: ".four",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: 1.64,
        y: -0.25,
        z: 0.87,
        scrollTrigger: {
          trigger: ".five",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: -0.785,
        y: 2.312,
        z: 0.903,
        scrollTrigger: {
          trigger: ".five",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })
      .to(modelPosition, {
        x: 1.9,
        y: -0.71,
        z: -0.56,
        scrollTrigger: {
          trigger: ".six",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
        onUpdate,
      })
      .to(modelRotation, {
        x: -0.176,
        y: 4.922,
        z: -0.203,
        scrollTrigger: {
          trigger: ".six",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      });
  }

  setupScrollanimation();

  // WEBGI UPDATE
  let needsUpdate = true;

  function onUpdate() {
    needsUpdate = true;
    viewer.renderer.resetShadows();
    viewer.setDirty();
  }

  viewer.addEventListener("preFrame", () => {
    if (needsUpdate) {
      camera.positionUpdated(true);
      camera.targetUpdated(true);
      needsUpdate = false;
    }
  });
}

setupViewer();
