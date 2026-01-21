import { planifyLab } from "./index";
import { MOCK_DATA } from "./mocks";


// Exécution de l'algorithme
const result = planifyLab(MOCK_DATA);

// Affichage du résultat
console.log("\n📊 RÉSULTAT DU PLANNING :");
console.table(result.schedule.map(item => ({
    Priorité: item.priority,
    Sample: item.sampleId,
    Analyse: item.analysisType,
    Tech: item.technicianId,
    Equip: item.equipmentId,
    Début: item.startTime,
    Fin: item.endTime,
    Durée: item.duration + "mn"
})));

// Affichage des métriques calculées
console.log("\n📈 MÉTRIQUES :");
console.log(result.metrics);