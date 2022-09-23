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

ScrollTrigger.defaults({ scroller: ".mainContainer" });

async function setupViewer() {
  // Initialize the viewer
  const viewer = new ViewerApp({
    canvas: document.getElementById("webgi-canvas"),
    useRgbm: true,
    isAntialiased: true,
  });

  const data = {
    position: { x: 0, y: 0, z: 0 },
    rotation: { x: 0, y: 0, z: 0 },
  };

  // const pane = new Pane();

  // Add some plugins
  const manager = await viewer.addPlugin(AssetManagerPlugin);
  const camera = viewer.scene.activeCamera;

  // Add plugins individually.
  await viewer.addPlugin(GBufferPlugin);
  await viewer.addPlugin(new ProgressivePlugin(32));
  // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm));
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

  // pane.addInput(data, "position", {
  //   x: { step: 0.01 },
  //   y: { step: 0.01 },
  //   z: { step: 0.01 },
  // });
  // pane.addInput(data, "rotation", {
  //   x: { min: -6.28319, max: 6.28319, step: 0.001 },
  //   y: { min: -6.28319, max: 6.28319, step: 0.001 },
  //   z: { min: -6.28319, max: 6.28319, step: 0.001 },
  // });

  // pane.on("change", (e) => {
  //   if (e.presetKey === "rotation") {
  //     const { x, y, z } = e.value;
  //     modelRotation.set(x, y, z);
  //   } else {
  //     const { x, y, z } = e.value;
  //     modelPosition.set(x, y, z);
  //   }

  //   onUpdate();
  // });

  function setupScrollanimation() {
    const tl = gsap.timeline();

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
        x: -0.57,
        y: -0.21,
        z: 0.0,
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
        x: 0.0,
        y: 0,
        z: -1.57,
        scrollTrigger: {
          trigger: ".second",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 0.38,
        y: -0.44,
        z: -1.06,
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
        x: 0.403,
        y: 0.957,
        z: -0.483,
        scrollTrigger: {
          trigger: ".third",
          start: "top bottom",
          end: "top top",
          scrub: true,
          immediateRender: false,
        },
      })

      .to(modelPosition, {
        x: 0.92,
        y: -0.64,
        z: 0.6,
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
        x: 0.0,
        y: 1.777,
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
        x: -0.1,
        y: -0.38,
        z: 0.99,
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
        y: 2.329,
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
        x: 0.68,
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

  // SCROLL TO TOP
  document.querySelectorAll(".button--footer")?.forEach((item) => {
    item.addEventListener("click", () => {
      const container = document.getElementsByClassName("mainContainer");
      container[0].scrollTo({ top: 0, left: 0, behavior: "smooth" });
    });
  });
}

setupViewer();
