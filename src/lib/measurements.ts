export type MeasurementField = { key: string; label: string; hint: string; group: "Top" | "Trousers" | "Cap" };

// Inches, the way most Nigerian tailors take them.
export const measurementFields: MeasurementField[] = [
  { key: "neck", label: "Neck", hint: "Around the base of the neck, one finger inside the tape", group: "Top" },
  { key: "shoulder", label: "Shoulder", hint: "Across the back, shoulder point to shoulder point", group: "Top" },
  { key: "chest", label: "Chest", hint: "Around the fullest part of the chest, arms relaxed", group: "Top" },
  { key: "stomach", label: "Stomach", hint: "Around the widest part of the belly", group: "Top" },
  { key: "topLength", label: "Top length", hint: "From the shoulder, down the front to where the top should end", group: "Top" },
  { key: "sleeveLength", label: "Sleeve length", hint: "Shoulder point to where the sleeve should end", group: "Top" },
  { key: "bicep", label: "Arm round", hint: "Around the fullest part of the upper arm", group: "Top" },
  { key: "waist", label: "Waist", hint: "Where you wear your trousers", group: "Trousers" },
  { key: "hip", label: "Hip", hint: "Around the widest part of the seat", group: "Trousers" },
  { key: "thigh", label: "Thigh", hint: "Around the top of one thigh", group: "Trousers" },
  { key: "trouserLength", label: "Trouser length", hint: "Waist to ankle, down the outside of the leg", group: "Trousers" },
  { key: "ankle", label: "Ankle opening", hint: "How wide you want the trouser mouth", group: "Trousers" },
  { key: "cap", label: "Cap size", hint: "Around the head, just above the ears", group: "Cap" },
];

export const requiredMeasurements = ["shoulder", "chest", "topLength", "sleeveLength", "waist", "trouserLength"];
