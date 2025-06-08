export class ConstructionSpawner{
    	public static CreateExtensionSites() {
		if (Game.spawns["Spawn1"].spawning) {
			return;
		}
		const extensionPerLevel: Record<number, number> = {
			1: 0,
			2: 5,
			3: 10,
			4: 20,
			5: 30,
			6: 40,
			7: 50,
			8: 60
		};

		var room = Game.spawns["Spawn1"].room;

		const extensionStructures = Game.spawns["Spawn1"].room.find(FIND_STRUCTURES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}
		});
        const extensionContructionSites = Game.spawns["Spawn1"].room.find(FIND_CONSTRUCTION_SITES, {
			filter: structure => {
				return structure.structureType == STRUCTURE_EXTENSION;
			}
		});

		if (room.controller && (extensionStructures.length + extensionContructionSites.length) < extensionPerLevel[room.controller?.level]) {
			var spawner = Game.spawns["Spawn1"];
			var lastConstructionSite = extensionContructionSites[extensionContructionSites.length - 1];
			var lastPos =  lastConstructionSite?.pos ?? spawner.pos;
			console.log("Creating construction site for extension at: " + (lastPos.x - 1) + ", " + lastPos.y);
			room.createConstructionSite(lastPos.x - 1, lastPos.y, STRUCTURE_EXTENSION);
		}
	}
}
