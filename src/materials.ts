import * as THREE from "three";

export type ApartmentMaterials = ReturnType<typeof createMaterials>;

export function createMaterials() {
  return {
    warmWhite: new THREE.MeshStandardMaterial({ color: 0xf2efe7, roughness: 0.92 }),
    wallCut: new THREE.MeshStandardMaterial({ color: 0xd8d2c5, roughness: 0.88 }),
    warmGreyFloor: new THREE.MeshStandardMaterial({ color: 0xa9a59b, roughness: 0.82 }),
    bathroomTile: new THREE.MeshStandardMaterial({ color: 0x8f9895, roughness: 0.68 }),
    marinePlywood: new THREE.MeshStandardMaterial({ color: 0xa66f3f, roughness: 0.62 }),
    plywoodEdge: new THREE.MeshStandardMaterial({ color: 0xd2aa72, roughness: 0.72 }),
    stainless: new THREE.MeshStandardMaterial({ color: 0xbfc4c2, metalness: 0.88, roughness: 0.3 }),
    darkSteel: new THREE.MeshStandardMaterial({ color: 0x343a38, metalness: 0.62, roughness: 0.28 }),
    blackGlass: new THREE.MeshPhysicalMaterial({ color: 0x111817, metalness: 0.25, roughness: 0.08, clearcoat: 0.8 }),
    glass: new THREE.MeshPhysicalMaterial({
      color: 0xcce2df,
      transparent: true,
      opacity: 0.34,
      transmission: 0.42,
      roughness: 0.08,
      side: THREE.DoubleSide,
    }),
    linen: new THREE.MeshStandardMaterial({ color: 0xc7b8a3, roughness: 0.95 }),
    fabricLight: new THREE.MeshStandardMaterial({ color: 0xd9d4c8, roughness: 0.96 }),
    fabricDark: new THREE.MeshStandardMaterial({ color: 0x56615c, roughness: 0.92 }),
    ceramic: new THREE.MeshStandardMaterial({ color: 0xf4f3ef, roughness: 0.28 }),
    plant: new THREE.MeshStandardMaterial({ color: 0x59725e, roughness: 0.86 }),
    terracotta: new THREE.MeshStandardMaterial({ color: 0x9a5f42, roughness: 0.9 }),
    warmLight: new THREE.MeshBasicMaterial({ color: 0xffd9a3, toneMapped: false }),
  };
}

